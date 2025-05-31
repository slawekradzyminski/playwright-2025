# 🧪 Test Automation in Practice 2025

A modern TypeScript-based test suite for validating both API and UI layers of a Dockerized AWS-like application stack, powered by awesome-localstack.

## 📦 Project Overview

This repository contains a comprehensive suite of automated tests using Playwright to validate the functionality of a full-stack e-commerce application running in a local AWS-like environment provided by awesome-localstack. The test suite covers authentication, product management, shopping cart functionality, user management, and various utility features.

## 🔧 Features

- **Comprehensive API Testing**: Validates 11 API endpoints with 34 test cases covering authentication, user management, products, cart operations, and orders
- **Extensive UI Testing**: Tests 4 complete screens with 23 test cases covering login, registration, home dashboard, and product catalog
- **Page Object Model**: Clean, maintainable UI test architecture with reusable page objects
- **TypeScript Support**: Full type safety and better developer experience across all test layers
- **Authentication Fixtures**: Streamlined API-based authentication for UI tests
- **Dockerized Environment**: Tests designed for awesome-localstack containerized services

## 📊 Test Coverage Status

### API Test Coverage
- **Total Endpoints**: 35 endpoint-method combinations
- **Currently Tested**: 11 endpoints (31% coverage)
- **Test Cases**: 34 comprehensive API tests
- **Coverage Plan**: [API Test Coverage Plan](API-test-coverage-plan.md)

### UI Test Coverage  
- **Total Screens**: 11 application screens
- **Currently Tested**: 4 screens (36% coverage)
- **Test Cases**: 23 comprehensive UI tests
- **Coverage Plan**: [UI Test Coverage Plan](UI-test-coverage-plan.md)

## 🗂️ Project Structure

```
.
├── tests/
│   ├── api/                        # API test suites
│   │   ├── auth.spec.ts           # Authentication endpoints
│   │   ├── users.spec.ts          # User management endpoints
│   │   ├── products.spec.ts       # Product catalog endpoints
│   │   ├── cart.spec.ts           # Shopping cart endpoints
│   │   └── orders.spec.ts         # Order management endpoints
│   └── ui/                        # UI test suites
│       ├── login.ui.spec.ts       # Login page tests
│       ├── register.ui.spec.ts    # Registration page tests
│       ├── home.ui.spec.ts        # Home dashboard tests
│       └── products.ui.spec.ts    # Products page tests
├── pages/                         # Page Object Model classes
│   ├── BasePage.ts               # Base page functionality
│   ├── LoginPage.ts              # Login page objects
│   ├── RegisterPage.ts           # Registration page objects
│   ├── HomePage.ts               # Home page objects
│   └── ProductsPage.ts           # Products page objects
├── fixtures/                     # Test fixtures and utilities
│   ├── auth.fixture.ts           # API authentication fixture
│   └── ui.auth.fixture.ts        # UI authentication fixture
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Authentication types
│   ├── user.ts                   # User management types
│   ├── product.ts                # Product types
│   ├── cart.ts                   # Shopping cart types
│   └── order.ts                  # Order types
├── http/                         # HTTP client functions
├── validators/                   # Response validation utilities
├── test-plans/                   # Detailed test documentation
│   ├── products-page-test-plan.md
│   └── products/                 # Individual test cases
├── API-test-coverage-plan.md     # API testing strategy
├── UI-test-coverage-plan.md      # UI testing strategy
├── playwright.config.ts          # Playwright configuration
└── package.json                  # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js LTS, Recommended `v22.16.0`
- Docker

### Setup

1. **Clone the Repository**

```bash
git clone https://github.com/slawekradzyminski/playwright-may-2025
cd playwright-may-2025
```

2. **Install Dependencies**

```bash
npm install
npx playwright install chromium
```

3. **Start the Dockerized Environment**

Follow the instructions in the awesome-localstack repository to set up and start the Docker containers. Ensure the following services are running:

- **Frontend**: Accessible at http://localhost:8081
- **Backend API**: Accessible at http://localhost:4001

4. **Run Tests**

**API Tests**

```bash
# Run all API tests
npx playwright test tests/api/

# Run specific API test suites
npx playwright test tests/api/auth.spec.ts
npx playwright test tests/api/cart.spec.ts
```

**UI Tests**

```bash
# Run all UI tests
npx playwright test tests/ui/

# Run specific UI test suites
npx playwright test tests/ui/login.ui.spec.ts
npx playwright test tests/ui/products.ui.spec.ts
```

**All Tests**

```bash
npx playwright test
```

## ⚙️ Configuration

The `playwright.config.ts` file is configured to:

- Run tests in parallel for faster execution
- Use Chromium browser for UI tests
- Collect trace information on the first retry of a failed test
- Specify the test directory as `./tests`
- Support both API and UI testing workflows

## 🧪 Test Details

### API Tests

Comprehensive API testing covering:

- **Authentication** (`tests/api/auth.spec.ts`): Login/signup endpoints with validation and error scenarios
- **User Management** (`tests/api/users.spec.ts`): User CRUD operations and profile management
- **Products** (`tests/api/products.spec.ts`): Product catalog and search functionality
- **Shopping Cart** (`tests/api/cart.spec.ts`): Complete cart CRUD operations with comprehensive error handling
- **Orders** (`tests/api/orders.spec.ts`): Order creation, retrieval, and management

### UI Tests

Extensive UI testing using Page Object Model:

- **Login Page** (`tests/ui/login.ui.spec.ts`): Authentication form, validation, navigation, and accessibility
- **Register Page** (`tests/ui/register.ui.spec.ts`): Registration form, validation, and user creation flow
- **Home Page** (`tests/ui/home.ui.spec.ts`): Dashboard navigation, user information, and feature access
- **Products Page** (`tests/ui/products.ui.spec.ts`): Product catalog, filtering, search, and shopping interactions

## 📋 Test Plans & Documentation

### Detailed Test Plans
- **[Products Page Test Plan](test-plans/products-page-test-plan.md)**: 15 comprehensive test cases in Testflo format
- **[Individual Test Cases](test-plans/products/)**: Detailed test case documentation with prerequisites and expected results

### Coverage Plans
- **[API Test Coverage Plan](API-test-coverage-plan.md)**: Complete API endpoint coverage strategy
- **[UI Test Coverage Plan](UI-test-coverage-plan.md)**: Comprehensive UI screen coverage plan

## 🧰 Technologies Used

- **Playwright**: End-to-end testing framework for web applications
- **TypeScript**: Typed superset of JavaScript for better development experience
- **Page Object Model**: Maintainable UI test architecture
- **Docker**: Containerization platform for consistent test environments
- **awesome-localstack**: Dockerized local AWS environment for development and testing

## 🎯 Quality Standards

- **Given/When/Then**: All tests follow BDD-style structure with clear comments
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Modern Syntax**: ES6+ features with import/export modules
- **No Code Comments**: Self-documenting code without explanatory comments
- **Comprehensive Validation**: Thorough response and UI state validation
- **Error Scenario Coverage**: Extensive testing of edge cases and error conditions

## Playwright MCP

Read more about Playwright MCP here: https://github.com/microsoft/playwright-mcp

## 📝 License

This project is licensed under the ISC License.

For more information on setting up and using the Dockerized environment, refer to the awesome-localstack repository.