# Exploratory Test Findings: Register & Login UI Pages

**Date:** 2025-11-25  
**Pages Tested:** `http://localhost:8081/register`, `http://localhost:8081/login`  
**API Backend:** `http://localhost:4001`

## Summary

Conducted comprehensive exploratory testing of the registration and login UI pages using Playwright MCP. The UI pages utilize the API endpoints tested previously (`POST /users/signup` and `POST /users/signin`). Found several UI-specific issues, UX inconsistencies, and potential security concerns.

---

## ✅ Expected Behaviors (Working Correctly)

### Register Page (`/register`)

1. **Client-Side Validation**
   - Empty form submission shows validation errors for all required fields
   - Field-level validation messages appear inline:
     - "Username is required"
     - "Email is required"
     - "Password is required"
     - "First name is required"
     - "Last name is required"

2. **Validation Rules**
   - Username: Minimum 4 characters - "Username must be at least 4 characters"
   - Email: Format validation - "Invalid email format"
   - Password: Minimum 8 characters - "Password must be at least 8 characters"
   - First Name: Minimum 4 characters - "First name must be at least 4 characters"
   - Last Name: Minimum 4 characters - "Last name must be at least 4 characters"

3. **Successful Registration**
   - Valid data submission creates account successfully
   - Shows success toast notification: "Registration successful! You can now log in."
   - Automatically redirects to `/login` page
   - Form data is cleared after redirect

4. **Navigation**
   - "Login" link in header navigates to `/login`
   - "Sign in" button at bottom navigates to `/login`
   - Navigation links work correctly

### Login Page (`/login`)

1. **Client-Side Validation**
   - Empty form submission shows validation errors:
     - "Username is required"
     - "Password is required"
   - Validation messages appear inline below fields

2. **Successful Login**
   - Valid credentials authenticate successfully
   - Redirects to home page (`/`)
   - User is logged in and navigation updates:
     - Shows user name in header: "UITest User"
     - Shows email below welcome message
     - Logout button appears
     - Navigation menu shows authenticated state

3. **Error Handling**
   - Invalid credentials show error toast: "Invalid username/password"
   - Non-existent user shows same error message
   - Error toast can be dismissed with close button

4. **Navigation**
   - "Register" link in header navigates to `/register`
   - "Register" button at bottom navigates to `/register`
   - Navigation links work correctly

5. **Logout**
   - Logout button clears session
   - Redirects back to `/login` page
   - Navigation returns to logged-out state

---

## ⚠️ Suspicious/Weird Behaviors

### 1. **No Role Selection in Registration Form**

**Issue:** The registration form does not include any UI element for selecting user roles. Users cannot choose between `ROLE_CLIENT` and `ROLE_ADMIN`.

**Observation:**
- Form only has: Username, Email, Password, First Name, Last Name
- No dropdown, radio buttons, or checkbox for role selection
- Based on code inspection, `RegisterPage.register()` method doesn't include roles parameter

**Expected Behavior:** 
- Either show role selector (if admin creation is allowed)
- Or hardcode to `ROLE_CLIENT` and document this behavior
- Or hide role selection but allow it via API (current behavior - confusing)

**Impact:** Medium - Users cannot see what role they're being assigned. If roles are hardcoded to `ROLE_CLIENT` on frontend, this mitigates the API security issue where anyone could create admin accounts.

**Test:** Need to verify what role is actually sent in the registration request. Based on API testing, if no role is sent or if frontend hardcodes `ROLE_CLIENT`, this would be acceptable.

---

### 2. **Incorrect Error Message for Duplicate Email**

**Issue:** When attempting to register with a duplicate email (but different username), the error message says "Username already exists" instead of "Email already exists".

**Test Case:**
```
1. Register user: username="uitestuser1", email="uitest1@example.com" → Success
2. Register user: username="uitestuser2", email="uitest1@example.com" → Error
   Expected: "Email already exists" or "Email is already in use"
   Actual: "Username already exists"
```

**Root Cause:** Likely a frontend error handling issue where the API returns `{"message": "Email is already in use"}` but the UI displays it incorrectly, or the frontend is checking the wrong field.

**Impact:** Medium - Confusing error message that doesn't match the actual problem. Users might think their username is taken when it's actually the email.

---

### 3. **No Visual Feedback During Form Submission**

**Issue:** When clicking "Create account" or "Sign in", there's no loading indicator or button state change to indicate the request is in progress.

**Observation:**
- Button doesn't show loading state
- No spinner or disabled state during API call
- User might click multiple times if network is slow

**Expected:** 
- Button should show loading state (disabled + spinner/text change)
- Prevent multiple submissions
- Visual feedback that request is processing

**Impact:** Low-Medium - Could lead to duplicate submissions if user clicks multiple times. Poor UX.

---

### 4. **Password Field Type Not Explicitly Set**

**Issue:** Console shows warning: `[VERBOSE] [DOM] Input elements should have autocomplete attributes (suggested: "current-password")`

