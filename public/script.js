// Global variables
let currentUser = null;
let currentMood = null;
let currentSeverity = null;
let selectedFeelings = [];
let sessionTimeout = null;
let lastActivity = Date.now();
let currentForgotEmail = '';
let originalProfileData = null;

// Local storage keys
const STORAGE_KEYS = {
    USER_SELECTIONS: 'userSelections',
    MOOD_HISTORY: 'moodHistory',
    MUSIC_HISTORY: 'musicHistory',
    VIDEO_HISTORY: 'videoHistory',
    LAST_MOOD: 'lastMood',
    LAST_SEVERITY: 'lastSeverity',
    LAST_FEELINGS: 'lastFeelings'
};

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const healthcareModal = document.getElementById('healthcareModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const getStartedBtn = document.getElementById('getStartedBtn');
const moodCards = document.querySelectorAll('.mood-card');
const severityBtns = document.querySelectorAll('.severity-btn');
const feelingTags = document.querySelectorAll('.feeling-tag');
const incidentText = document.getElementById('incidentText');
const saveMoodBtn = document.getElementById('saveMoodBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const successMessage = document.getElementById('successMessage');
const contentWarning = document.getElementById('contentWarning');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const closeButtons = document.querySelectorAll('.close');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotEmailForm = document.getElementById('forgotEmailForm');
const forgotOtpForm = document.getElementById('forgotOtpForm');
const forgotNewPasswordForm = document.getElementById('forgotNewPasswordForm');
const backToLogin = document.getElementById('backToLogin');
const resendOtp = document.getElementById('resendOtp');
const backToEmail = document.getElementById('backToEmail');
const forgotStep1 = document.getElementById('forgotStep1');
const forgotStep2 = document.getElementById('forgotStep2');
const forgotStep3 = document.getElementById('forgotStep3');

// Search functionality
const musicSearchInput = document.getElementById('musicSearchInput');
const musicSearchBtn = document.getElementById('musicSearchBtn');
const videoSearchInput = document.getElementById('videoSearchInput');
const videoSearchBtn = document.getElementById('videoSearchBtn');
const musicCategoryBtns = document.querySelectorAll('.music-category-btn');
const videoCategoryBtns = document.querySelectorAll('.video-category-btn');

// Advisor Support Prompt Logic
const advisorSupportPrompt = document.getElementById('advisorSupportPrompt');
const openHealthcareModalBtn = document.getElementById('openHealthcareModal');

// Page Navigation
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Handle special case for mood-tracker page
    const actualPageId = pageId === 'mood-tracker' ? 'moodTracker' : pageId;
    const targetPage = document.getElementById(actualPageId + 'Page');
    const targetLink = document.querySelector(`[data-page="${pageId}"]`);
    
    if (targetPage) targetPage.classList.add('active');
    if (targetLink) targetLink.classList.add('active');
    
    // Initialize specific page functionality
    if (pageId === 'music') {
        setTimeout(initializeSearch, 100);
    } else if (pageId === 'videos') {
        setTimeout(initializeSearch, 100);
    } else if (pageId === 'recommendations') {
        setTimeout(loadRecommendations, 100);
    } else if (pageId === 'profile') {
        setTimeout(loadProfile, 100);
    }
    
    updateActivity();
}

// Navigation event listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
        }
    });
});

// Get Started button
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        if (currentUser) {
            showPage('mood-tracker');
        } else {
            signupModal.style.display = 'block';
        }
    });
}

// Learn More button
if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
        scrollToContent();
    });
}

// Authentication functions
async function registerUser(userData) {
    try {
        showLoading();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        hideLoading();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUIAfterAuth();
            hideModal(signupModal);
            showSuccess('Account created successfully!');
        } else {
            showError(data.error);
        }
    } catch (error) {
        hideLoading();
        showError('Network error. Please try again.');
    }
}

async function loginUser(credentials) {
    try {
        showLoading();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        hideLoading();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUIAfterAuth();
            hideModal(loginModal);
            showSuccess('Login successful!');
        } else {
            showError(data.error);
        }
    } catch (error) {
        hideLoading();
        showError('Network error. Please try again.');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUIAfterLogout();
    showSuccess('Logged out successfully!');
    
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        sessionTimeout = null;
    }
}

// Form submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showUserInterface();
            hideModal(loginModal);
            showPage('mood-tracker');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const age = parseInt(document.getElementById('signupAge').value);
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const year = document.getElementById('signupYear').value;
    const courseWork = document.getElementById('signupCourseWork').value;
    const sleepHours = parseInt(document.getElementById('signupSleepHours').value);
    const consent = document.getElementById('consentCheckbox').checked;
    const ageConsent = document.getElementById('ageConsentCheckbox').checked;
    
    if (!consent || !ageConsent) {
        alert('Please check all required consent boxes.');
        return;
    }
    
    if (age < 13) {
        alert('You must be at least 13 years old to use this service.');
        return;
    }
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username, 
                age, 
                email, 
                password, 
                year, 
                courseWork, 
                sleepHours 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showUserInterface();
            hideModal(signupModal);
            showPage('mood-tracker');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Signup failed. Please try again.');
    }
});

// Mood tracking functionality
moodCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove previous selection
        moodCards.forEach(c => c.classList.remove('selected'));
        
        // Select current card
        card.classList.add('selected');
        currentMood = card.getAttribute('data-mood');
        
        // Show severity section
        document.getElementById('severitySection').classList.remove('hidden');
        
        // Scroll to severity section
        document.getElementById('severitySection').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Save selections
        saveUserSelections();
        updateActivity();
    });
});

// Severity selection
severityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove previous selection
        severityBtns.forEach(b => b.classList.remove('selected'));
        
        // Select current button
        btn.classList.add('selected');
        currentSeverity = btn.getAttribute('data-severity');
        
        // Show feelings section
        document.getElementById('feelingsSection').classList.remove('hidden');
        
        // Scroll to feelings section
        document.getElementById('feelingsSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Save selections
        saveUserSelections();
        updateActivity();
    });
});

