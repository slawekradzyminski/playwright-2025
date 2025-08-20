# UI Test Coverage Plan

## Overview
This document tracks the implementation status of UI tests for all screens/views in the React frontend application.

**Base URL:** `http://localhost:8081`

## Coverage Status Legend
- ✅ **DONE** - Tests implemented and complete
- 🚧 **IN_PROGRESS** - Currently being implemented
- 📋 **TODO** - Not yet started
- ⚠️ **BLOCKED** - Waiting for dependencies or clarification

---

## Test Coverage by Screen

### 1. Public Screens (Unauthenticated)

#### `/login` - Login Page
**Status:** ✅ **DONE**
- ✅ Successfully login with valid credentials
- ✅ Show error for empty username
- ✅ Show error for invalid credentials  
- ✅ Form validation for short username
- ✅ Navigate to register page when register link is clicked
- **File:** `tests/ui/login.ui.spec.ts`

#### `/register` - Register Page
**Status:** ✅ **DONE**
- ✅ Successfully register with valid user data
- ✅ Show error for empty username
- ✅ Show error for invalid email format
- ✅ Show error for short password
- ✅ Navigate to login page when login link is clicked
- **File:** `tests/ui/register.ui.spec.ts`

### 2. Protected Screens (Authenticated Users)

#### `/` - Home Page
**Status:** ✅ **DONE**
- ✅ Display welcome message with user name
- ✅ Display user email
- ✅ Navigation to products via "View Products" button
- ✅ Navigation to users via "Manage Users" button
- ✅ Navigation to profile via "View Profile & Orders" button
- ✅ Navigation to traffic monitor via "Open Traffic Monitor" button
- ✅ Navigation to AI assistant via "Open AI Assistant" button
- ✅ Navigation to QR generator via "Generate QR Codes" button
- ✅ Navigation to email service via "Send Emails" button
- **File:** `tests/ui/home.ui.spec.ts`

#### `/products` - Products Page
**Status:** 📋 **TODO**
- 📋 Display list of products with correct information
- 📋 Filter products by category
- 📋 Search products functionality
- 📋 Sort products (Name A-Z, Name Z-A, Price Low-High, Price High-Low)
- 📋 Add products to cart with quantity controls
- 📋 Navigate to product details page
- **File:** `tests/ui/products.ui.spec.ts`

#### `/products/:id` - Product Details Page
**Status:** 📋 **TODO**
- 📋 Display product information (name, price, description, category, stock)
- 📋 Add product to cart with quantity selection
- 📋 Navigate back to products page
- 📋 Handle invalid product ID (404 behavior)
- **File:** `tests/ui/product-details.ui.spec.ts`

#### `/users` - Users Page
**Status:** 📋 **TODO**
- 📋 Display list of users
- 📋 Navigate to edit user page
- 📋 User role-based access control
- **File:** `tests/ui/users.ui.spec.ts`

#### `/users/:username/edit` - Edit User Page
**Status:** 📋 **TODO**
- 📋 Display user form with current data
- 📋 Update user information
- 📋 Form validation
- 📋 Permission checks (only edit own profile or admin)
- **File:** `tests/ui/edit-user.ui.spec.ts`

#### `/email` - Email Page
**Status:** 📋 **TODO**
- 📋 Send email form functionality
- 📋 Form validation (recipient, subject, message)
- 📋 Success/error message handling
- 📋 Asynchronous delivery notification
- **File:** `tests/ui/email.ui.spec.ts`

#### `/qr` - QR Code Page
**Status:** 📋 **TODO**
- 📋 Generate QR code for text input
- 📋 Generate QR code for URL input
- 📋 Display generated QR code
- 📋 Form validation
- **File:** `tests/ui/qr-code.ui.spec.ts`

#### `/llm` - LLM Page
**Status:** 📋 **TODO**
- 📋 AI text generation functionality
- 📋 Chat interface with AI
- 📋 Server-Sent Events (SSE) streaming
- 📋 System prompt customization
- **File:** `tests/ui/llm.ui.spec.ts`

#### `/profile` - Profile Page
**Status:** 📋 **TODO**
- 📋 Display user profile information
- 📋 Display user orders
- 📋 Edit profile functionality
- 📋 Order history navigation
- **File:** `tests/ui/profile.ui.spec.ts`

#### `/cart` - Cart Page
**Status:** 📋 **TODO**
- 📋 Display cart items with correct information
- 📋 Update item quantities
- 📋 Remove items from cart
- 📋 Calculate total price
- 📋 Clear entire cart
- 📋 Navigate to checkout
- 📋 Empty cart state
- **File:** `tests/ui/cart.ui.spec.ts`

#### `/checkout` - Checkout Page
**Status:** 📋 **TODO**
- 📋 Display order summary
- 📋 Checkout form validation
- 📋 Complete order process
- 📋 Navigate to order confirmation
- **File:** `tests/ui/checkout.ui.spec.ts`

#### `/orders/:id` - Order Details Page
**Status:** 📋 **TODO**
- 📋 Display order information
- 📋 Display order items
- 📋 Order status tracking
- 📋 Permission checks (own orders only)
- **File:** `tests/ui/order-details.ui.spec.ts`

#### `/traffic` - Traffic Monitor Page
**Status:** 📋 **TODO**
- 📋 Real-time traffic monitoring display
- 📋 WebSocket connection functionality
- 📋 HTTP request/response visualization
- 📋 Response time and status code monitoring
- **File:** `tests/ui/traffic-monitor.ui.spec.ts`

### 3. Admin-Only Screens (ADMIN Role Required)