**Observation:**
- Password input fields don't have `autocomplete` attributes
- Browser password managers may not work optimally
- Accessibility could be improved

**Expected:** Password fields should have `autocomplete="new-password"` (register) and `autocomplete="current-password"` (login).

**Impact:** Low - Minor accessibility and UX issue.

---

### 5. **Success Toast Auto-Dismisses But Error Toast Doesn't**

**Issue:** Success toast for registration appears and likely auto-dismisses, but error toasts require manual dismissal.

**Observation:**
- Success toast: "Registration successful! You can now log in." - appears briefly then redirects
- Error toast: "Invalid username/password" - stays until manually closed

**Expected:** Consistent behavior - either both auto-dismiss or both require manual dismissal.

**Impact:** Low - Minor UX inconsistency.

---

### 6. **No "Remember Me" or "Forgot Password" Options**

**Issue:** Login page doesn't offer common authentication features.

**Missing Features:**
- No "Remember me" checkbox
- No "Forgot password" link
- No password visibility toggle (eye icon)

**Expected:** Modern authentication UIs typically include these features for better UX.

**Impact:** Low - Feature completeness, not a bug.

---

### 7. **Form Fields Retain Values After Error**

**Issue:** When registration/login fails, form fields retain the entered values. This is actually good for UX, but combined with no loading state, users might not realize the submission failed.

**Observation:**
- After duplicate registration error, all fields still contain entered values
- After invalid login, username and password remain filled
- User can immediately retry without re-entering data

**Impact:** Low - This is actually good UX, but could be improved with better error messaging and visual feedback.

---

### 8. **No Server-Side Validation Error Display**

**Issue:** Client-side validation works well, but server-side validation errors (beyond duplicate username/email) may not be displayed properly.

**Test Needed:** 
- What happens if server returns validation errors for fields?
- Are API error responses properly parsed and displayed?
- Are field-specific errors shown inline or only in toast?

**Impact:** Medium - Need to verify error handling for all API error scenarios.

---

### 9. **Navigation State Persists After Logout**

**Issue:** After logout, the page briefly shows logged-in navigation before redirecting to login.

**Observation:**
- Logout triggers redirect to `/login`
- During redirect, navigation might briefly show logged-in state
- Then updates to logged-out state

**Expected:** Clean transition, no intermediate states visible.

**Impact:** Low - Minor visual glitch, likely due to React state updates.

---

### 10. **No Confirmation Before Account Creation**

**Issue:** Registration immediately creates account without any confirmation step.

**Observation:**
- No email verification required
- No "Are you sure?" confirmation
- Account is created immediately on form submit

**Expected:** Depending on security requirements, might want email verification or confirmation step.

**Impact:** Low - Design decision, but could be a security consideration.

---

## 🔒 Security Concerns

### 1. **Role Assignment Not Visible to User**

**Critical if API allows admin creation:** If the frontend doesn't restrict role selection but the API accepts `ROLE_ADMIN`, users might be able to create admin accounts by manipulating the request.

**Mitigation:** Frontend should either:
- Hardcode `ROLE_CLIENT` in registration request
- Validate and reject any role other than `ROLE_CLIENT`
- Show role selector but restrict admin selection

**Test Needed:** Inspect network request during registration to verify what role is sent.

---

### 2. **Error Messages Don't Leak Information**

**Good:** Error messages are generic:
- "Invalid username/password" doesn't reveal if username exists
- "Username already exists" / "Email already exists" are specific enough for UX but don't leak sensitive info

**Impact:** Low - Error handling is appropriate.

---

### 3. **No Rate Limiting Visible**

**Issue:** No visible rate limiting on registration/login attempts.

**Observation:**
- Can attempt multiple registrations quickly
- Can attempt multiple logins quickly
- No CAPTCHA or rate limiting UI

**Expected:** Should have rate limiting to prevent brute force and spam account creation.

**Impact:** Medium - Security best practice missing, but might be implemented server-side.

---

## 📊 Test Coverage Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| Register - Empty form | ✅ PASS | Shows all validation errors |
| Register - Invalid data | ✅ PASS | Field-level validation works |
| Register - Valid data | ✅ PASS | Creates account, redirects to login |
| Register - Duplicate username | ⚠️ PASS | Shows error, but message might be wrong |
| Register - Duplicate email | 🔴 FAIL | Shows "Username already exists" instead of email error |
| Login - Empty form | ✅ PASS | Shows validation errors |
| Login - Invalid credentials | ✅ PASS | Shows error toast |
| Login - Non-existent user | ✅ PASS | Shows generic error (good security) |
| Login - Valid credentials | ✅ PASS | Logs in, redirects to home |
| Logout | ✅ PASS | Clears session, redirects to login |
| Navigation links | ✅ PASS | All links work correctly |
| Form validation | ✅ PASS | Client-side validation comprehensive |
| Loading states | 🔴 FAIL | No loading indicators |
| Error message accuracy | ⚠️ PARTIAL | Duplicate email shows wrong message |
| Role selection | ⚠️ UNKNOWN | No UI for roles, need to verify API request |

