const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'mental-health-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// In-memory storage (replace with database later)
let users = [];
let moodEntries = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// OTP storage (in production, use Redis or database)
const otpStore = new Map();

// Email transporter (using Gmail for demo - in production use proper email service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-app-password'     // Replace with your app password
    }
});

// For demo purposes, we'll use a mock email function
function sendMockEmail(to, subject, text) {
    console.log('=== MOCK EMAIL SENT ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', text);
    console.log('=======================');
    return Promise.resolve();
}

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset OTP - Mental Health Tracker',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #667eea;">Password Reset Request</h2>
                <p>You have requested to reset your password for the Mental Health Tracker application.</p>
                <p>Your 6-digit OTP is:</p>
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <h1 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p><strong>This OTP will expire in 10 minutes.</strong></p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated email from Mental Health Tracker. Please do not reply to this email.
                </p>
            </div>
        `
    };

    try {
        // For demo, use mock email function
        await sendMockEmail(email, mailOptions.subject, `Your OTP is: ${otp}`);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

// Content filtering and age verification
const inappropriateWords = [
    'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'piss', 'dick', 'cock', 'pussy', 'cunt',
    'fucker', 'motherfucker', 'bastard', 'slut', 'whore', 'nigger', 'faggot', 'dyke', 'retard',
    'kill', 'suicide', 'die', 'death', 'hate', 'stupid', 'idiot', 'moron', 'dumb', 'ugly', 'fat'
];

const explicitContent = {
    music: [
        {
            title: "Explicit Song Example",
            artist: "Explicit Artist",
            url: "https://www.youtube.com/embed/example",
            type: "youtube",
            duration: "3:30",
            description: "This is explicit content for adults only",
            genre: "Explicit",
            ageRestriction: 18
        }
    ],
    videos: [
        {
            title: "Explicit Video Example",
            url: "https://www.youtube.com/embed/example",
            duration: "2:00",
            description: "This is explicit content for adults only",
            category: "explicit",
            ageRestriction: 18
        }
    ]
};

// Content filtering function
function filterInappropriateContent(text) {
    if (!text) return { isAppropriate: true, filteredText: text };
    
    const lowerText = text.toLowerCase();
    const foundWords = inappropriateWords.filter(word => lowerText.includes(word));
    
    return {
        isAppropriate: foundWords.length === 0,
        filteredText: text,
        inappropriateWords: foundWords
    };
}

// Age-appropriate content filtering
function filterContentByAge(content, userAge) {
    if (userAge >= 18) {
        return content; // Show all content for adults
    } else if (userAge >= 13) {
        // Filter out explicit content for teens
        return content.filter(item => !item.ageRestriction || item.ageRestriction <= 13);
    } else {
        // Show only family-friendly content for children
        return content.filter(item => !item.ageRestriction || item.ageRestriction === 'all');
    }
}

// Music and Video Content Database
const musicContent = [
    // Family-friendly content (all ages)
    {
        title: "Happy",
        artist: "Pharrell Williams",
        url: "https://www.youtube.com/embed/ZbZSe6N_BXs",
        type: "youtube",
        duration: "3:53",
        description: "Uplifting pop song to boost your mood",
        genre: "Pop",
        ageRestriction: "all"
    },
    {
        title: "Can't Stop the Feeling!",
        artist: "Justin Timberlake",
        url: "https://www.youtube.com/embed/ru0K8uYEZWw",
        type: "youtube",
        duration: "3:56",
        description: "Feel-good dance pop song",
        genre: "Pop",
        ageRestriction: "all"
    },
    {
        title: "Shake It Off",
        artist: "Taylor Swift",
        url: "https://www.youtube.com/embed/nfWlot6h_JM",
        type: "youtube",
        duration: "3:39",
        description: "Upbeat song about ignoring negativity",
        genre: "Pop",
        ageRestriction: "all"
    },
    // Indian Music (all ages)
    {
        title: "Jai Ho",
        artist: "A.R. Rahman",
        url: "https://www.youtube.com/embed/COYzBLzrqGI",
        type: "youtube",
        duration: "5:20",
        description: "Celebratory Bollywood song",
        genre: "Indian",
        ageRestriction: "all"
    },
    {
        title: "Chaiyya Chaiyya",
        artist: "A.R. Rahman",
        url: "https://www.youtube.com/embed/8iL5vCHsWqE",
        type: "youtube",
        duration: "6:56",
        description: "Peaceful Indian fusion song",
        genre: "Indian",
        ageRestriction: "all"
    },
    // Teen-friendly content (13+)
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        url: "https://www.youtube.com/embed/4NRXx6U8ABQ",
        type: "youtube",
        duration: "3:20",
        description: "Energetic synth-pop song",
        genre: "Pop",
        ageRestriction: 13
    },
    {
        title: "Dance Monkey",
        artist: "Tones and I",
        url: "https://www.youtube.com/embed/q0hyYWKXF0Q",
        type: "youtube",
        duration: "3:29",
        description: "Catchy pop song with unique vocals",
        genre: "Pop",
        ageRestriction: 13
    },
    // Adult content (18+)
    {
        title: "Explicit Song Example",
        artist: "Explicit Artist",
        url: "https://www.youtube.com/embed/example",
        type: "youtube",
        duration: "3:30",
        description: "This is explicit content for adults only",
        genre: "Explicit",
        ageRestriction: 18
    }
];

const funnyVideos = [
    // Family-friendly videos (all ages)
    {
        title: "Funny Baby Laughing",
        url: "https://www.youtube.com/embed/example1",
        duration: "1:30",
        description: "Adorable baby laughing at funny sounds",
        category: "babies",
        ageRestriction: "all"
    },
    {
        title: "Cute Puppy Playing",
        url: "https://www.youtube.com/embed/example2",
        duration: "2:15",
        description: "Adorable puppy playing with toys",
        category: "animals",
        ageRestriction: "all"
    },
    {
        title: "Funny Cat Compilation",
        url: "https://www.youtube.com/embed/example3",
        duration: "3:45",
        description: "Hilarious cat moments",
        category: "animals",
        ageRestriction: "all"
    },
    // Teen-friendly videos (13+)
    {
        title: "Teen Comedy Skit",
        url: "https://www.youtube.com/embed/example4",
        duration: "2:30",
        description: "Funny teen comedy sketch",
        category: "comedy",
        ageRestriction: 13
    },
    {
        title: "School Life Comedy",
        url: "https://www.youtube.com/embed/example5",
        duration: "3:20",
        description: "Relatable school humor",
        category: "comedy",
        ageRestriction: 13
    },
    // Adult content (18+)
    {
        title: "Explicit Comedy Video",
        url: "https://www.youtube.com/embed/example6",
        duration: "4:00",
        description: "This is explicit content for adults only",
        category: "explicit",
        ageRestriction: 18
    }
];

// Enhanced meditation and exercise content
const meditationContent = {
    beginner: [
        {
            title: "5-Minute Breathing Meditation",
            description: "Simple breathing exercise for beginners",
            duration: "5 minutes",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            video: "https://www.youtube.com/embed/inpok4MKVLM",
            type: "breathing"
        },
        {
            title: "Body Scan Meditation",
            description: "Progressive relaxation technique",
            duration: "10 minutes",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
            video: "https://www.youtube.com/embed/1ZYbU82GVz4",
            type: "body-scan"
        }
    ],
    intermediate: [
        {
            title: "Mindfulness Meditation",
            description: "Focus on present moment awareness",
            duration: "15 minutes",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            video: "https://www.youtube.com/embed/1ZYbU82GVz4",
            type: "mindfulness"
        },
        {
            title: "Loving-Kindness Meditation",
            description: "Cultivate compassion and love",
            duration: "20 minutes",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
            video: "https://www.youtube.com/embed/inpok4MKVLM",
            type: "loving-kindness"
        }
    ],
    advanced: [
        {
            title: "Vipassana Meditation",
            description: "Insight meditation for deep awareness",
            duration: "30 minutes",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            video: "https://www.youtube.com/embed/1ZYbU82GVz4",
            type: "vipassana"
        }
    ]
};

const exerciseContent = {
    low_intensity: [
        {
            title: "Gentle Stretching",
            description: "Basic stretching exercises for relaxation",
            duration: "10 minutes",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
            video: "https://www.youtube.com/embed/StXac04arIY",
            type: "stretching"
        },
        {
            title: "Walking Meditation",
            description: "Mindful walking for stress relief",
            duration: "15 minutes",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            video: "https://www.youtube.com/embed/inpok4MKVLM",
            type: "walking"
        }
    ],
    moderate: [
        {
            title: "Yoga Flow",
            description: "Gentle yoga sequence for mental wellness",
            duration: "20 minutes",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
            video: "https://www.youtube.com/embed/StXac04arIY",
            type: "yoga"
        },
        {
            title: "Tai Chi",
            description: "Slow, flowing movements for balance",
            duration: "25 minutes",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
            video: "https://www.youtube.com/embed/1ZYbU82GVz4",
            type: "tai-chi"
        }
    ],
    high_intensity: [
        {
            title: "Cardio Workout",
            description: "High-energy exercise for mood boost",
            duration: "30 minutes",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            video: "https://www.youtube.com/embed/StXac04arIY",
            type: "cardio"
        },
        {
            title: "Strength Training",
            description: "Build strength and confidence",
            duration: "45 minutes",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
            video: "https://www.youtube.com/embed/1ZYbU82GVz4",
            type: "strength"
        }
    ]
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, consent } = req.body;

        if (!consent) {
            return res.status(400).json({ error: 'Consent is required to proceed' });
        }

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            consent: true,
            createdAt: new Date()
        };

        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
        { userId: user.id, email: user.email, age: user.age },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            age: user.age,
            email: user.email,
            year: user.year,
            courseWork: user.courseWork,
            sleepHours: user.sleepHours
        }
    });
});

// Save mood entry
app.post('/api/mood', authenticateToken, (req, res) => {
    const { mood, severity, feelings, incidentText } = req.body;
    const userId = req.user.userId;
    const userAge = req.user.age;
    
    // Content filtering for incident text
    const contentFilter = filterInappropriateContent(incidentText);
    
    const moodEntry = {
        id: Date.now().toString(),
        userId,
        mood,
        severity,
        feelings: feelings || [],
        incidentText: contentFilter.filteredText,
        contentWarning: !contentFilter.isAppropriate,
        inappropriateWords: contentFilter.inappropriateWords,
        timestamp: new Date().toISOString()
    };
    
    moodEntries.push(moodEntry);
    
    // Generate age-appropriate recommendations
    const recommendations = generateAgeAppropriateRecommendations(mood, severity, userAge, contentFilter);
    
    res.json({
        message: 'Mood entry saved successfully',
        moodEntry,
        recommendations,
        contentWarning: !contentFilter.isAppropriate
    });
});

// Get user's mood history
app.get('/api/mood/history', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const userMoodEntries = moodEntries.filter(entry => entry.userId === userId);
        
        res.json({
            entries: userMoodEntries
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get music recommendations based on mood
app.get('/api/music/:mood', (req, res) => {
    try {
        const { mood } = req.params;
        const { genre, search } = req.query;
        let music = musicContent;
        
        // Filter by mood if specified and not 'all'
        if (mood && mood !== 'all') {
            music = music.filter(track => 
                track.genre && track.genre.toLowerCase().includes(mood.toLowerCase())
            );
        }
        
        // Filter by genre if specified
        if (genre && genre !== 'all') {
            music = music.filter(track => 
                track.genre && track.genre.toLowerCase().includes(genre.toLowerCase())
            );
        }
        
        // Filter by search term if specified
        if (search && search.trim()) {
            const searchTerm = search.toLowerCase().trim();
            music = music.filter(track => 
                track.title.toLowerCase().includes(searchTerm) ||
                track.artist.toLowerCase().includes(searchTerm) ||
                track.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Shuffle music for variety
        music = music.sort(() => Math.random() - 0.5);
        
        res.json({
            mood,
            tracks: music.slice(0, 6), // Return 6 tracks
            searchTerm: search || null,
            totalResults: music.length
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get funny videos for stress relief
app.get('/api/videos/funny', (req, res) => {
    try {
        const { category, search } = req.query;
        let videos = funnyVideos;
        
        // Filter by category if specified
        if (category && category !== 'all') {
            videos = videos.filter(video => 
                video.category && video.category.toLowerCase().includes(category.toLowerCase())
            );
        }
        
        // Filter by search term if specified
        if (search && search.trim()) {
            const searchTerm = search.toLowerCase().trim();
            videos = videos.filter(video => 
                video.title.toLowerCase().includes(searchTerm) ||
                video.description.toLowerCase().includes(searchTerm) ||
                video.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Shuffle videos for variety
        videos = videos.sort(() => Math.random() - 0.5);
        
        res.json({
            videos: videos.slice(0, 6), // Return 6 videos
            searchTerm: search || null,
            totalResults: videos.length
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get recommendations
app.get('/api/recommendations', authenticateToken, (req, res) => {
    const userAge = req.user.age;
    
    // Filter content by age
    const filteredMusic = filterContentByAge(musicContent, userAge);
    const filteredVideos = filterContentByAge(funnyVideos, userAge);
    
    // Get user's recent mood for personalized recommendations
    const userMoodEntries = moodEntries.filter(entry => entry.userId === req.user.userId);
    const recentMood = userMoodEntries.length > 0 ? userMoodEntries[userMoodEntries.length - 1] : null;
    
    let recommendations = {
        meditation: [],
        activities: [],
        music: filteredMusic,
        videos: filteredVideos,
        meditationContent: [],
        exerciseContent: [],
        professionalHelp: false
    };
    
    // Generate personalized recommendations based on recent mood
    if (recentMood) {
        const moodRecommendations = generateAgeAppropriateRecommendations(
            recentMood.mood, 
            recentMood.severity, 
            userAge, 
            { isAppropriate: !recentMood.contentWarning }
        );
        
        recommendations.meditation = moodRecommendations.meditation;
        recommendations.activities = moodRecommendations.activities;
        recommendations.professionalHelp = moodRecommendations.professionalHelp;
        
        // Add meditation content based on severity
        if (recentMood.severity === 'low' || recentMood.severity === 'medium') {
            recommendations.meditationContent = [
                ...meditationContent.beginner,
                ...meditationContent.intermediate
            ];
        } else {
            recommendations.meditationContent = meditationContent.beginner;
        }
        
        // Add exercise content based on severity
        if (recentMood.severity === 'low') {
            recommendations.exerciseContent = exerciseContent.low_intensity;
        } else if (recentMood.severity === 'medium') {
            recommendations.exerciseContent = [
                ...exerciseContent.low_intensity,
                ...exerciseContent.moderate
            ];
        } else {
            recommendations.exerciseContent = exerciseContent.low_intensity;
        }
    } else {
        // Default recommendations for new users
        recommendations.meditationContent = meditationContent.beginner;
        recommendations.exerciseContent = exerciseContent.low_intensity;
    }
    
    res.json(recommendations);
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
    const { username, age, email, password, year, courseWork, sleepHours } = req.body;
    
    // Validate age
    const userAge = parseInt(age);
    if (userAge < 13) {
        return res.status(400).json({ 
            error: 'You must be at least 13 years old to use this service. If you are under 18, please ensure you have parental consent.' 
        });
    }
    
    // Validate and process email
    let finalEmail = email;
    let emailProvided = true;
    
    if (!email || email.trim() === '') {
        // No email provided, generate default
        finalEmail = generateDefaultEmail(username);
        emailProvided = false;
    } else if (!isValidEmail(email)) {
        // Invalid email format, generate default
        finalEmail = generateDefaultEmail(username);
        emailProvided = false;
    } else if (isEmailInUse(email)) {
        // Email already exists, generate unique default
        finalEmail = generateDefaultEmail(username);
        emailProvided = false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        age: userAge,
        email: finalEmail,
        emailProvided: emailProvided,
        password: bcrypt.hashSync(password, 10),
        year: year || null,
        courseWork: courseWork || null,
        sleepHours: sleepHours || null,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, age: newUser.age },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        message: emailProvided ? 'User created successfully' : 'User created successfully with default email',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            age: newUser.age,
            email: newUser.email,
            emailProvided: newUser.emailProvided,
            year: newUser.year,
            courseWork: newUser.courseWork,
            sleepHours: newUser.sleepHours
        }
    });
});

// Generate age-appropriate recommendations
function generateAgeAppropriateRecommendations(mood, severity, userAge, contentFilter) {
    let recommendations = {
        meditation: [],
        activities: [],
        music: [],
        videos: [],
        professionalHelp: false,
        contentWarning: false
    };
    
    // Content warning for inappropriate language
    if (!contentFilter.isAppropriate) {
        recommendations.contentWarning = true;
        recommendations.professionalHelp = true;
        
        if (userAge < 18) {
            recommendations.meditation.push("Consider talking to a school counselor or trusted adult");
            recommendations.activities.push("Take a break and do something calming like drawing or reading");
        } else {
            recommendations.meditation.push("Consider speaking with a mental health professional");
            recommendations.activities.push("Practice deep breathing exercises");
        }
    }
    
    // Mood-based recommendations
    if (mood === 'happy' || mood === 'excited') {
        recommendations.meditation.push("Practice gratitude meditation");
        recommendations.activities.push("Share your joy with friends and family");
        recommendations.activities.push("Try a new hobby or activity");
    } else if (mood === 'calm' || mood === 'neutral') {
        recommendations.meditation.push("Mindfulness meditation");
        recommendations.activities.push("Take a peaceful walk");
        recommendations.activities.push("Read a book or listen to calming music");
    } else if (mood === 'sad' || mood === 'depressed') {
        recommendations.meditation.push("Loving-kindness meditation");
        recommendations.activities.push("Talk to someone you trust");
        recommendations.activities.push("Write in a journal");
        
        if (severity === 'high' || severity === 'severe') {
            recommendations.professionalHelp = true;
        }
    } else if (mood === 'anxious' || mood === 'stressed') {
        recommendations.meditation.push("Progressive muscle relaxation");
        recommendations.activities.push("Deep breathing exercises");
        recommendations.activities.push("Take a warm bath or shower");
        
        if (severity === 'high' || severity === 'severe') {
            recommendations.professionalHelp = true;
        }
    }
    
    // Age-specific recommendations
    if (userAge < 13) {
        // Child-friendly recommendations
        recommendations.meditation.push("Try guided meditation for kids");
        recommendations.activities.push("Play with friends or family");
        recommendations.activities.push("Draw or color");
        recommendations.activities.push("Read a fun book");
    } else if (userAge < 18) {
        // Teen-friendly recommendations
        recommendations.meditation.push("Try meditation apps designed for teens");
        recommendations.activities.push("Listen to your favorite music");
        recommendations.activities.push("Exercise or play sports");
        recommendations.activities.push("Talk to friends or family");
    } else {
        // Adult recommendations
        recommendations.meditation.push("Try mindfulness or meditation apps");
        recommendations.activities.push("Exercise or go for a run");
        recommendations.activities.push("Call a friend or family member");
        recommendations.activities.push("Practice a hobby or skill");
    }
    
    return recommendations;
}

// Check content for inappropriate language
app.post('/api/check-content', authenticateToken, (req, res) => {
    const { text } = req.body;
    const contentFilter = filterInappropriateContent(text);
    
    res.json({
        contentWarning: !contentFilter.isAppropriate,
        inappropriateWords: contentFilter.inappropriateWords
    });
});

// Verify token endpoint
app.get('/api/verify-token', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (user) {
        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                age: user.age,
                email: user.email,
                year: user.year,
                courseWork: user.courseWork,
                sleepHours: user.sleepHours
            }
        });
    } else {
        res.status(401).json({ valid: false });
    }
});

// Forgot password - Send OTP
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    // Check if user exists
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ error: 'No account found with this email address' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    // Store OTP with expiry
    otpStore.set(email, {
        otp,
        expiry: otpExpiry,
        attempts: 0
    });
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent) {
        res.json({ 
            message: 'OTP sent successfully to your email',
            email: email // Return email for frontend reference
        });
    } else {
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    const otpData = otpStore.get(email);
    if (!otpData) {
        return res.status(400).json({ error: 'OTP not found or expired' });
    }
    
    // Check if OTP is expired
    if (Date.now() > otpData.expiry) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    
    // Check if too many attempts
    if (otpData.attempts >= 3) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }
    
    // Verify OTP
    if (otpData.otp !== otp) {
        otpData.attempts += 1;
        otpStore.set(email, otpData);
        return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }
    
    // OTP is valid - mark as verified
    otpData.verified = true;
    otpStore.set(email, otpData);
    
    res.json({ 
        message: 'OTP verified successfully',
        email: email
    });
});

// Reset password
app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    
    const otpData = otpStore.get(email);
    if (!otpData || !otpData.verified) {
        return res.status(400).json({ error: 'Please verify your OTP first' });
    }
    
    // Check if OTP is still valid (within 10 minutes of verification)
    if (Date.now() > otpData.expiry) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    
    // Find user and update password
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash new password
    user.password = bcrypt.hashSync(newPassword, 10);
    
    // Clear OTP data
    otpStore.delete(email);
    
    res.json({ 
        message: 'Password reset successfully. You can now login with your new password.' 
    });
});

// Resend OTP
app.post('/api/resend-otp', async (req, res) => {
    const { email } = req.body;
    
    // Check if user exists
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ error: 'No account found with this email address' });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    // Store new OTP
    otpStore.set(email, {
        otp,
        expiry: otpExpiry,
        attempts: 0
    });
    
    // Send new OTP email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent) {
        res.json({ 
            message: 'New OTP sent successfully to your email',
            email: email
        });
    } else {
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate unique default email
function generateDefaultEmail(username) {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `user_${username.toLowerCase().replace(/[^a-z0-9]/g, '')}_${timestamp}_${randomSuffix}@mentalhealthtracker.com`;
}

// Check if email is already in use
function isEmailInUse(email) {
    return users.find(user => user.email === email);
}

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { username, age, email, year, courseWork, sleepHours, password, confirmPassword } = req.body;
        const userId = req.user.userId;
        
        // Find user
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = users[userIndex];
        
        // Validate age
        const userAge = parseInt(age);
        if (userAge < 13) {
            return res.status(400).json({ 
                error: 'You must be at least 13 years old to use this service.' 
            });
        }
        
        // Validate and process email
        let finalEmail = user.email;
        let emailProvided = user.emailProvided;
        
        if (email && email.trim() !== '' && email !== user.email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ 
                    error: 'Please enter a valid email address (must contain @ and domain)' 
                });
            }
            
            if (isEmailInUse(email)) {
                return res.status(400).json({ 
                    error: 'This email address is already in use by another account' 
                });
            }
            
            finalEmail = email;
            emailProvided = true;
        }
        
        // Validate password if provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ 
                    error: 'Password must be at least 6 characters long' 
                });
            }
            
            if (password !== confirmPassword) {
                return res.status(400).json({ 
                    error: 'Passwords do not match' 
                });
            }
        }
        
        // Update user data
        const updatedUser = {
            ...user,
            username: username || user.username,
            age: userAge || user.age,
            email: finalEmail,
            emailProvided: emailProvided,
            year: year || user.year,
            courseWork: courseWork || user.courseWork,
            sleepHours: sleepHours || user.sleepHours,
            updatedAt: new Date().toISOString()
        };
        
        // Update password if provided
        if (password) {
            updatedUser.password = await bcrypt.hash(password, 10);
        }
        
        // Update user in array
        users[userIndex] = updatedUser;
        
        // Generate new JWT token
        const token = jwt.sign(
            { userId: updatedUser.id, email: updatedUser.email, age: updatedUser.age },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Profile updated successfully',
            token,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                age: updatedUser.age,
                email: updatedUser.email,
                emailProvided: updatedUser.emailProvided,
                year: updatedUser.year,
                courseWork: updatedUser.courseWork,
                sleepHours: updatedUser.sleepHours
            }
        });
        
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const user = users.find(user => user.id === userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            user: {
                id: user.id,
                username: user.username,
                age: user.age,
                email: user.email,
                emailProvided: user.emailProvided,
                year: user.year,
                courseWork: user.courseWork,
                sleepHours: user.sleepHours,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});