// Feeling tags selection
feelingTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        const feeling = tag.getAttribute('data-feeling');
        
        if (tag.classList.contains('selected')) {
            selectedFeelings.push(feeling);
        } else {
            selectedFeelings = selectedFeelings.filter(f => f !== feeling);
        }
        
        // Show incident section
        document.getElementById('incidentSection').classList.remove('hidden');
        
        // Show save button
        document.getElementById('saveMoodBtn').classList.remove('hidden');
        
        // Scroll to incident section
        document.getElementById('incidentSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Save selections
        saveUserSelections();
        updateActivity();
    });
});

// Content filtering for incident text
if (incidentText) {
    incidentText.addEventListener('input', () => {
        const text = incidentText.value;
        if (text.length > 10) {
            // Check for inappropriate content
            fetch('/api/check-content', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text })
            })
            .then(response => response.json())
            .then(data => {
                if (data.contentWarning) {
                    contentWarning.classList.remove('hidden');
                } else {
                    contentWarning.classList.add('hidden');
                }
            });
        } else {
            contentWarning.classList.add('hidden');
        }
        checkAdvisorSupportPrompt();
        updateActivity();
    });
}

// Save mood entry
if (saveMoodBtn) {
    saveMoodBtn.addEventListener('click', async () => {
        if (!currentMood || !currentSeverity) {
            alert('Please select your mood and severity level.');
            return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to save your mood entry.');
            return;
        }
        
        const moodData = {
            mood: currentMood,
            severity: currentSeverity,
            feelings: selectedFeelings,
            incidentText: incidentText ? incidentText.value : ''
        };
        
        try {
            const response = await fetch('/api/mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(moodData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showSuccessMessage('Mood entry saved successfully!');
                
                // Show content warning if detected
                if (data.contentWarning) {
                    alert('We detected concerning language in your entry. Please consider speaking with a counselor or trusted adult.');
                }
                
                // Clear saved selections after successful save
                localStorage.removeItem(STORAGE_KEYS.USER_SELECTIONS);
                
                // Reset form
                resetMoodForm();
                
                // Navigate to recommendations
                setTimeout(() => {
                    showPage('recommendations');
                    loadRecommendations();
                }, 2000);
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Failed to save mood entry. Please try again.');
        }
    });
}

// Load music for specific mood with genre filter
async function loadMusicForMood(mood, genre = 'all', search = '') {
    try {
        const params = new URLSearchParams();
        if (genre && genre !== 'all') params.append('genre', genre);
        if (search) params.append('search', search);
        
        const response = await fetch(`/api/music/${mood}?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            displayMusicTracks(data.tracks, data.searchTerm, data.totalResults);
        } else {
            console.error('Failed to load music:', data.error);
        }
    } catch (error) {
        console.error('Error loading music:', error);
    }
}

function displayMusicTracks(tracks, searchTerm = null, totalResults = 0) {
    const musicTracksContainer = document.getElementById('musicTracks');
    musicTracksContainer.innerHTML = '';
    
    // Show search results info if searching
    if (searchTerm) {
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';
        resultsInfo.innerHTML = `Search results for "${searchTerm}": ${totalResults} tracks found`;
        musicTracksContainer.appendChild(resultsInfo);
    }
    
    if (tracks.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-music"></i>
            <p>No music found matching your search.</p>
            <p>Try different keywords or browse by genre.</p>
        `;
        musicTracksContainer.appendChild(noResults);
        return;
    }
    
    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.className = 'music-track';
        trackElement.innerHTML = `
            <h4>${track.title}</h4>
            <div class="artist">${track.artist}</div>
            <div class="genre">${track.genre || 'Various'}</div>
            <div class="duration">${track.duration}</div>
            <div class="description">${track.description}</div>
            <div class="track-actions">
                <button class="btn btn-small btn-primary play-track-btn" data-track='${JSON.stringify(track)}'>
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="btn btn-small btn-secondary add-to-favorites-btn" data-track='${JSON.stringify(track)}'>
                    <i class="fas fa-heart"></i> Favorite
                </button>
            </div>
            <iframe 
                class="music-player-embed"
                src="${track.url}?autoplay=0&controls=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
        
        // Add click event listeners for tracking
        const playBtn = trackElement.querySelector('.play-track-btn');
        const favoriteBtn = trackElement.querySelector('.add-to-favorites-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                saveMusicHistory(track);
                showSuccessMessage(`Now playing: ${track.title} by ${track.artist}`);
            });
        }
        
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                saveToFavorites(track);
                showSuccessMessage(`Added ${track.title} to favorites!`);
            });
        }
        
        musicTracksContainer.appendChild(trackElement);
    });
}

// Load funny videos with category filter
async function loadFunnyVideos(category = 'all', search = '') {
    try {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search) params.append('search', search);
        
        const response = await fetch(`/api/videos/funny?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            displayFunnyVideos(data.videos, data.searchTerm, data.totalResults);
        } else {
            console.error('Failed to load videos:', data.error);
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function displayFunnyVideos(videos, searchTerm = null, totalResults = 0) {
    const videosContainer = document.getElementById('funnyVideos');
    if (!videosContainer) return;
    
    videosContainer.innerHTML = '';
    
    // Show search results info if searching
    if (searchTerm) {
        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';
        resultsInfo.innerHTML = `Search results for "${searchTerm}": ${totalResults} videos found`;
        videosContainer.appendChild(resultsInfo);
    }
    
    if (videos.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-video"></i>
            <p>No videos found matching your search.</p>
            <p>Try different keywords or browse by category.</p>
        `;
        videosContainer.appendChild(noResults);
        return;
    }
    
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';
        videoElement.innerHTML = `
            <h4>${video.title}</h4>
            <div class="video-duration">${video.duration}</div>
            <div class="video-description">${video.description}</div>
            <div class="video-actions">
                <button class="btn btn-small btn-primary watch-video-btn" data-video='${JSON.stringify(video)}'>
                    <i class="fas fa-play"></i> Watch
                </button>
                <button class="btn btn-small btn-secondary add-to-favorites-video-btn" data-video='${JSON.stringify(video)}'>
                    <i class="fas fa-heart"></i> Favorite
                </button>
            </div>
            <iframe 
                class="video-player-embed"
                src="${video.url}?autoplay=0&controls=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
        
        // Add click event listeners for tracking
        const watchBtn = videoElement.querySelector('.watch-video-btn');
        const favoriteBtn = videoElement.querySelector('.add-to-favorites-video-btn');
        
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                saveVideoHistory(video);
                showSuccessMessage(`Now watching: ${video.title}`);
            });
        }
        
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                saveToVideoFavorites(video);
                showSuccessMessage(`Added ${video.title} to favorites!`);
            });
        }
        
        videosContainer.appendChild(videoElement);
    });
}