#### `/admin` - Admin Dashboard Page
**Status:** 📋 **TODO**
- 📋 Display dashboard statistics (products, orders, revenue)
- 📋 Navigate to manage products
- 📋 Navigate to view orders
- 📋 Recent orders summary
- 📋 Low stock products alert
- 📋 Role-based access control (admin only)
- **File:** `tests/ui/admin-dashboard.ui.spec.ts`

#### `/admin/products` - Admin Products Page
**Status:** 📋 **TODO**
- 📋 Display products table with all details
- 📋 Navigate to add new product
- 📋 Navigate to edit product
- 📋 Delete product functionality
- 📋 Product list sorting and filtering
- **File:** `tests/ui/admin-products.ui.spec.ts`

#### `/admin/products/new` - Admin Product Form Page (New)
**Status:** 📋 **TODO**
- 📋 Create new product form
- 📋 Form validation (name, price, stock, category required)
- 📋 Image URL validation
- 📋 Success message and redirect
- **File:** `tests/ui/admin-product-form-new.ui.spec.ts`

#### `/admin/products/edit/:id` - Admin Product Form Page (Edit)
**Status:** 📋 **TODO**
- 📋 Load existing product data in form
- 📋 Update product information
- 📋 Form validation
- 📋 Success message and redirect
- 📋 Handle invalid product ID
- **File:** `tests/ui/admin-product-form-edit.ui.spec.ts`

#### `/admin/orders` - Admin Orders Page
**Status:** 📋 **TODO**
- 📋 Display all orders table
- 📋 Order status management
- 📋 Order filtering and sorting
- 📋 Navigate to order details
- 📋 Update order status functionality
- **File:** `tests/ui/admin-orders.ui.spec.ts`

### 4. Special Routes

#### `/orders` (Redirect)
**Status:** 📋 **TODO**
- 📋 Redirect to profile page functionality
- **Note:** This is handled as part of routing tests

---

## Implementation Priority

### Phase 1: Core User Flows (Week 1)
1. ✅ **DONE** - Login/Register pages
2. 📋 **TODO** - Home page navigation
3. 📋 **TODO** - Products listing and details
4. 📋 **TODO** - Shopping cart functionality

### Phase 2: User Management & Utilities (Week 2)
1. 📋 **TODO** - User profile and editing
2. 📋 **TODO** - Email functionality
3. 📋 **TODO** - QR code generation
4. 📋 **TODO** - Order management

### Phase 3: Advanced Features (Week 3)
1. 📋 **TODO** - LLM/AI integration
2. 📋 **TODO** - Traffic monitoring
3. 📋 **TODO** - Admin dashboard and management

---

## Test Infrastructure Setup

### Page Object Model Classes
Following the pattern established, each screen should have a dedicated Page Object:
- ✅ `pages/LoginPage.ts` - Login page interactions (DONE)
- ✅ `pages/RegisterPage.ts` - Registration page interactions (DONE)
- ✅ `pages/HomePage.ts` - Home page interactions (DONE)
- 📋 `pages/ProductsPage.ts` - Products listing page
- 📋 `pages/ProductDetailsPage.ts` - Product details page
- 📋 `pages/UsersPage.ts` - Users management page
- 📋 `pages/EditUserPage.ts` - Edit user page
- 📋 `pages/EmailPage.ts` - Email sending page
- 📋 `pages/QrCodePage.ts` - QR code generation page
- 📋 `pages/LlmPage.ts` - AI/LLM interaction page
- 📋 `pages/ProfilePage.ts` - User profile page
- 📋 `pages/CartPage.ts` - Shopping cart page
- 📋 `pages/CheckoutPage.ts` - Checkout process page
- 📋 `pages/OrderDetailsPage.ts` - Order details page
- 📋 `pages/TrafficMonitorPage.ts` - Traffic monitoring page
- 📋 `pages/AdminDashboardPage.ts` - Admin dashboard page
- 📋 `pages/AdminProductsPage.ts` - Admin products management
- 📋 `pages/AdminProductFormPage.ts` - Admin product form (shared for new/edit)
- 📋 `pages/AdminOrdersPage.ts` - Admin orders management

### Test Utilities & Fixtures
- ✅ `generators/userGenerator.ts` - User data generators (DONE)
- ✅ `fixtures/auth.fixtures.ts` - Authentication fixtures (DONE)
- 📋 `fixtures/product.fixtures.ts` - Product data fixtures
- 📋 `fixtures/order.fixtures.ts` - Order data fixtures
- 📋 `utils/cart-helper.ts` - Shopping cart utilities
- 📋 `utils/admin-helper.ts` - Admin operations utilities

### Configuration & Setup
- ✅ Basic Playwright configuration (DONE)
- 📋 Role-based test configuration for admin tests
- 📋 Test data cleanup and setup strategies
- 📋 Cross-browser testing configuration

---

## Coverage Metrics
- **Total Screens:** 19 unique views
- **Implemented:** 3 (15.8%)
- **In Progress:** 0 (0%)
- **Remaining:** 16 (84.2%)

**Next Action:** Implement products page tests

## Test Strategy Notes

### Authentication Flows
- All protected routes should verify proper authentication
- Admin routes should verify role-based access control
- Logout functionality should be tested across different screens

### Cross-Screen Navigation
- Navigation between screens should be thoroughly tested
- Back button functionality where applicable
- Breadcrumb navigation where present

### Data Persistence
- Form data should persist correctly
- Shopping cart state management
- User session management

### Error Handling
- 404 pages for invalid routes/IDs
- Network error handling
- Form validation error display

### Performance & UX
- Loading states during async operations
- Real-time features (WebSocket, SSE) functionality
- Responsive design testing (optional)

---

**Note:** Screen coverage is based on the React router configuration analysis and verified through browser exploration. The 19 unique screens exclude redirects and shared components.
