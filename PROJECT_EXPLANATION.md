# Mental Health Tracker - Project Explanation

## Overview
This is a comprehensive mental health and mood tracking web application built with Node.js, Express, and vanilla JavaScript. The application helps users track their daily moods, provides personalized recommendations, and offers mental health resources.

## Project Structure (After Cleanup)

```
gad_project/
├── public/                    # Frontend files
│   ├── index.html            # Main application interface
│   ├── styles.css            # All styling and animations
│   └── script.js             # Frontend JavaScript functionality
├── server.js                 # Backend server (Express.js)
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
├── start-server.ps1          # PowerShell startup script
├── .gitignore               # Git ignore rules
├── README.md                # Main project documentation
├── QUICK_START.md           # Quick setup guide
├── SETUP_INSTRUCTIONS.md    # Detailed setup instructions
├── BUG_FIXES_SUMMARY.md     # Bug fixes documentation
├── MULTI_PAGE_AND_SESSION_SUMMARY.md  # Multi-page feature docs
├── SEARCH_FEATURE_SUMMARY.md # Search functionality docs
├── test-cases.md            # Test cases documentation
├── test-complete-flow.js    # End-to-end testing script
└── PROJECT_EXPLANATION.md   # This file
```

## Core Features

### 1. User Authentication System
- **Registration**: Users can create accounts with email validation
- **Login/Logout**: Secure session-based authentication
- **Password Reset**: OTP-based password recovery system
- **Age Verification**: Content filtering based on user age

### 2. Mood Tracking
- **8 Mood Categories**: Happy, Excited, Calm, Neutral, Sad, Anxious, Stressed, Depressed
- **Severity Levels**: Low, Medium, High, Severe
- **Feelings Tags**: Additional emotional context (overwhelmed, lonely, grateful, etc.)
- **Incident Notes**: Optional text input for mood context
- **Content Filtering**: Automatic detection of concerning language

### 3. Personalized Recommendations
- **Music Recommendations**: Curated playlists based on mood
- **Video Content**: Therapeutic and uplifting videos
- **Age-Appropriate Content**: Filtered content based on user age
- **Professional Support**: Resources for severe mood states

### 4. Multi-Page Interface
- **Home Page**: Landing page with app information
- **Mood Tracker**: Main mood logging interface
- **Recommendations**: Personalized content display
- **History**: Mood tracking history and patterns
- **Profile**: User account management

## Technical Architecture

### Backend (server.js)
```javascript
// Core Technologies
- Express.js (Web framework)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- express-session (Session management)
- nodemailer (Email functionality)
- cors (Cross-origin resource sharing)

// Key Components
1. Authentication Middleware
2. Content Filtering System
3. Age-Appropriate Content Filtering
4. Music/Video Content Database
5. Recommendation Engine
6. Email Service (Mock for demo)
```

### Frontend (public/)
```javascript
// Core Technologies
- Vanilla JavaScript (No frameworks)
- HTML5 with semantic markup
- CSS3 with modern animations
- Font Awesome icons
- Google Fonts (Inter)

// Key Components
1. Multi-page Single Page Application
2. Dynamic UI updates
3. Form validation
4. Content filtering
5. Responsive design
6. Accessibility features
```

## Data Flow

### 1. User Registration Flow
```
User Input → Validation → Password Hashing → User Storage → Success Response
```

### 2. Mood Tracking Flow
```
Mood Selection → Severity Level → Feelings Tags → Incident Notes → 
Content Filtering → Database Storage → Recommendation Generation
```

### 3. Recommendation Flow
```
User Mood + Severity + Age → Content Filtering → 
Personalized Recommendations → UI Display
```

## Security Features

### 1. Authentication Security
- Password hashing with bcryptjs
- JWT token-based sessions
- Secure session configuration
- Input validation and sanitization

### 2. Content Safety
- Inappropriate language filtering
- Age-appropriate content filtering
- Professional support prompts for severe cases
- Content warning system

### 3. Data Protection
- Input validation on all forms
- XSS prevention
- CSRF protection through session management

## Content Management

### Music Content
- Curated playlists for different moods
- YouTube embed integration
- Age-appropriate filtering
- Genre categorization

### Video Content
- Therapeutic and educational videos
- Mood-specific recommendations
- Duration and category information
- Professional mental health resources

## User Experience Features

### 1. Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Smooth animations and transitions

### 2. Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color schemes

### 3. User Interface
- Clean, modern design
- Intuitive navigation
- Visual feedback for actions
- Progressive disclosure of features

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server
4. Access the application at `http://localhost:3000`

### Alternative Startup
- Use `start-server.ps1` for PowerShell users
- The script automatically checks Node.js installation and installs dependencies

## Dependencies

### Production Dependencies
- `express`: Web framework
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Cross-origin resource sharing
- `express-session`: Session management
- `body-parser`: Request body parsing
- `nodemailer`: Email functionality
- `crypto`: Cryptographic functions
- `dotenv`: Environment variable management

### Development Dependencies
- `nodemon`: Auto-restart server during development

## File Purposes

### Core Application Files
- `server.js`: Main backend server with all API endpoints
- `public/index.html`: Single-page application interface
- `public/script.js`: Frontend JavaScript functionality
- `public/styles.css`: Complete styling and animations

### Documentation Files
- `README.md`: Main project overview and setup
- `QUICK_START.md`: Quick setup instructions
- `SETUP_INSTRUCTIONS.md`: Detailed setup guide
- `BUG_FIXES_SUMMARY.md`: Bug fixes and improvements
- `MULTI_PAGE_AND_SESSION_SUMMARY.md`: Multi-page feature documentation
- `SEARCH_FEATURE_SUMMARY.md`: Search functionality documentation
- `test-cases.md`: Testing scenarios and cases
- `test-complete-flow.js`: End-to-end testing script

### Configuration Files
- `package.json`: Project metadata and dependencies
- `package-lock.json`: Dependency lock file
- `.gitignore`: Git ignore patterns
- `start-server.ps1`: PowerShell startup script

## Removed Files (Cleanup)
- `test-functionality.js`: Empty test file
- `demo.html`: Redundant demo file
- `test-modal-fix.html`: Obsolete test file
- `start-server.bat`: Redundant batch file (kept PowerShell version)

## Key Features Summary

1. **Complete Authentication System**: Registration, login, password reset
2. **Comprehensive Mood Tracking**: 8 moods, severity levels, feelings tags
3. **Smart Content Filtering**: Age-appropriate and language filtering
4. **Personalized Recommendations**: Music and video content based on mood
5. **Professional Support Integration**: Resources for severe cases
6. **Multi-page Interface**: Seamless navigation between features
7. **Responsive Design**: Works on all device sizes
8. **Security Features**: Input validation, content filtering, secure sessions

## Future Enhancements
- Database integration (currently using in-memory storage)
- Real email service integration
- Advanced analytics and reporting
- Mobile app development
- Integration with mental health professionals
- Community features and support groups

This application serves as a comprehensive mental health tracking tool with a focus on user safety, personalized content, and professional support integration. 