function saveToVideoFavorites(video) {
    const videoFavorites = getFromLocalStorage('videoFavorites', []);
    const existingIndex = videoFavorites.findIndex(fav => fav.title === video.title);
    
    if (existingIndex === -1) {
        videoFavorites.push({
            ...video,
            addedAt: new Date().toISOString()
        });
        saveToLocalStorage('videoFavorites', videoFavorites);
    }
}

// Video category buttons
document.addEventListener('DOMContentLoaded', () => {
    const videoCategoryBtns = document.querySelectorAll('.video-category-btn');
    
    videoCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            videoCategoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Load videos for selected category
            const category = btn.dataset.category;
            loadFunnyVideos(category);
        });
    });
    
    // Music category buttons
    const musicCategoryBtns = document.querySelectorAll('.music-category-btn');
    
    musicCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            musicCategoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Load music for selected genre (if mood is selected)
            const genre = btn.dataset.genre;
            if (currentMood) {
                loadMusicForMood(currentMood, genre);
            }
        });
    });
    
    // Music search functionality
    const musicSearchBtn = document.getElementById('musicSearchBtn');
    const musicSearchInput = document.getElementById('musicSearchInput');
    
    if (musicSearchBtn && musicSearchInput) {
        // Search button click
        musicSearchBtn.addEventListener('click', () => {
            const searchTerm = musicSearchInput.value.trim();
            const activeGenre = document.querySelector('.music-category-btn.active').getAttribute('data-genre');
            loadMusicForMood(currentMood || 'all', activeGenre, searchTerm);
        });
        
        // Enter key press
        musicSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = musicSearchInput.value.trim();
                const activeGenre = document.querySelector('.music-category-btn.active').getAttribute('data-genre');
                loadMusicForMood(currentMood || 'all', activeGenre, searchTerm);
            }
        });
    }
    
    // Video search functionality
    const videoSearchBtn = document.getElementById('videoSearchBtn');
    const videoSearchInput = document.getElementById('videoSearchInput');
    
    if (videoSearchBtn && videoSearchInput) {
        // Search button click
        videoSearchBtn.addEventListener('click', () => {
            const searchTerm = videoSearchInput.value.trim();
            const activeCategory = document.querySelector('.video-category-btn.active').getAttribute('data-category');
            loadFunnyVideos(activeCategory, searchTerm);
        });
        
        // Enter key press
        videoSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = videoSearchInput.value.trim();
                const activeCategory = document.querySelector('.video-category-btn.active').getAttribute('data-category');
                loadFunnyVideos(activeCategory, searchTerm);
            }
        });
    }
});