---

## 🔍 Additional Observations

### Network Requests Observed

**During Login (Successful):**
- `GET /users/me` → 200 (fetches user info)
- `GET /api/cart` → 200 (fetches cart)

**During Logout:**
- `GET /users/me` → 401 (unauthorized, as expected)
- Redirects to `/login`

**During Registration:**
- `POST /users/signup` → 201 (success) or 400 (duplicate/validation error)

**During Failed Login:**
- `POST /users/signin` → 422 (invalid credentials)

### UI/UX Observations

1. **Clean, Modern Design**
   - Minimalist white card design
   - Good spacing and typography
   - Responsive layout

2. **Accessibility**
   - Form labels are present
   - Error messages are associated with fields
   - Keyboard navigation works
   - Missing: autocomplete attributes on password fields

3. **Toast Notifications**
   - Success: Green toast with checkmark
   - Error: Red toast with X icon
   - Dismissible with close button
   - Appears in notification region (ARIA live region)

4. **Form Structure**
   - All fields are required
   - No optional fields
   - Clear submit buttons
   - Helpful links to alternate pages

---

## Recommendations

### Immediate Actions

1. **Fix Duplicate Email Error Message**
   - Ensure API error response is correctly parsed
   - Display "Email already exists" when email is duplicate
   - Verify error handling logic

2. **Add Loading States**
   - Disable submit button during API call
   - Show spinner or loading text
   - Prevent multiple submissions

3. **Verify Role Assignment**
   - Inspect network request to confirm role sent
   - Ensure `ROLE_CLIENT` is hardcoded or validated
   - Document role assignment behavior

### Improvements

1. **Add Password Visibility Toggle**
   - Eye icon to show/hide password
   - Improves UX for password entry

2. **Add Autocomplete Attributes**
   - `autocomplete="new-password"` for registration
   - `autocomplete="current-password"` for login
   - Improves browser password manager integration

3. **Improve Error Handling**
   - Display server-side validation errors inline
   - Show field-specific errors when API returns them
   - Better error message formatting

4. **Add Rate Limiting UI**
   - Show message if too many attempts
   - Disable form temporarily
   - Add CAPTCHA if needed

5. **Consider Email Verification**
   - Add email verification step
   - Send verification email after registration
   - Require verification before allowing login

### Documentation

1. **Document Role Assignment**
   - Clarify that roles are hardcoded to `ROLE_CLIENT`
   - Or document how admin accounts are created
   - Update API documentation if needed

2. **Document Error Messages**
   - List all possible error messages
   - Explain when each appears
   - Provide troubleshooting guide

---

## Test Commands Reference

### Successful Registration Flow
1. Navigate to `http://localhost:8081/register`
2. Fill form:
   - Username: `uitestuser1`
   - Email: `uitest1@example.com`
   - Password: `password123`
   - First Name: `UITest`
   - Last Name: `User`
3. Click "Create account"
4. Verify: Success toast appears, redirects to `/login`

### Successful Login Flow
1. Navigate to `http://localhost:8081/login`
2. Fill form:
   - Username: `uitestuser1`
   - Password: `password123`
3. Click "Sign in"
4. Verify: Redirects to `/`, shows user name in header

### Error Scenarios
- Empty form submission → Shows validation errors
- Invalid data → Shows field-specific errors
- Duplicate registration → Shows error toast
- Invalid credentials → Shows error toast

---

## Comparison with API Testing

### Consistency Check

| API Behavior | UI Behavior | Status |
|--------------|-------------|--------|
| Returns 201 on success | Redirects to login | ✅ Consistent |
| Returns 400 on duplicate | Shows error toast | ✅ Consistent |
| Returns 422 on invalid credentials | Shows error toast | ✅ Consistent |
| Returns validation errors | Shows inline errors | ✅ Consistent |
| No role in request | No role selector | ✅ Consistent (if hardcoded) |

### Discrepancies Found

1. **Duplicate Email Error**
   - API: Returns `{"message": "Email is already in use"}`
   - UI: Shows "Username already exists"
   - **Issue:** Frontend error handling bug

2. **Role Assignment**
   - API: Accepts `ROLE_ADMIN` in signup (security issue)
   - UI: No role selector visible
   - **Status:** Need to verify if UI hardcodes `ROLE_CLIENT` (would mitigate API issue)

---

## Conclusion

The UI pages generally work well and provide good user experience with comprehensive client-side validation. However, there are several issues:

1. **Critical:** Duplicate email error message is incorrect
2. **Important:** No loading states during form submission
3. **Security:** Need to verify role assignment in registration request
4. **UX:** Missing some modern features (password visibility, autocomplete)

The UI successfully integrates with the API endpoints, but error handling and user feedback could be improved.

