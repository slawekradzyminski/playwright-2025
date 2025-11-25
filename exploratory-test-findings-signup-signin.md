# Exploratory Test Findings: Signup & Signin Endpoints

**Date:** 2025-11-25  
**Endpoints Tested:** `POST /users/signup`, `POST /users/signin`  
**Base URL:** `http://localhost:4001`

## Summary

Conducted comprehensive exploratory testing of authentication endpoints. Found several suspicious behaviors, inconsistencies, and potential security concerns.

---

## ✅ Expected Behaviors (Working Correctly)

### Signup Endpoint

1. **Successful Registration (201)**
   - Valid payload creates user successfully
   - Returns 201 status code
   - Empty response body (as per spec)

2. **Validation Errors (400)**
   - Properly validates minimum length requirements:
     - Username: min 4 characters
     - FirstName: min 4 characters
     - LastName: min 4 characters
     - Password: min 8 characters
   - Validates email format
   - Validates roles array (must have at least one role)

3. **Duplicate Detection (400)**
   - Detects duplicate username: `"Username is already in use"`
   - Detects duplicate email: `"Email is already in use"`

4. **Boundary Values**
   - Minimum length values (4 chars for username/firstName/lastName) are accepted
   - Password minimum (8 chars) is enforced

5. **Role Validation**
   - Rejects invalid enum values with detailed error message
   - Accepts `ROLE_CLIENT` and `ROLE_ADMIN`
   - Allows multiple roles: `["ROLE_CLIENT", "ROLE_ADMIN"]`
   - Rejects empty roles array: `"At least one role must be specified"`

### Signin Endpoint

1. **Successful Authentication (200)**
   - Returns JWT token in response
   - Returns user details (username, email, firstName, lastName, roles)
   - Works with both client and admin users

2. **Invalid Credentials (422)**
   - Returns 422 for wrong password
   - Returns 422 for non-existent username
   - Consistent error message: `"Invalid username/password supplied"`

---

## ⚠️ Suspicious/Weird Behaviors

### 1. **Signin Returns 422 Instead of 400 for Missing Fields**

**Issue:** When password field is missing or empty body is sent, signin returns `422 Unprocessable Entity` instead of `400 Bad Request`.

**Test Cases:**
```bash
# Missing password field
curl -X 'POST' 'http://localhost:4001/users/signin' \
  -H 'Content-Type: application/json' \
  -d '{"username":"testuser1"}'
# Response: HTTP/1.1 422
# Body: {"message": "Invalid username/password supplied"}

# Empty body
curl -X 'POST' 'http://localhost:4001/users/signin' \
  -H 'Content-Type: application/json' \
  -d '{}'
# Response: HTTP/1.1 422
# Body: {"message": "Invalid username/password supplied"}
```

**Expected:** According to API docs, `400` should be returned for "Field validation failed". The `422` status code is documented for "Invalid username/password supplied", which suggests authentication failure, not validation failure.

**Impact:** Medium - Inconsistent status codes make error handling ambiguous.

---

### 2. **Signin Returns 401 for Wrong Content-Type**

**Issue:** When Content-Type is not `application/json`, signin returns `401 Unauthorized` instead of `400 Bad Request`.

**Test Case:**
```bash
curl -X 'POST' 'http://localhost:4001/users/signin' \
  -H 'Content-Type: text/plain' \
  -d 'not json'
# Response: HTTP/1.1 401
# Body: {"message": "Unauthorized"}
```

**Expected:** Should return `400 Bad Request` for malformed request format.

**Impact:** Low - Misleading error message, but request is properly rejected.

---

### 3. **Signup Allows Anyone to Create Admin Users**

**Issue:** The signup endpoint accepts `ROLE_ADMIN` in the roles array without any restriction.

**Test Case:**
```bash
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser3",
    "email":"test3@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_ADMIN"]
  }'
# Response: HTTP/1.1 201 Created
```

**Expected:** Admin role assignment should be restricted. Only existing admins or system should be able to create admin users.

**Impact:** **CRITICAL SECURITY ISSUE** - Anyone can create admin accounts, bypassing authorization controls.

---

### 4. **Information Disclosure in Error Messages**

**Issue:** Invalid role enum values return detailed error messages exposing internal implementation details.

**Test Case:**
```bash
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser8",
    "email":"test8@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["INVALID_ROLE"]
  }'
# Response: HTTP/1.1 400
# Body: {
#   "status": 400,
#   "message": "Invalid JSON format: Cannot deserialize value of type `com.awesome.testing.dto.user.Role` from String \"INVALID_ROLE\": not one of the values accepted for Enum class: [ROLE_CLIENT, ROLE_ADMIN]\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 124] (through reference chain: com.awesome.testing.dto.user.UserRegisterDto[\"roles\"]->java.util.ArrayList[0])",
#   "timestamp": "2025-11-25T12:07:27.036960437Z"
# }
```

**Issues:**
- Exposes full Java package path: `com.awesome.testing.dto.user.Role`
- Exposes DTO class name: `UserRegisterDto`
- Exposes internal deserialization details
- Includes stack trace-like information

**Expected:** Generic error message like: `"Invalid role value. Accepted values: ROLE_CLIENT, ROLE_ADMIN"`

**Impact:** Medium - Information disclosure that could aid attackers in understanding system internals.

---

### 5. **Duplicate Fields in JSON Are Accepted (Last Wins)**

**Issue:** JSON with duplicate keys is accepted, and the last value is used.