// Get recommendations
async function getRecommendations(mood, severity) {
    try {
        const response = await fetch(`/api/recommendations/${mood}/${severity}`);
        const data = await response.json();
        
        if (response.ok) {
            displayRecommendations(data);
            
            // Show professional help if needed
            if (data.professionalHelp) {
                document.getElementById('professionalHelp').classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

function displayRecommendations(recommendations) {
    const meditationList = document.getElementById('meditationList');
    const activitiesList = document.getElementById('activitiesList');
    const meditationContent = document.getElementById('meditationContent');
    const exerciseContent = document.getElementById('exerciseContent');
    const professionalHelp = document.getElementById('professionalHelp');
    
    // Display traditional recommendations
    if (meditationList) {
        meditationList.innerHTML = recommendations.meditation.map(item => 
            `<li>${item}</li>`
        ).join('');
    }
    
    if (activitiesList) {
        activitiesList.innerHTML = recommendations.activities.map(item => 
            `<li>${item}</li>`
        ).join('');
    }
    
    // Display enhanced meditation content
    if (meditationContent && recommendations.meditationContent) {
        meditationContent.innerHTML = recommendations.meditationContent.map(item => `
            <div class="content-card">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <span class="duration">${item.duration}</span>
                <div class="video-container">
                    <iframe src="${item.video}" 
                            title="${item.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        `).join('');
    }
    
    // Display enhanced exercise content
    if (exerciseContent && recommendations.exerciseContent) {
        exerciseContent.innerHTML = recommendations.exerciseContent.map(item => `
            <div class="content-card">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <span class="duration">${item.duration}</span>
                <div class="video-container">
                    <iframe src="${item.video}" 
                            title="${item.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        `).join('');
    }
    
    // Show professional help if needed
    if (professionalHelp) {
        if (recommendations.professionalHelp) {
            professionalHelp.classList.remove('hidden');
        } else {
            professionalHelp.classList.add('hidden');
        }
    }
}

// Load mood history
async function loadMoodHistory() {
    try {
        const response = await fetch('/api/mood/history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayMoodHistory(data.entries);
        }
    } catch (error) {
        console.error('Error loading mood history:', error);
    }
}

function displayMoodHistory(entries) {
    const historyContainer = document.getElementById('moodHistory');
    historyContainer.innerHTML = '';
    
    if (entries.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #666;">No mood entries yet. Start tracking your mood!</p>';
        return;
    }
    
    entries.reverse().forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'mood-entry';
        
        const moodEmojis = {
            happy: '😊',
            excited: '🤩',
            calm: '😌',
            neutral: '😐',
            sad: '😢',
            anxious: '😰',
            stressed: '😤',
            depressed: '😔'
        };
        
        const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        entryElement.innerHTML = `
            <div class="mood-entry-header">
                <div class="mood-entry-details">
                    <span class="mood-entry-mood">${moodEmojis[entry.mood] || '😐'}</span>
                    <span class="mood-entry-severity severity-${entry.severity}">${entry.severity}</span>
                </div>
                <span class="mood-entry-date">${date}</span>
            </div>
            ${entry.feelings && entry.feelings.length > 0 ? `
                <div class="mood-entry-feelings">
                    ${entry.feelings.map(feeling => `<span>${feeling}</span>`).join('')}
                </div>
            ` : ''}
            ${entry.incident ? `
                <div class="mood-entry-incident">"${entry.incident}"</div>
            ` : ''}
        `;
        
        historyContainer.appendChild(entryElement);
    });
}

// Utility functions
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.querySelector('span').textContent = message;
    successMessage.classList.remove('hidden');
    
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function resetMoodForm() {
    // Reset selections
    moodCards.forEach(c => c.classList.remove('selected'));
    severityBtns.forEach(b => b.classList.remove('selected'));
    feelingTags.forEach(t => t.classList.remove('selected'));
    
    // Reset variables
    currentMood = null;
    currentSeverity = null;
    selectedFeelings = [];
    
    // Clear textarea
    incidentText.value = '';
    
    // Hide sections
    document.getElementById('severitySection').classList.add('hidden');
    document.getElementById('feelingsSection').classList.add('hidden');
    document.getElementById('incidentSection').classList.add('hidden');
    document.getElementById('saveMoodBtn').classList.add('hidden');
    contentWarning.classList.add('hidden');
}

function updateUIAfterAuth() {
    // Hide auth buttons
    loginBtn.classList.add('hidden');
    signupBtn.classList.add('hidden');
    
    // Show logout button
    logoutBtn.classList.remove('hidden');
    
    // Show mood tracker section
    document.getElementById('mood-tracker').classList.remove('hidden');
    
    // Show history section
    document.getElementById('history').classList.remove('hidden');
    
    // Show profile section
    document.getElementById('profile').classList.remove('hidden');
    
    // Load mood history
    loadMoodHistory();
}

function updateUIAfterLogout() {
    // Show auth buttons
    loginBtn.classList.remove('hidden');
    signupBtn.classList.remove('hidden');
    
    // Hide logout button
    logoutBtn.classList.add('hidden');
    
    // Hide sections
    document.getElementById('mood-tracker').classList.add('hidden');
    document.getElementById('recommendations').classList.add('hidden');
    document.getElementById('history').classList.add('hidden');
    document.getElementById('profile').classList.add('hidden');
    document.getElementById('professionalHelp').classList.add('hidden');
    
    // Reset form
    resetMoodForm();
}

// Navigation
logoutBtn.addEventListener('click', logout);

// Healthcare Resources Modal
const findResourcesBtn = document.getElementById('findResourcesBtn');

findResourcesBtn.addEventListener('click', () => {
    showModal(healthcareModal);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        updateUIAfterAuth();
    }
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to mood cards
    moodCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Add pulse animation to get started button
    getStartedBtn.addEventListener('mouseenter', () => {
        getStartedBtn.style.animation = 'pulse 1s infinite';
    });
    
    getStartedBtn.addEventListener('mouseleave', () => {
        getStartedBtn.style.animation = 'none';
    });
});

// Add pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Session Management
function resetSessionTimeout() {
    lastActivity = Date.now();
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
    }
    
    // Set timeout for 2 minutes (120000 ms)
    sessionTimeout = setTimeout(() => {
        if (currentUser) {
            alert('Session expired due to inactivity. Please login again.');
            logout();
        }
    }, 120000);
}

function updateActivity() {
    resetSessionTimeout();
}

// Activity tracking
document.addEventListener('click', updateActivity);
document.addEventListener('keypress', updateActivity);
document.addEventListener('scroll', updateActivity);
document.addEventListener('mousemove', updateActivity);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadRecommendations();
    loadMoodHistory();
    
    // Load saved user selections
    loadUserSelections();
    
    // Display favorites and music history if on recommendations page
    if (document.getElementById('favoritesContainer')) {
        displayFavorites();
    }
    if (document.getElementById('musicHistoryContainer')) {
        displayMusicHistory();
    }
    
    // Add navigation to favorites and music history
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === 'recommendations') {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    if (document.getElementById('favoritesContainer')) {
                        displayFavorites();
                    }
                    if (document.getElementById('musicHistoryContainer')) {
                        displayMusicHistory();
                    }
                }, 100);
            });
        }
    });
});

// Load recommendations
async function loadRecommendations() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch('/api/recommendations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        // Display recommendations
        displayRecommendations(data);
    } catch (error) {
        console.error('Failed to load recommendations:', error);
    }
}

function displayRecommendations(recommendations) {
    // Display meditation recommendations
    const meditationList = document.getElementById('meditationList');
    if (meditationList && recommendations.meditation) {
        meditationList.innerHTML = recommendations.meditation
            .map(item => `<li>${item}</li>`)
            .join('');
    }
    
    // Display activity recommendations
    const activitiesList = document.getElementById('activitiesList');
    if (activitiesList && recommendations.activities) {
        activitiesList.innerHTML = recommendations.activities
            .map(item => `<li>${item}</li>`)
            .join('');
    }
    
    // Display music
    if (recommendations.music) {
        displayMusicTracks(recommendations.music);
    }
    
    // Display videos
    if (recommendations.videos) {
        displayFunnyVideos(recommendations.videos);
    }
    
    // Show professional help if needed
    if (recommendations.professionalHelp) {
        document.getElementById('professionalHelp').classList.remove('hidden');
    }
}

