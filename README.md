# Mental Health Tracker - MindCare

A comprehensive web application for tracking mental health and mood with personalized recommendations for better wellness.

## 🌟 Features

### 🔐 User Authentication
- **Sign Up**: Create account with username, email, and password
- **Login**: Secure authentication with JWT tokens
- **Consent Management**: Required consent checkbox for data collection
- **Session Management**: Persistent login with localStorage

### 😊 Mood Tracking
- **8 Mood Categories**: Happy, Excited, Calm, Neutral, Sad, Anxious, Stressed, Depressed
- **Visual Emoji Interface**: Beautiful emoji-based mood selection
- **Severity Levels**: Low, Medium, High, Severe intensity tracking
- **Feeling Tags**: Multiple feeling selection (Overwhelmed, Lonely, Frustrated, etc.)
- **Incident Journaling**: Optional text area for sharing thoughts and experiences

### 🎯 Personalized Recommendations
- **Music Suggestions**: Curated music recommendations based on mood
- **Meditation Guidance**: Appropriate meditation techniques
- **Activity Recommendations**: Suggested activities for mood improvement
- **Professional Help Alerts**: Automatic recommendations for severe cases

### 📊 History & Analytics
- **Mood History**: Complete timeline of all mood entries
- **Visual Timeline**: Beautiful display of past entries with timestamps
- **Detailed Records**: Severity, feelings, and incident notes for each entry

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging hover effects and transitions
- **Beautiful Styling**: Modern gradient backgrounds and clean typography
- **Interactive Elements**: Hover effects, smooth scrolling, and visual feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd gad_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
gad_project/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles and animations
│   └── script.js           # Frontend JavaScript
├── server.js               # Express.js backend server
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

### Database Integration
The application currently uses in-memory storage. To integrate with a database:

1. **Replace the in-memory arrays** in `server.js`:
   ```javascript
   // Replace these lines:
   let users = [];
   let moodEntries = [];
   
   // With your database models
   ```

2. **Update the API endpoints** to use your database models

## 🎯 Usage Guide

### For Users

1. **Getting Started**
   - Visit the homepage
   - Click "Get Started" or "Sign Up"
   - Complete the registration form with consent

2. **Tracking Your Mood**
   - Select your current mood from the emoji cards
   - Choose the intensity level (Low/Medium/High/Severe)
   - Select relevant feelings from the tags
   - Optionally share what happened in the text area
   - Click "Save Entry"

3. **Viewing Recommendations**
   - After saving a mood entry, personalized recommendations appear
   - Browse music, meditation, and activity suggestions
   - For severe cases, professional help recommendations are shown

4. **Checking History**
   - Navigate to the "History" section
   - View all your past mood entries
   - See patterns and trends over time

### For Developers

#### API Endpoints

**Authentication**
- `POST /api/register` - User registration
- `POST /api/login` - User login

**Mood Tracking**
- `POST /api/mood` - Save mood entry (requires auth)
- `GET /api/mood/history` - Get user's mood history (requires auth)

**Recommendations**
- `GET /api/recommendations/:mood/:severity` - Get personalized recommendations

#### Frontend Components

- **Authentication Modals**: Login and signup forms
- **Mood Tracker**: Interactive mood selection interface
- **Recommendations**: Dynamic recommendation display
- **History**: Timeline of mood entries

## 🎨 Customization

### Styling
- Modify `public/styles.css` for visual changes
- Update color schemes, fonts, and animations
- Add new CSS classes for additional features

### Functionality
- Extend `public/script.js` for new features
- Add new API endpoints in `server.js`
- Implement additional mood categories or feeling tags

### Recommendations
- Update the recommendation logic in `server.js`
- Add new recommendation categories
- Integrate with external APIs for music/meditation content

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing protection
- **Session Management**: Secure session handling

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly elements
- **Mobile**: Mobile-optimized interface with simplified navigation

## 🚀 Future Enhancements

- **Database Integration**: MongoDB, PostgreSQL, or MySQL
- **Data Visualization**: Charts and graphs for mood trends
- **Push Notifications**: Daily mood check reminders
- **Social Features**: Anonymous community support
- **AI Integration**: Machine learning for better recommendations
- **Export Features**: Download mood data as CSV/PDF
- **Dark Mode**: Toggle between light and dark themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- **Emoji Icons**: Unicode emoji characters
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family
- **Express.js**: Backend framework
- **Modern CSS**: Advanced styling techniques

---

**Note**: This application is designed for educational and personal use. For professional mental health support, please consult with qualified healthcare providers. 