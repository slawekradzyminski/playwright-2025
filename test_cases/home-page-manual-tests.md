# Home Page - Manual Test Cases

## Test Case Overview
**Page:** Home Page (`/`)  
**Access Level:** Protected (Requires Authentication)  
**Browser Compatibility:** Chrome, Firefox, Safari, Edge  
**Created:** 2025-01-19  

---

## Prerequisites
- User must be logged in with valid credentials
- Frontend application running on `http://localhost:8081`
- Backend API available and responsive

---

## Test Case 1: Display Welcome Message with User Name
**Test ID:** HOME-001  
**Priority:** High  
**Objective:** Verify that the home page displays a personalized welcome message with the logged-in user's name

### Test Steps:
1. Navigate to login page (`http://localhost:8081/login`)
2. Enter valid credentials:
   - Username: `admin`
   - Password: `admin`
3. Click "Sign in" button
4. Verify navigation to home page (`http://localhost:8081/`)
5. Locate the main heading on the page

### Expected Results:
- Page displays heading: "Welcome, [User's First Name]!" (e.g., "Welcome, Slawomir!")
- Heading is prominently displayed at the top of the main content area
- User's actual first name is dynamically populated

### Test Data:
- Admin user: Expected "Welcome, Slawomir!"
- Regular user: Expected "Welcome, [FirstName]!"

---

## Test Case 2: Display User Email
**Test ID:** HOME-002  
**Priority:** High  
**Objective:** Verify that the home page displays the logged-in user's email address

### Test Steps:
1. Complete login process (as in HOME-001)
2. On the home page, locate the area below the welcome message
3. Check for email display

### Expected Results:
- User's email address is displayed below the welcome message
- Email format is valid (contains @ symbol)
- For admin user: Should display "awesome@testing.com"

---

## Test Case 3: Navigation to Products via "View Products" Button
**Test ID:** HOME-003  
**Priority:** High  
**Objective:** Verify navigation from home page to products page using the View Products button

### Test Steps:
1. Complete login and navigate to home page
2. Scroll to "Application Features" section
3. Locate "Product Management" card
4. Verify button text reads "View Products"
5. Click "View Products" button
6. Verify page navigation

### Expected Results:
- Button is clickable and visible
- Clicking button navigates to `/products` page
- Products page loads with product listings
- URL changes to `http://localhost:8081/products`
- Page title remains "Awesome Testing"

---

## Test Case 4: Navigation to Users via "Manage Users" Button
**Test ID:** HOME-004  
**Priority:** High  
**Objective:** Verify navigation from home page to users management page

### Test Steps:
1. Complete login and navigate to home page
2. Locate "User Management" card in "Application Features" section
3. Verify button text reads "Manage Users"
4. Click "Manage Users" button
5. Check page navigation

### Expected Results:
- Button is clickable and properly labeled
- Navigation occurs (URL should change to users page)
- User management page loads successfully

---

## Test Case 5: Navigation to Profile via "View Profile & Orders" Button
**Test ID:** HOME-005  
**Priority:** High  
**Objective:** Verify navigation from home page to user profile page

### Test Steps:
1. Complete login and navigate to home page
2. Locate "Order Processing & Profile" card
3. Verify button text reads "View Profile & Orders"
4. Click "View Profile & Orders" button
5. Verify navigation to profile page

### Expected Results:
- Button navigates to `/profile` page
- Profile page displays user information
- URL changes to `http://localhost:8081/profile`

---

## Test Case 6: Navigation to Traffic Monitor via "Open Traffic Monitor" Button
**Test ID:** HOME-006  
**Priority:** Medium  
**Objective:** Verify navigation to traffic monitoring page from home page

### Test Steps:
1. Complete login and navigate to home page
2. Scroll to "Advanced Monitoring" section
3. Locate "Traffic Monitor" card
4. Verify the description mentions "WebSocket technology"
5. Verify the features list includes:
   - "View all HTTP requests in real-time"
   - "Monitor response times and status codes"
   - "Debug API interactions immediately"
6. Click "Open Traffic Monitor" button
7. Verify navigation

### Expected Results:
- Button navigates to `/traffic` page
- Traffic monitoring page loads with real-time monitoring interface
- WebSocket connection is established (if applicable)

---

## Test Case 7: Navigation to AI Assistant via "Open AI Assistant" Button
**Test ID:** HOME-007  
**Priority:** Medium  
**Objective:** Verify navigation to LLM/AI assistant page from home page

### Test Steps:
1. Complete login and navigate to home page
2. Scroll to "AI Integration" section
3. Locate "LLM Assistant" card
4. Verify the description mentions "Server-Sent Events (SSE)"
5. Verify the features list includes:
   - "Generate content with AI assistance"
   - "Chat with our AI for immediate help"
   - "Customize system prompts for better results"
6. Click "Open AI Assistant" button
7. Verify navigation