function displayMusicTracks(tracks) {
    const musicTracks = document.getElementById('musicTracks');
    if (!musicTracks) return;
    
    musicTracks.innerHTML = tracks.map(track => `
        <div class="music-track">
            <div class="track-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
                <p class="track-duration">${track.duration}</p>
                <p class="track-description">${track.description}</p>
                ${track.ageRestriction && track.ageRestriction !== 'all' ? 
                    `<span class="content-age-indicator content-age-${track.ageRestriction}">${track.ageRestriction}+</span>` : ''}
            </div>
            <div class="track-player">
                <iframe src="${track.url}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    `).join('');
}

function displayFunnyVideos(videos) {
    const funnyVideosGrid = document.getElementById('funnyVideos');
    if (!funnyVideosGrid) return;
    
    funnyVideosGrid.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-info">
                <h4>${video.title}</h4>
                <p class="video-duration">${video.duration}</p>
                <p class="video-description">${video.description}</p>
                ${video.ageRestriction && video.ageRestriction !== 'all' ? 
                    `<span class="content-age-indicator content-age-${video.ageRestriction}">${video.ageRestriction}+</span>` : ''}
            </div>
            <div class="video-player">
                <iframe src="${video.url}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    `).join('');
}

// Check authentication on page load
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token with server
        fetch('/api/verify-token', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                currentUser = data.user;
                showUserInterface();
            } else {
                logout();
            }
        })
        .catch(() => logout());
    } else {
        showAuthButtons();
    }
}

function showAuthButtons() {
    loginBtn.classList.remove('hidden');
    signupBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    
    // Hide authenticated-only nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.classList.add('hidden');
    });
}

function showUserInterface() {
    loginBtn.classList.add('hidden');
    signupBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    
    // Show authenticated-only nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.classList.remove('hidden');
    });
    
    // Display user profile
    displayUserProfile();
    
    // Start session timeout
    resetSessionTimeout();
}

function displayUserProfile() {
    if (!currentUser) return;
    
    // Add user profile to recommendations page
    const recommendationsPage = document.getElementById('recommendationsPage');
    const existingProfile = recommendationsPage.querySelector('.user-profile');
    
    if (!existingProfile) {
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        userProfile.innerHTML = `
            <h3>Welcome, ${currentUser.username}!</h3>
            <div class="user-info">
                <div class="user-info-item">
                    <div class="user-info-label">Age</div>
                    <div class="user-info-value">${currentUser.age} years old</div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-label">Year</div>
                    <div class="user-info-value">${currentUser.year || 'Not specified'}</div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-label">Sleep Pattern</div>
                    <div class="user-info-value">${currentUser.sleepHours || 'Not specified'} hours</div>
                </div>
                <div class="user-info-item">
                    <div class="user-info-label">Account Type</div>
                    <div class="user-info-value">${currentUser.age >= 18 ? 'Adult' : currentUser.age >= 13 ? 'Teen' : 'Child'}</div>
                </div>
            </div>
        `;
        recommendationsPage.querySelector('.container').insertBefore(userProfile, recommendationsPage.querySelector('h2'));
    }
}

// Modal Functions
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking on X button
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            hideModal(modal);
        }
    });
});

// Close modal when clicking outside the modal content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
});

// Prevent modal from closing when clicking inside modal content
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Event Listeners for Modals
loginBtn.addEventListener('click', () => showModal(loginModal));
signupBtn.addEventListener('click', () => showModal(signupModal));
logoutBtn.addEventListener('click', logout);

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(loginModal);
    showModal(signupModal);
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(signupModal);
    showModal(loginModal);
});

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(loginModal);
    showModal(forgotPasswordModal);
});

backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(forgotPasswordModal);
    showModal(loginModal);
});

backToEmail.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotStep(1);
});

// Form Submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showUserInterface();
            hideModal(loginModal);
            showPage('mood-tracker');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const age = parseInt(document.getElementById('signupAge').value);
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const year = document.getElementById('signupYear').value;
    const courseWork = document.getElementById('signupCourseWork').value;
    const sleepHours = parseInt(document.getElementById('signupSleepHours').value);
    const consent = document.getElementById('consentCheckbox').checked;
    const ageConsent = document.getElementById('ageConsentCheckbox').checked;
    
    if (!consent || !ageConsent) {
        alert('Please check all required consent boxes.');
        return;
    }
    
    if (age < 13) {
        alert('You must be at least 13 years old to use this service.');
        return;
    }
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username, 
                age, 
                email, 
                password, 
                year, 
                courseWork, 
                sleepHours 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showUserInterface();
            hideModal(signupModal);
            showPage('mood-tracker');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Signup failed. Please try again.');
    }
});

function resetMoodForm() {
    moodCards.forEach(card => card.classList.remove('selected'));
    severityBtns.forEach(btn => btn.classList.remove('selected'));
    feelingTags.forEach(tag => tag.classList.remove('selected'));
    
    document.getElementById('severitySection').classList.add('hidden');
    document.getElementById('feelingsSection').classList.add('hidden');
    document.getElementById('incidentSection').classList.add('hidden');
    contentWarning.classList.add('hidden');
    
    if (incidentText) incidentText.value = '';
    
    currentMood = null;
    currentSeverity = null;
    selectedFeelings = [];
}

function showSuccessMessage(message) {
    const successMsg = document.getElementById('successMessage');
    successMsg.querySelector('span').textContent = message;
    successMsg.classList.remove('hidden');
    
    setTimeout(() => {
        successMsg.classList.add('hidden');
    }, 3000);
}

