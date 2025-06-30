# Setup Instructions for Mental Health Tracker

## Prerequisites

Before running the Mental Health Tracker application, you need to install Node.js on your system.

## Step 1: Install Node.js

### Windows
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the installation wizard
4. Verify installation by opening Command Prompt or PowerShell and running:
   ```bash
   node --version
   npm --version
   ```

### macOS
1. **Option 1 - Using Homebrew (Recommended):**
   ```bash
   brew install node
   ```

2. **Option 2 - Direct download:**
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the macOS installer
   - Run the installer

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

### Linux (CentOS/RHEL/Fedora)
```bash
sudo yum install nodejs npm
# or for newer versions:
sudo dnf install nodejs npm
```

## Step 2: Verify Installation

Open a terminal/command prompt and run:
```bash
node --version
npm --version
```

Both commands should return version numbers (e.g., v18.17.0 for Node.js and 9.6.7 for npm).

## Step 3: Run the Application

1. **Navigate to the project directory:**
   ```bash
   cd D:\codes\gad_project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your web browser and go to:**
   ```
   http://localhost:3000
   ```

## Alternative: Production Mode

For production deployment:
```bash
npm start
```

## Troubleshooting

### "npm is not recognized" Error
- Make sure Node.js is properly installed
- Restart your terminal/command prompt
- On Windows, you may need to restart your computer
- Check if Node.js is in your system PATH

### Port Already in Use
If you get an error about port 3000 being in use:
1. Find the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```

2. Kill the process or change the port in the `.env` file:
   ```
   PORT=3001
   ```

### Permission Errors (Linux/macOS)
If you get permission errors:
```bash
sudo npm install
```

## Demo Version

If you can't install Node.js right now, you can view the demo version:
1. Open `demo.html` in your web browser
2. This shows the interface without backend functionality
3. You can interact with the UI elements to see the design

## Features Available After Setup

Once you have Node.js installed and the server running, you'll have access to:

### 🔐 Full Authentication
- User registration with consent management
- Secure login/logout functionality
- JWT token-based authentication
- Session persistence

### 😊 Complete Mood Tracking
- Interactive mood selection with emojis
- Severity level assessment
- Multiple feeling selection
- Optional incident journaling
- Data persistence

### 🎯 Personalized Recommendations
- Music suggestions based on mood
- Meditation techniques
- Activity recommendations
- Professional help alerts for severe cases

### 📊 Mood History
- Complete timeline of all entries
- Visual display with timestamps
- Detailed records with feelings and notes

### 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation
- CORS protection

## Database Integration

The current version uses in-memory storage. To integrate with a real database:

1. **Choose a database:**
   - MongoDB (NoSQL)
   - PostgreSQL (SQL)
   - MySQL (SQL)

2. **Install database driver:**
   ```bash
   # For MongoDB
   npm install mongoose
   
   # For PostgreSQL
   npm install pg
   
   # For MySQL
   npm install mysql2
   ```

3. **Update server.js** to use database models instead of in-memory arrays

## Environment Variables

Create a `.env` file in the project root:
```
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Support

If you encounter any issues:
1. Check that Node.js and npm are properly installed
2. Ensure all dependencies are installed (`npm install`)
3. Check the console for error messages
4. Verify the port is not in use by another application

## Next Steps

After successful setup:
1. Create your first account
2. Start tracking your mood
3. Explore the recommendations
4. Check your mood history
5. Consider integrating with a database for persistent storage

---

**Note**: This application is designed for educational and personal use. For professional mental health support, please consult with qualified healthcare providers. 