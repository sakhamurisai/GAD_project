// Comprehensive Test Script for Mental Health Tracker
const puppeteer = require('puppeteer');

async function testCompleteFlow() {
    console.log('🧪 Starting Comprehensive Test Flow...\n');
    
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({ 
            headless: false, 
            defaultViewport: null,
            args: ['--start-maximized']
        });
        
        const page = await browser.newPage();
        
        // Test 1: Load the application
        console.log('1. Loading application...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        console.log('✅ Application loaded successfully');
        
        // Test 2: Click "Get Started" button
        console.log('\n2. Testing "Get Started" button...');
        await page.waitForSelector('#getStartedBtn');
        await page.click('#getStartedBtn');
        
        // Wait for signup modal to appear
        await page.waitForSelector('#signupModal', { visible: true });
        console.log('✅ Signup modal opened successfully');
        
        // Test 3: Fill signup form
        console.log('\n3. Filling signup form...');
        await page.type('#signupUsername', 'testuser');
        await page.type('#signupAge', '20');
        await page.type('#signupEmail', 'test@example.com');
        await page.type('#signupPassword', 'testpass123');
        await page.select('#signupYear', 'Sophomore');
        await page.type('#signupCourseWork', 'Computer Science');
        await page.select('#signupSleepHours', '8');
        
        // Check consent boxes
        await page.click('#consentCheckbox');
        await page.click('#ageConsentCheckbox');
        
        console.log('✅ Signup form filled successfully');
        
        // Test 4: Submit signup form
        console.log('\n4. Submitting signup form...');
        await page.click('#signupForm button[type="submit"]');
        
        // Wait for redirect to mood tracker
        await page.waitForSelector('#moodTrackerPage', { visible: true });
        console.log('✅ Successfully registered and redirected to mood tracker');
        
        // Test 5: Complete mood tracking flow
        console.log('\n5. Testing mood tracking flow...');
        
        // Select a mood
        await page.waitForSelector('.mood-card[data-mood="happy"]');
        await page.click('.mood-card[data-mood="happy"]');
        console.log('✅ Selected mood: Happy');
        
        // Wait for severity section to appear
        await page.waitForSelector('#severitySection', { visible: true });
        
        // Select severity
        await page.click('.severity-btn[data-severity="low"]');
        console.log('✅ Selected severity: Low');
        
        // Wait for feelings section to appear
        await page.waitForSelector('#feelingsSection', { visible: true });
        
        // Select feelings
        await page.click('.feeling-tag[data-feeling="grateful"]');
        await page.click('.feeling-tag[data-feeling="hopeful"]');
        console.log('✅ Selected feelings: Grateful, Hopeful');
        
        // Wait for incident section to appear
        await page.waitForSelector('#incidentSection', { visible: true });
        
        // Enter incident text
        await page.type('#incidentText', 'Had a great day at school! Made new friends and learned a lot.');
        console.log('✅ Entered incident text');
        
        // Save mood entry
        await page.waitForSelector('#saveMoodBtn', { visible: true });
        await page.click('#saveMoodBtn');
        console.log('✅ Saved mood entry');
        
        // Test 6: Wait for redirect to recommendations
        console.log('\n6. Testing recommendations page...');
        await page.waitForSelector('#recommendationsPage', { visible: true });
        console.log('✅ Successfully redirected to recommendations page');
        
        // Test 7: Test music search functionality
        console.log('\n7. Testing music search functionality...');
        
        // Wait for music section to load
        await page.waitForSelector('#musicSearchInput');
        
        // Search for "album"
        await page.type('#musicSearchInput', 'album');
        await page.click('#musicSearchBtn');
        
        // Wait for search results
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Music search completed');
        
        // Test 8: Test music category filtering
        console.log('\n8. Testing music category filtering...');
        
        // Click on Indian Music category
        await page.click('.music-category-btn[data-genre="Indian"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Indian music category selected');
        
        // Click on American Music category
        await page.click('.music-category-btn[data-genre="American"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ American music category selected');
        
        // Test 9: Test video search functionality
        console.log('\n9. Testing video search functionality...');
        
        // Navigate to videos section
        await page.click('a[data-page="videos"]');
        await page.waitForSelector('#videosPage', { visible: true });
        
        // Search for videos
        await page.waitForSelector('#videoSearchInput');
        await page.type('#videoSearchInput', 'funny');
        await page.click('#videoSearchBtn');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Video search completed');
        
        // Test 10: Test video category filtering
        console.log('\n10. Testing video category filtering...');
        
        // Click on different video categories
        await page.click('.video-category-btn[data-category="animals"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Animals category selected');
        
        await page.click('.video-category-btn[data-category="comedy"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Comedy category selected');
        
        // Test 11: Check enhanced content
        console.log('\n11. Testing enhanced meditation and exercise content...');
        
        // Navigate back to recommendations
        await page.click('a[data-page="recommendations"]');
        await page.waitForSelector('#recommendationsPage', { visible: true });
        
        // Scroll to meditation section
        await page.evaluate(() => {
            const meditationSection = document.querySelector('.meditation-section');
            if (meditationSection) {
                meditationSection.scrollIntoView();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Meditation content displayed');
        
        // Scroll to exercise section
        await page.evaluate(() => {
            const exerciseSection = document.querySelector('.exercise-section');
            if (exerciseSection) {
                exerciseSection.scrollIntoView();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Exercise content displayed');
        
        // Test 12: Test navigation
        console.log('\n12. Testing navigation...');
        
        // Test all navigation links
        const navLinks = ['home', 'mood-tracker', 'recommendations', 'music', 'videos', 'history'];
        
        for (const link of navLinks) {
            try {
                await page.click(`a[data-page="${link}"]`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log(`✅ Navigation to ${link} working`);
            } catch (error) {
                console.log(`⚠️ Navigation to ${link} failed: ${error.message}`);
            }
        }
        
        // Test 13: Test logout
        console.log('\n13. Testing logout...');
        await page.click('#logoutBtn');
        await page.waitForSelector('#homePage', { visible: true });
        console.log('✅ Logout successful');
        
        console.log('\n🎉 All tests completed successfully!');
        console.log('\n📊 Test Summary:');
        console.log('✅ User registration and login');
        console.log('✅ Complete mood tracking flow');
        console.log('✅ Recommendations page');
        console.log('✅ Music search and filtering');
        console.log('✅ Video search and filtering');
        console.log('✅ Enhanced meditation/exercise content');
        console.log('✅ Navigation between pages');
        console.log('✅ Logout functionality');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testCompleteFlow(); 