function displayMoodHistory(entries) {
    const moodHistory = document.getElementById('moodHistory');
    if (!moodHistory) return;
    
    if (entries.length === 0) {
        moodHistory.innerHTML = '<p>No mood entries yet. Start tracking your mood!</p>';
        return;
    }
    
    moodHistory.innerHTML = entries.map(entry => `
        <div class="mood-entry">
            <div class="entry-header">
                <span class="entry-date">${new Date(entry.timestamp).toLocaleDateString()}</span>
                <span class="entry-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="entry-mood">
                <span class="mood-emoji">${getMoodEmoji(entry.mood)}</span>
                <span class="mood-text">${entry.mood}</span>
                <span class="severity-badge">${entry.severity}</span>
            </div>
            ${entry.feelings && entry.feelings.length > 0 ? `
                <div class="entry-feelings">
                    <strong>Feelings:</strong> ${entry.feelings.join(', ')}
                </div>
            ` : ''}
            ${entry.incidentText ? `
                <div class="entry-incident">
                    <strong>Notes:</strong> ${entry.incidentText}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function getMoodEmoji(mood) {
    const emojiMap = {
        'happy': '😊',
        'excited': '🤩',
        'calm': '😌',
        'neutral': '😐',
        'sad': '😢',
        'anxious': '😰',
        'stressed': '😤',
        'depressed': '😔'
    };
    return emojiMap[mood] || '😐';
}

// Forgot Password Event Listeners
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(loginModal);
    showModal(forgotPasswordModal);
    resetForgotPasswordForm();
});

backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(forgotPasswordModal);
    showModal(loginModal);
});

resendOtp.addEventListener('click', (e) => {
    e.preventDefault();
    sendOTP(currentForgotEmail);
});

backToEmail.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotStep(1);
});

// Forgot Password Form Submissions
forgotEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    await sendOTP(email);
});

forgotOtpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('forgotOtp').value;
    await verifyOTP(currentForgotEmail, otp);
});

forgotNewPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('forgotNewPassword').value;
    const confirmPassword = document.getElementById('forgotConfirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    await resetPassword(currentForgotEmail, newPassword);
});

// Forgot Password Functions
async function sendOTP(email) {
    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentForgotEmail = email;
            showForgotStep(2);
            alert('OTP sent successfully! Check your email (or console for demo).');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Failed to send OTP. Please try again.');
    }
}

async function verifyOTP(email, otp) {
    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showForgotStep(3);
            alert('OTP verified successfully!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Failed to verify OTP. Please try again.');
    }
}

async function resetPassword(email, newPassword) {
    try {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Password reset successfully! You can now login with your new password.');
            hideModal(forgotPasswordModal);
            showModal(loginModal);
            resetForgotPasswordForm();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Failed to reset password. Please try again.');
    }
}

function showForgotStep(step) {
    // Hide all steps
    forgotStep1.classList.remove('active');
    forgotStep2.classList.remove('active');
    forgotStep3.classList.remove('active');
    
    // Show the specified step
    switch (step) {
        case 1:
            forgotStep1.classList.add('active');
            break;
        case 2:
            forgotStep2.classList.add('active');
            break;
        case 3:
            forgotStep3.classList.add('active');
            break;
    }
}

function resetForgotPasswordForm() {
    document.getElementById('forgotEmail').value = '';
    document.getElementById('forgotOtp').value = '';
    document.getElementById('forgotNewPassword').value = '';
    document.getElementById('forgotConfirmPassword').value = '';
    currentForgotEmail = '';
    showForgotStep(1);
}

// Music category filter
musicCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        musicCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const genre = btn.getAttribute('data-genre');
        const searchTerm = musicSearchInput ? musicSearchInput.value.trim() : '';
        loadMusicForMood(currentMood || 'all', genre, searchTerm);
    });
});

// Video category filter
videoCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        videoCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        const searchTerm = videoSearchInput ? videoSearchInput.value.trim() : '';
        loadFunnyVideos(category, searchTerm);
    });
});

// Initialize search functionality when pages load
function initializeSearch() {
    // Set default active categories
    const defaultMusicCategory = document.querySelector('.music-category-btn');
    const defaultVideoCategory = document.querySelector('.video-category-btn');
    
    if (defaultMusicCategory) {
        defaultMusicCategory.classList.add('active');
    }
    
    if (defaultVideoCategory) {
        defaultVideoCategory.classList.add('active');
    }
    
    // Load initial content
    loadMusicForMood('all', 'all', '');
    loadFunnyVideos('all', '');
}

// Local storage utility functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function saveUserSelections() {
    const selections = {
        currentMood,
        currentSeverity,
        selectedFeelings,
        timestamp: Date.now()
    };
    saveToLocalStorage(STORAGE_KEYS.USER_SELECTIONS, selections);
}

function loadUserSelections() {
    const selections = getFromLocalStorage(STORAGE_KEYS.USER_SELECTIONS, {});
    if (selections.currentMood) {
        currentMood = selections.currentMood;
        currentSeverity = selections.currentSeverity;
        selectedFeelings = selections.selectedFeelings || [];
        
        // Restore UI state
        restoreMoodUI();
    }
}

function restoreMoodUI() {
    // Restore mood selection
    if (currentMood) {
        const moodCard = document.querySelector(`[data-mood="${currentMood}"]`);
        if (moodCard) {
            moodCards.forEach(c => c.classList.remove('selected'));
            moodCard.classList.add('selected');
            document.getElementById('severitySection').classList.remove('hidden');
        }
    }
    
    // Restore severity selection
    if (currentSeverity) {
        const severityBtn = document.querySelector(`[data-severity="${currentSeverity}"]`);
        if (severityBtn) {
            severityBtns.forEach(b => b.classList.remove('selected'));
            severityBtn.classList.add('selected');
            document.getElementById('feelingsSection').classList.remove('hidden');
        }
    }
    
    // Restore feelings selection
    if (selectedFeelings.length > 0) {
        selectedFeelings.forEach(feeling => {
            const feelingTag = document.querySelector(`[data-feeling="${feeling}"]`);
            if (feelingTag) {
                feelingTag.classList.add('selected');
            }
        });
        document.getElementById('incidentSection').classList.remove('hidden');
        document.getElementById('saveMoodBtn').classList.remove('hidden');
    }
}

