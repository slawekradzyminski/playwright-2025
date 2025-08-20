# Manual Test Cases Documentation

This folder contains manual regression test cases for the Playwright testing project frontend application.

## Overview

Manual test cases are essential for:
- **Regression Testing:** Ensuring new changes don't break existing functionality
- **User Acceptance Testing:** Validating user workflows and experience
- **Cross-Browser Testing:** Verifying compatibility across different browsers
- **Exploratory Testing:** Finding issues that automated tests might miss
- **Release Validation:** Final verification before deployment

## Folder Structure

```
test_cases/
├── README.md                          # This file - documentation and guidelines
├── manual-test-template.md            # Template for creating new test cases
├── home-page-manual-tests.md          # Completed test cases for Home Page
└── [future-page-tests].md            # Additional test case files for other pages
```

## Test Case Files

### Completed Test Cases
- ✅ **home-page-manual-tests.md** - Home Page (`/`) test cases
  - 12 comprehensive test cases covering all home page functionality
  - Includes navigation, content display, and user interaction tests

### Planned Test Cases (Based on ui-test-coverage.md)

#### Public Pages
- 📋 `login-page-manual-tests.md` - Login Page (`/login`)
- 📋 `register-page-manual-tests.md` - Register Page (`/register`)

#### Protected Pages  
- 📋 `products-page-manual-tests.md` - Products Page (`/products`)
- 📋 `product-details-manual-tests.md` - Product Details (`/products/:id`)
- 📋 `users-page-manual-tests.md` - Users Management (`/users`)
- 📋 `edit-user-manual-tests.md` - Edit User (`/users/:username/edit`)
- 📋 `email-page-manual-tests.md` - Email Service (`/email`)
- 📋 `qr-code-manual-tests.md` - QR Generator (`/qr`)
- 📋 `llm-page-manual-tests.md` - AI Assistant (`/llm`)
- 📋 `profile-page-manual-tests.md` - User Profile (`/profile`)
- 📋 `cart-page-manual-tests.md` - Shopping Cart (`/cart`)
- 📋 `checkout-manual-tests.md` - Checkout (`/checkout`)
- 📋 `order-details-manual-tests.md` - Order Details (`/orders/:id`)
- 📋 `traffic-monitor-manual-tests.md` - Traffic Monitor (`/traffic`)

#### Admin Pages
- 📋 `admin-dashboard-manual-tests.md` - Admin Dashboard (`/admin`)
- 📋 `admin-products-manual-tests.md` - Admin Products (`/admin/products`)
- 📋 `admin-product-form-manual-tests.md` - Admin Product Form (`/admin/products/new`, `/admin/products/edit/:id`)
- 📋 `admin-orders-manual-tests.md` - Admin Orders (`/admin/orders`)

## How to Use This Documentation

### For Test Execution
1. Choose the appropriate test case file for the page you want to test
2. Follow the prerequisites section to set up your test environment
3. Execute test cases in order, documenting results
4. Report any bugs using the provided template
5. Update test coverage tracking tables

### For Creating New Test Cases
1. Use `manual-test-template.md` as your starting point
2. Follow the established naming convention: `[page-name]-manual-tests.md`
3. Include all standard test categories relevant to your page
4. Verify test steps using Playwright MCP browser exploration
5. Update this README with the new test case file

### For Test Maintenance
1. Review test cases after each feature release
2. Update test steps when UI changes occur
3. Archive obsolete test cases
4. Keep test data and expected results current

## Test Environment Setup

### Prerequisites
- Frontend application running on `http://localhost:8081`
- Backend API services available and responsive
- Test user accounts available:
  - Admin user: `admin` / `admin`
  - Regular user: [as needed]

### Browser Requirements
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

### Test Data Requirements
- Clean test environment with predictable data
- Valid user accounts with different roles
- Sample products, orders, and other entities as needed

## Test Execution Guidelines

### Test Cycle Execution
1. **Pre-Testing Setup**
   - Verify test environment stability
   - Clear browser cache and cookies
   - Prepare required test data
   - Document browser versions and OS

2. **Test Execution**
   - Follow test steps exactly as documented
   - Take screenshots for failures
   - Note any deviations or unexpected behavior
   - Check browser console for errors

3. **Post-Testing Activities**
   - Document all results (Pass/Fail/Blocked)
   - File detailed bug reports for failures
   - Update test case documentation if needed
   - Clean up test data

### Result Documentation
Use the provided templates in each test case file to document:
- Test execution results
- Bug reports with detailed reproduction steps
- Test coverage tracking
- Environment information

## Quality Standards

### Test Case Quality
- **Clear and Actionable:** Steps should be unambiguous
- **Reproducible:** Anyone should be able to execute the tests
- **Comprehensive:** Cover both positive and negative scenarios
- **Maintainable:** Easy to update when features change

### Bug Reporting Quality
- **Detailed Steps:** Exact reproduction steps
- **Clear Evidence:** Screenshots, console logs, videos
- **Severity Assessment:** Impact on user experience
- **Environment Details:** Browser, OS, specific conditions

## Integration with Automated Testing

These manual test cases complement the automated Playwright tests in the `/tests` folder:

- **Manual Tests Focus:** User experience, visual validation, exploratory testing
- **Automated Tests Focus:** Regression testing, API validation, functional verification
- **Overlap:** Some scenarios are tested both manually and automatically for comprehensive coverage

## Contributing

When adding new test cases:
1. Use the provided template
2. Validate steps using Playwright MCP exploration
3. Include comprehensive coverage of page functionality
4. Follow established naming and formatting conventions
5. Update this README with new file information

## Tools and Resources

### Browser Developer Tools
- Use to check console errors
- Inspect network requests
- Validate HTML structure and accessibility

### Playwright MCP
- Use for exploring pages and verifying UI elements
- Validate test steps before documenting
- Capture accurate selectors and page states

### Documentation References
- `ui-test-coverage.md` - Overall UI testing strategy
- `api-test-coverage.md` - API testing reference
- Playwright configuration and existing automated tests

---

**Note:** This manual testing documentation is designed to work alongside automated Playwright tests to provide comprehensive test coverage for the application.