**Test Cases:**
```bash
# Duplicate username field
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser9",
    "email":"test9@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_CLIENT"],
    "username":"duplicate"
  }'
# Response: HTTP/1.1 201 Created
# User created with username "duplicate" (last value wins)

# Duplicate email field
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser10",
    "email":"test10@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_CLIENT"],
    "email":"duplicate@test.com"
  }'
# Response: HTTP/1.1 201 Created
# User created with email "duplicate@test.com" (last value wins)

# Duplicate roles field
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser11",
    "email":"test11@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_CLIENT"],
    "roles":["ROLE_ADMIN"]
  }'
# Response: HTTP/1.1 201 Created
# User created with roles ["ROLE_ADMIN"] (last value wins)
```

**Expected:** Should reject JSON with duplicate keys or return a validation error.

**Impact:** Low-Medium - Could lead to unexpected behavior if clients accidentally send duplicate fields. However, this is standard JSON parser behavior (last value wins).

---

### 6. **Extra Fields Are Silently Ignored**

**Issue:** Additional fields in request payload are accepted and ignored without warning.

**Test Case:**
```bash
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser7",
    "email":"test7@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_CLIENT"],
    "extraField":"shouldIgnore"
  }'
# Response: HTTP/1.1 201 Created
# Extra field is silently ignored

curl -X 'POST' 'http://localhost:4001/users/signin' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser1",
    "password":"password123",
    "extra":"field"
  }'
# Response: HTTP/1.1 200 OK
# Extra field is silently ignored
```

**Expected:** Could return a warning or reject unknown fields. However, silently ignoring extra fields is a common API design pattern (permissive vs strict).

**Impact:** Low - Common practice, but could mask typos in field names.

---

### 7. **Signin Does Not Accept Email Instead of Username**

**Issue:** Signin endpoint only accepts username, not email address.

**Test Case:**
```bash
curl -X 'POST' 'http://localhost:4001/users/signin' \
  -H 'Content-Type: application/json' \
  -d '{"username":"test1@example.com","password":"password123"}'
# Response: HTTP/1.1 422
# Body: {"message": "Invalid username/password supplied"}
```

**Expected:** Many APIs allow login with either username or email. This is not necessarily a bug, but could be a UX limitation.

**Impact:** Low - Design decision, not a bug.

---

### 8. **Inconsistent Error Response Format**

**Issue:** Different error scenarios return different response formats.

**Examples:**
- Duplicate username/email: `{"message": "Username is already in use"}`
- Validation errors: `{"fieldName": "Error message"}`
- Invalid role enum: `{"status": 400, "message": "...", "timestamp": "..."}`
- Invalid credentials: `{"message": "Invalid username/password supplied"}`

**Expected:** Consistent error response format across all error scenarios.

**Impact:** Low-Medium - Makes error handling more complex for API consumers.

---

### 9. **Signup Response Body is Empty**

**Issue:** Successful signup returns empty response body (only 201 status).

**Test Case:**
```bash
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser1",
    "email":"test1@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_CLIENT"]
  }'
# Response: HTTP/1.1 201 Created
# Body: (empty)
```

**Expected:** Could return created user details or at least username/email for confirmation. However, empty body for 201 is acceptable per REST conventions.

**Impact:** Low - Acceptable behavior, but could improve UX by returning created user info.

---

## 🔒 Security Concerns

1. **CRITICAL: Admin Role Self-Assignment**
   - Anyone can create admin accounts via signup
   - No validation or restriction on `ROLE_ADMIN` assignment
   - **Recommendation:** Remove `ROLE_ADMIN` from allowed roles in signup, or add server-side validation to prevent admin creation

2. **Information Disclosure**
   - Error messages expose internal Java class names and package structure
   - **Recommendation:** Sanitize error messages in production, return generic messages

3. **Inconsistent Status Codes**
   - Missing field validation returns 422 instead of 400
   - Wrong content-type returns 401 instead of 400
   - **Recommendation:** Align status codes with API documentation

---

## 📊 Test Coverage Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| Happy path signup | ✅ PASS | Returns 201 |
| Happy path signin | ✅ PASS | Returns 200 with token |
| Duplicate username | ✅ PASS | Returns 400 |
| Duplicate email | ✅ PASS | Returns 400 |
| Validation errors | ✅ PASS | Returns 400 with field errors |
| Missing required fields | ✅ PASS | Returns 400/422 |
| Invalid credentials | ✅ PASS | Returns 422 |
| Boundary values | ✅ PASS | Min lengths enforced |
| Invalid role enum | ⚠️ PASS | Returns 400 but with info disclosure |
| Extra fields | ✅ PASS | Silently ignored |
| Duplicate JSON keys | ⚠️ PASS | Last value wins (standard behavior) |
| Wrong content-type | ⚠️ PASS | Returns 401 (should be 400) |
| Admin role creation | 🔴 FAIL | **SECURITY ISSUE** - Anyone can create admin |

---

## Recommendations

1. **Immediate Action Required:**
   - Restrict `ROLE_ADMIN` assignment in signup endpoint
   - Sanitize error messages to remove internal implementation details

2. **Improvements:**
   - Standardize error response format
   - Align status codes with API documentation
   - Consider returning created user info in signup response
   - Add validation to reject duplicate JSON keys (optional)

3. **Documentation Updates:**
   - Clarify that signin only accepts username (not email)
   - Document that extra fields are ignored
   - Update status code documentation to match actual behavior

---

## Test Commands Reference

### Successful Signup
```bash
curl -X 'POST' 'http://localhost:4001/users/signup' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"testuser1",
    "email":"test1@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User",
    "roles":["ROLE_CLIENT"]
  }'
```

### Successful Signin
```bash
curl -X 'POST' 'http://localhost:4001/users/signin' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"admin",
    "password":"admin"
  }'
```

### Signin Response Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "email": "awesome@testing.com",
  "firstName": "Slawomir",
  "lastName": "Radzyminski",
  "roles": ["ROLE_ADMIN"]
}
```