function saveMusicHistory(track) {
    const musicHistory = getFromLocalStorage(STORAGE_KEYS.MUSIC_HISTORY, []);
    const historyEntry = {
        ...track,
        listenedAt: new Date().toISOString(),
        userId: currentUser ? currentUser.userId : 'anonymous'
    };
    
    // Add to beginning of array (most recent first)
    musicHistory.unshift(historyEntry);
    
    // Keep only last 50 entries
    if (musicHistory.length > 50) {
        musicHistory.splice(50);
    }
    
    saveToLocalStorage(STORAGE_KEYS.MUSIC_HISTORY, musicHistory);
}

function saveVideoHistory(video) {
    const videoHistory = getFromLocalStorage(STORAGE_KEYS.VIDEO_HISTORY, []);
    const historyEntry = {
        ...video,
        watchedAt: new Date().toISOString(),
        userId: currentUser ? currentUser.userId : 'anonymous'
    };
    
    // Add to beginning of array (most recent first)
    videoHistory.unshift(historyEntry);
    
    // Keep only last 50 entries
    if (videoHistory.length > 50) {
        videoHistory.splice(50);
    }
    
    saveToLocalStorage(STORAGE_KEYS.VIDEO_HISTORY, videoHistory);
}

function saveToFavorites(track) {
    const favorites = getFromLocalStorage('favorites', []);
    const existingIndex = favorites.findIndex(fav => fav.title === track.title && fav.artist === track.artist);
    
    if (existingIndex === -1) {
        favorites.push({
            ...track,
            addedAt: new Date().toISOString()
        });
        saveToLocalStorage('favorites', favorites);
    }
}

function displayFavorites() {
    const favorites = getFromLocalStorage('favorites', []);
    const favoritesContainer = document.getElementById('favoritesContainer');
    
    if (!favoritesContainer) return;
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet. Start adding your favorite tracks!</p>';
        return;
    }
    
    favoritesContainer.innerHTML = favorites.map(track => `
        <div class="music-track">
            <h4>${track.title}</h4>
            <div class="artist">${track.artist}</div>
            <div class="genre">${track.genre || 'Various'}</div>
            <div class="duration">${track.duration}</div>
            <div class="description">${track.description}</div>
            <div class="track-actions">
                <button class="btn btn-small btn-primary play-track-btn" onclick="saveMusicHistory(${JSON.stringify(track)})">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="btn btn-small btn-danger remove-favorite-btn" onclick="removeFromFavorites('${track.title}', '${track.artist}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <iframe 
                class="music-player-embed"
                src="${track.url}?autoplay=0&controls=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
    `).join('');
}

function removeFromFavorites(title, artist) {
    const favorites = getFromLocalStorage('favorites', []);
    const updatedFavorites = favorites.filter(fav => !(fav.title === title && fav.artist === artist));
    saveToLocalStorage('favorites', updatedFavorites);
    displayFavorites();
    showSuccessMessage('Removed from favorites!');
}