### Expected Results:
- Button navigates to `/llm` page
- LLM/AI page loads with chat or generation interface
- URL changes to `http://localhost:8081/llm`

---

## Test Case 8: Navigation to QR Generator via "Generate QR Codes" Button
**Test ID:** HOME-008  
**Priority:** Medium  
**Objective:** Verify navigation to QR code generation page from home page

### Test Steps:
1. Complete login and navigate to home page
2. Scroll to "Additional Utilities" section
3. Locate "QR Code Generator" card
4. Verify description: "Generate valid and scannable QR codes for any text or URL. Perfect for sharing links or information quickly."
5. Click "Generate QR Codes" button
6. Verify navigation

### Expected Results:
- Button navigates to `/qr` page
- QR code generation page loads with input form
- URL changes to `http://localhost:8081/qr`

---

## Test Case 9: Navigation to Email Service via "Send Emails" Button
**Test ID:** HOME-009  
**Priority:** Medium  
**Objective:** Verify navigation to email service page from home page

### Test Steps:
1. Complete login and navigate to home page
2. Scroll to "Additional Utilities" section
3. Locate "Email Service" card
4. Verify description: "Send emails through our system. Delivery is handled asynchronously with a delay of up to 10 minutes."
5. Click "Send Emails" button
6. Verify navigation

### Expected Results:
- Button navigates to `/email` page
- Email sending page loads with email form
- URL changes to `http://localhost:8081/email`

---

## Test Case 10: Page Layout and Content Structure
**Test ID:** HOME-010  
**Priority:** Medium  
**Objective:** Verify the overall layout and content structure of the home page

### Test Steps:
1. Complete login and navigate to home page
2. Verify page structure includes the following sections in order:
   - User welcome section (name + email)
   - "Application Features" section with 3 cards
   - "Advanced Monitoring" section
   - "AI Integration" section  
   - "Additional Utilities" section with 2 cards
3. Check that each section has appropriate headings
4. Verify all buttons are visible and properly styled

### Expected Results:
- All sections are present and properly organized
- Headings are hierarchical (H1 for main, H2 for sections, H3 for cards)
- Content is readable and well-formatted
- Buttons are consistently styled and clickable
- Page layout is responsive and professional

---

## Test Case 11: Top Navigation Bar Verification
**Test ID:** HOME-011  
**Priority:** High  
**Objective:** Verify the top navigation bar contains all expected menu items

### Test Steps:
1. Complete login and navigate to home page
2. Examine the top navigation bar
3. Verify the following menu items are present:
   - Home
   - Products  
   - Send Email
   - QR Code
   - LLM
   - Traffic Monitor
   - Admin (for admin users)
4. Check the right side of navigation for:
   - Shopping cart icon (with link to `/cart`)
   - User name link (links to `/profile`)
   - Logout button

### Expected Results:
- All navigation links are present and functional
- Admin menu item appears for admin users
- User name is displayed correctly ("Slawomir Radzyminski" for admin)
- Cart icon is clickable
- Logout button is present and functional

---

## Test Case 12: Authentication and Access Control
**Test ID:** HOME-012  
**Priority:** High  
**Objective:** Verify that the home page is properly protected and requires authentication

### Test Steps:
1. Navigate directly to `http://localhost:8081/` without logging in
2. Verify redirection or access denial
3. Complete login process
4. Verify successful access to home page
5. Test logout functionality

### Expected Results:
- Unauthenticated users cannot access the home page
- Users are redirected to login page if not authenticated
- After login, users can access the home page
- Logout button successfully logs out the user

---

## Test Execution Notes

### Browser Testing:
- Test on Chrome, Firefox, Safari, and Edge
- Verify responsive design on different screen sizes
- Check for console errors in browser developer tools

### Data Validation:
- Test with different user accounts (admin vs regular user)
- Verify dynamic content updates based on user role
- Check for proper error handling if services are unavailable

### Performance:
- Page should load within 3 seconds
- All buttons should respond within 1 second of clicking
- Navigation should be smooth without flickering

### Accessibility:
- Verify proper heading hierarchy (H1, H2, H3)
- Check that all buttons are keyboard accessible
- Ensure proper color contrast for text

---

## Pass/Fail Criteria

**PASS:** All test steps execute successfully with expected results  
**FAIL:** Any test step fails to produce expected results  
**BLOCKED:** Cannot execute test due to environmental issues  

---

## Bug Reporting Template

**Bug ID:** HOME-BUG-XXX  
**Test Case:** [Test Case ID]  
**Severity:** [High/Medium/Low]  
**Description:** [Brief description of the issue]  
**Steps to Reproduce:** [Detailed steps]  
**Expected Result:** [What should happen]  
**Actual Result:** [What actually happened]  
**Environment:** [Browser, OS, URL]  
**Screenshot:** [If applicable]
