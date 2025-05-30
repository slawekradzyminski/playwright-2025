# 🧪 Test Automation in Practice 2025

A modern TypeScript-based test suite for validating both API and UI layers of a Dockerized AWS-like application stack, powered by awesome-localstack.

## 📦 Project Overview

This repository contains a comprehensive suite of automated tests using Playwright to validate the functionality of a full-stack application running in a local AWS-like environment provided by awesome-localstack.

## 🔧 Features

- **API Testing**: Validates authentication endpoints with various scenarios, including successful logins and error handling.
- **UI Testing**: Ensures the login interface, registration flow, and homepage behave correctly, covering form validations, navigation, and accessibility.
- **TypeScript Support**: Utilizes TypeScript for type safety and better developer experience.
- **Page Object Model**: Implements the Page Object Model pattern for maintainable and reusable UI test code.
- **Dockerized Environment**: Tests are designed to run against services provided by the awesome-localstack Docker setup.

## 🗂️ Project Structure

```
.
├── tests/
│   ├── api/                        # API tests
│   └── ui/
│       ├── login.ui.spec.ts        # UI tests for the login page
│       ├── register.ui.spec.ts     # UI tests for the registration page
│       └── homepage.ui.spec.ts     # UI tests for the homepage
├── pages/
│   ├── LoginPage.ts                # Page object for login functionality
│   ├── RegisterPage.ts             # Page object for registration functionality
│   └── HomePage.ts                 # Page object for homepage functionality
├── types/
│   ├── auth.ts                     # TypeScript interfaces for authentication
│   ├── users.ts                    # User-related type definitions
│   ├── products.ts                 # Product-related type definitions
│   ├── orders.ts                   # Order-related type definitions
│   ├── cart.ts                     # Cart-related type definitions
│   └── qr.ts                       # QR code-related type definitions
├── generators/
│   └── userGenerator.ts            # Test data generators for user creation
├── fixtures/                       # Test fixtures and setup utilities
├── validators/                     # Data validation utilities
├── constants/                      # Application constants
├── http/                          # HTTP client utilities
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project metadata and dependencies
└── ...
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
npx playwright test tests/api/
```

**UI Tests**

```bash
npx playwright test tests/ui/
```

**Specific UI Test Files**

```bash
npx playwright test tests/ui/login.ui.spec.ts
npx playwright test tests/ui/register.ui.spec.ts
npx playwright test tests/ui/homepage.ui.spec.ts
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

## 🧪 Test Details

### API Tests (`tests/api/`)

These tests cover various scenarios for authentication and other API endpoints:

- **Successful Authentication**: Valid credentials return a 200 status with a valid token and user information
- **Validation Errors**: Tests for empty or short usernames/passwords, expecting 400 status codes with appropriate error messages
- **Authentication Errors**: Invalid credentials or missing fields result in 422 status codes with error messages
- **Invalid JSON**: Malformed JSON payloads return a 400 status with an error message indicating invalid format

### UI Tests (`tests/ui/`)

#### Login Tests (`login.ui.spec.ts`)
These tests validate the login page's functionality and user experience:

- **Form Elements**: Ensures all necessary form elements are visible
- **Successful Login**: Valid credentials redirect the user away from the login page
- **Form Validations**: Empty or invalid inputs keep the user on the login page
- **Navigation**: Clicking on "Register" buttons or links navigates to the registration page
- **Form Reset**: Navigating away and back to the login page clears form fields
- **Keyboard Navigation**: Supports tabbing through fields and submitting the form with the Enter key

#### Registration Tests (`register.ui.spec.ts`)
These tests validate the registration page's functionality:

- **Successful Registration**: Valid user data creates a new account and redirects appropriately
- **Form Validations**: Tests for existing usernames, empty required fields, and invalid email formats
- **Navigation**: Clicking on "Sign in" button navigates to the login page

#### Homepage Tests (`homepage.ui.spec.ts`)
These tests validate the logged-in homepage functionality:

- **Logged-in Header**: Verifies that all navigation links are displayed correctly after login:
  - Home
  - Products
  - Send Email
  - QR Code
  - LLM
  - Traffic Monitor
  - Admin
  - (user profile link)

## 🏗️ Page Object Model

The project implements the Page Object Model pattern with dedicated page classes:

- **LoginPage**: Handles login form interactions and validations
- **RegisterPage**: Manages registration form operations and navigation
- **HomePage**: Provides methods for interacting with the logged-in homepage

Each page object encapsulates:
- Element locators using Playwright's role-based selectors
- Action methods for user interactions
- Assertion methods for validations
- Navigation utilities

## 🔧 Test Fixtures

The project includes custom fixtures to streamline test setup:

- **auth.fixtures.ts**: Provides API-level authentication fixtures for backend testing
- **ui.fixtures.ts**: Provides UI-level fixtures including `loggedInPage` for tests requiring authenticated state

The `loggedInPage` fixture automatically handles the login process, allowing tests to focus on their specific functionality rather than authentication setup.

## 🧰 Technologies Used

- **Playwright**: End-to-end testing framework for web applications
- **TypeScript**: Typed superset of JavaScript
- **Docker**: Containerization platform
- **awesome-localstack**: Dockerized local AWS environment for development and testing

## Playwright MCP

Read more about Playwright MCP here: https://github.com/microsoft/playwright-mcp

## 📝 License

This project is licensed under the ISC License.

For more information on setting up and using the Dockerized environment, refer to the awesome-localstack repository.