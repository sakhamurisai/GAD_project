# Mental Health Tracker - Test Cases

## 1. Authentication Flow
### Test Case 1.1: User Registration
- **Steps:**
  1. Click "Get Started" button
  2. Fill in registration form with valid data
  3. Check consent boxes
  4. Submit form
- **Expected Result:** User should be redirected to mood tracker page after successful registration

### Test Case 1.2: User Login
- **Steps:**
  1. Click "Login" button
  2. Enter valid email and password
  3. Submit form
- **Expected Result:** User should be redirected to mood tracker page after successful login

### Test Case 1.3: Forgot Password
- **Steps:**
  1. Click "Forgot Password?" link
  2. Enter email address
  3. Submit form
- **Expected Result:** OTP should be sent (mocked) and user can reset password

## 2. Mood Tracking Flow
### Test Case 2.1: Complete Mood Entry
- **Steps:**
  1. Select a mood card (e.g., "Happy")
  2. Select severity level (e.g., "Low")
  3. Select feelings tags (e.g., "Excited", "Grateful")
  4. Enter incident text
  5. Click "Save Mood Entry"
- **Expected Result:** Mood should be saved and user redirected to recommendations page

### Test Case 2.2: Mood Entry Validation
- **Steps:**
  1. Try to save mood without selecting mood
  2. Try to save mood without selecting severity
- **Expected Result:** Appropriate error messages should be shown

## 3. Search Functionality
### Test Case 3.1: Music Search
- **Steps:**
  1. Navigate to Music page
  2. Enter search term in search box
  3. Click search button or press Enter
- **Expected Result:** Music should be filtered based on search term

### Test Case 3.2: Music Category Filter
- **Steps:**
  1. Navigate to Music page
  2. Click on different category buttons (Indian, American, etc.)
- **Expected Result:** Music should be filtered by selected category

### Test Case 3.3: Video Search
- **Steps:**
  1. Navigate to Videos page
  2. Enter search term in search box
  3. Click search button or press Enter
- **Expected Result:** Videos should be filtered based on search term

### Test Case 3.4: Video Category Filter
- **Steps:**
  1. Navigate to Videos page
  2. Click on different category buttons
- **Expected Result:** Videos should be filtered by selected category

## 4. Recommendations
### Test Case 4.1: Personalized Recommendations
- **Steps:**
  1. Complete a mood entry
  2. Navigate to Recommendations page
- **Expected Result:** Should show personalized recommendations based on mood and severity

### Test Case 4.2: Meditation Content
- **Steps:**
  1. Navigate to Recommendations page
  2. Scroll to Meditation section
- **Expected Result:** Should display meditation content with images and demo videos

### Test Case 4.3: Exercise Content
- **Steps:**
  1. Navigate to Recommendations page
  2. Scroll to Exercise section
- **Expected Result:** Should display exercise content with images and demo videos

## 5. Navigation
### Test Case 5.1: Page Navigation
- **Steps:**
  1. Click on different navigation links
  2. Verify each page loads correctly
- **Expected Result:** All pages should load without errors

### Test Case 5.2: Authentication Required Pages
- **Steps:**
  1. Try to access protected pages without login
- **Expected Result:** Should redirect to login or show appropriate message

## 6. Session Management
### Test Case 6.1: Session Timeout
- **Steps:**
  1. Login to the application
  2. Leave the page inactive for 2+ minutes
  3. Try to perform an action
- **Expected Result:** Should show session timeout message and redirect to login

### Test Case 6.2: Logout
- **Steps:**
  1. Click logout button
- **Expected Result:** Should clear session and redirect to home page

## 7. Content Filtering
### Test Case 7.1: Age-Appropriate Content
- **Steps:**
  1. Create accounts with different ages (13, 16, 20)
  2. Check content recommendations
- **Expected Result:** Content should be filtered based on age

### Test Case 7.2: Inappropriate Content Detection
- **Steps:**
  1. Enter inappropriate language in incident text
  2. Submit mood entry
- **Expected Result:** Should show content warning

## 8. Responsive Design
### Test Case 8.1: Mobile Responsiveness
- **Steps:**
  1. Test application on different screen sizes
  2. Check all functionality on mobile devices
- **Expected Result:** Application should work properly on all screen sizes

## 9. Error Handling
### Test Case 9.1: Network Errors
- **Steps:**
  1. Disconnect internet connection
  2. Try to perform actions that require server communication
- **Expected Result:** Should show appropriate error messages

### Test Case 9.2: Invalid Input
- **Steps:**
  1. Enter invalid data in forms
  2. Submit forms with missing required fields
- **Expected Result:** Should show validation error messages

## 10. Performance
### Test Case 10.1: Page Load Times
- **Steps:**
  1. Measure page load times
  2. Check for any performance issues
- **Expected Result:** Pages should load within reasonable time

## Test Results Summary
- [ ] Authentication Flow: ___/3 tests passed
- [ ] Mood Tracking Flow: ___/2 tests passed
- [ ] Search Functionality: ___/4 tests passed
- [ ] Recommendations: ___/3 tests passed
- [ ] Navigation: ___/2 tests passed
- [ ] Session Management: ___/2 tests passed
- [ ] Content Filtering: ___/2 tests passed
- [ ] Responsive Design: ___/1 test passed
- [ ] Error Handling: ___/2 tests passed
- [ ] Performance: ___/1 test passed

**Total Tests Passed: ___/22** 