function displayMusicHistory() {
    const musicHistory = getFromLocalStorage(STORAGE_KEYS.MUSIC_HISTORY, []);
    const historyContainer = document.getElementById('musicHistoryContainer');
    
    if (!historyContainer) return;
    
    if (musicHistory.length === 0) {
        historyContainer.innerHTML = '<p>No music history yet. Start listening to tracks!</p>';
        return;
    }
    
    // Get recent tracks (last 10)
    const recentTracks = musicHistory.slice(0, 10);
    
    historyContainer.innerHTML = `
        <h3>Recently Listened</h3>
        <div class="music-history-grid">
            ${recentTracks.map(track => `
                <div class="music-history-item">
                    <div class="track-info">
                        <h4>${track.title}</h4>
                        <div class="artist">${track.artist}</div>
                        <div class="genre">${track.genre || 'Various'}</div>
                        <div class="listened-at">Listened: ${new Date(track.listenedAt).toLocaleDateString()}</div>
                    </div>
                    <div class="track-actions">
                        <button class="btn btn-small btn-primary" onclick="saveMusicHistory(${JSON.stringify(track)})">
                            <i class="fas fa-play"></i> Play Again
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Profile functionality

// Load profile data
async function loadProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showPage('home');
            return;
        }

        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            populateProfileForm(data.user);
            originalProfileData = { ...data.user };
            updateProfileStats();
        } else {
            console.error('Failed to load profile:', data.error);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Populate profile form with user data
function populateProfileForm(user) {
    document.getElementById('profileUsername').value = user.username || '';
    document.getElementById('profileAge').value = user.age || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileYear').value = user.year || '';
    document.getElementById('profileCourseWork').value = user.courseWork || '';
    document.getElementById('profileSleepHours').value = user.sleepHours || '';
    
    // Show email note if default email was assigned
    const emailNote = document.getElementById('emailNote');
    if (!user.emailProvided) {
        emailNote.textContent = 'Default email assigned. You can update this to a valid email address.';
        emailNote.style.color = '#e74c3c';
    } else {
        emailNote.textContent = '';
    }
    
    // Load profile picture if exists
    loadProfilePicture();
}

// Load profile picture from localStorage
function loadProfilePicture() {
    const profilePic = localStorage.getItem('profilePicture');
    if (profilePic) {
        const profilePictureElement = document.getElementById('profilePicture');
        profilePictureElement.innerHTML = `<img src="${profilePic}" alt="Profile Picture">`;
    }
}

// Update profile statistics
function updateProfileStats() {
    // Get mood entries count
    const moodHistory = getFromLocalStorage(STORAGE_KEYS.MOOD_HISTORY, []);
    document.getElementById('totalMoodEntries').textContent = moodHistory.length;
    
    // Get music history count
    const musicHistory = getFromLocalStorage(STORAGE_KEYS.MUSIC_HISTORY, []);
    document.getElementById('totalMusicListened').textContent = musicHistory.length;
    
    // Get favorites count
    const favorites = getFromLocalStorage('favorites', []);
    const videoFavorites = getFromLocalStorage('videoFavorites', []);
    document.getElementById('totalFavorites').textContent = favorites.length + videoFavorites.length;
    
    // Calculate days active
    const allActivities = [...moodHistory, ...musicHistory];
    const uniqueDates = new Set();
    allActivities.forEach(activity => {
        const date = new Date(activity.timestamp || activity.listenedAt).toDateString();
        uniqueDates.add(date);
    });
    document.getElementById('daysActive').textContent = uniqueDates.size;
}

// Profile form submission
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const resetProfileBtn = document.getElementById('resetProfileBtn');
    const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
    const profilePicInput = document.getElementById('profilePicInput');
    
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('profileUsername').value,
                age: parseInt(document.getElementById('profileAge').value),
                email: document.getElementById('profileEmail').value,
                year: document.getElementById('profileYear').value,
                courseWork: document.getElementById('profileCourseWork').value,
                sleepHours: document.getElementById('profileSleepHours').value,
                password: document.getElementById('profilePassword').value,
                confirmPassword: document.getElementById('profileConfirmPassword').value
            };
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Update current user data
                    currentUser = data.user;
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Clear password fields
                    document.getElementById('profilePassword').value = '';
                    document.getElementById('profileConfirmPassword').value = '';
                    
                    // Update original data
                    originalProfileData = { ...data.user };
                    
                    showSuccessMessage('Profile updated successfully!');
                    
                    // Reload profile to show updated data
                    setTimeout(() => {
                        loadProfile();
                    }, 2000);
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Failed to update profile. Please try again.');
            }
        });
    }
    
    // Reset profile form
    if (resetProfileBtn) {
        resetProfileBtn.addEventListener('click', () => {
            if (originalProfileData) {
                populateProfileForm(originalProfileData);
                document.getElementById('profilePassword').value = '';
                document.getElementById('profileConfirmPassword').value = '';
            }
        });
    }
    
    // Profile picture change
    if (changeProfilePicBtn) {
        changeProfilePicBtn.addEventListener('click', () => {
            profilePicInput.click();
        });
    }
    
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const profilePictureElement = document.getElementById('profilePicture');
                    profilePictureElement.innerHTML = `<img src="${e.target.result}" alt="Profile Picture">`;
                    localStorage.setItem('profilePicture', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Scroll to bottom of page function
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// Scroll to content function
function scrollToContent() {
    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
        contentSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add click event to scroll hint
document.addEventListener('DOMContentLoaded', function() {
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
        scrollHint.addEventListener('click', scrollToBottom);
        scrollHint.style.cursor = 'pointer';
    }
});

// Make functions globally available
window.scrollToBottom = scrollToBottom;
window.scrollToContent = scrollToContent;

// Profile Details Display and Edit Modal Logic
function displayUserProfileDetails(user) {
    document.querySelector('#profileNameDisplay span').textContent = user.username || '';
    document.querySelector('#profileAgeDisplay span').textContent = user.age || '';
    document.querySelector('#profileEmailDisplay span').textContent = user.email || '';
    document.querySelector('#profileYearDisplay span').textContent = user.year || '';
    document.querySelector('#profileCourseWorkDisplay span').textContent = user.courseWork || '';
    document.querySelector('#profileSleepHoursDisplay span').textContent = user.sleepHours || '';
}

function openEditProfileModal(user) {
    document.getElementById('editProfileUsername').value = user.username || '';
    document.getElementById('editProfileAge').value = user.age || '';
    document.getElementById('editProfileEmail').value = user.email || '';
    document.getElementById('editProfileYear').value = user.year || '';
    document.getElementById('editProfileCourseWork').value = user.courseWork || '';
    document.getElementById('editProfileSleepHours').value = user.sleepHours || '';
    document.getElementById('editProfileModal').style.display = 'block';
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    // Show user details on profile page
    if (currentUser) {
        displayUserProfileDetails(currentUser);
    } else {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            displayUserProfileDetails(JSON.parse(userStr));
        }
    }

    // Edit button opens modal
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const user = currentUser || JSON.parse(localStorage.getItem('user'));
            openEditProfileModal(user);
        });
    }

    // Close modal
    const closeEditModalBtn = document.getElementById('closeEditProfileModal');
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeEditProfileModal);
    }

    // Save changes from modal
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const updatedUser = {
                username: document.getElementById('editProfileUsername').value,
                age: document.getElementById('editProfileAge').value,
                email: document.getElementById('editProfileEmail').value,
                year: document.getElementById('editProfileYear').value,
                courseWork: document.getElementById('editProfileCourseWork').value,
                sleepHours: document.getElementById('editProfileSleepHours').value
            };
            // Save to backend if needed, here just update localStorage and UI
            currentUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(currentUser));
            displayUserProfileDetails(currentUser);
            closeEditProfileModal();
        });
    }
});

// Advisor Support Prompt Logic
function checkAdvisorSupportPrompt() {
    if (currentSeverity === 'severe' && incidentText && incidentText.value.trim().length > 0) {
        advisorSupportPrompt.classList.remove('hidden');
    } else {
        advisorSupportPrompt.classList.add('hidden');
    }
}

if (openHealthcareModalBtn) {
    openHealthcareModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (healthcareModal) {
            healthcareModal.style.display = 'block';
        }
    });
} 