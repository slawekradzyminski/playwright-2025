# 🧪 Test Automation in Practice 2025

A modern TypeScript-based test suite for validating both API and UI layers of a Dockerized AWS-like application stack, powered by awesome-localstack.

## 📦 Project Overview

This repository contains a comprehensive suite of automated tests using Playwright to validate the functionality of a full-stack application running in a local AWS-like environment provided by awesome-localstack.

## 🔧 Features

- **API Testing**: Validates authentication endpoints with various scenarios, including successful logins and error handling.
- **UI Testing**: Ensures the login interface behaves correctly, covering form validations, navigation, and accessibility.
- **TypeScript Support**: Utilizes TypeScript for type safety and better developer experience.
- **Dockerized Environment**: Tests are designed to run against services provided by the awesome-localstack Docker setup.

## 🗂️ Project Structure

```
.
├── tests/
│   ├── auth.spec.ts                # API tests for /users/signin endpoint
│   └── ui/
│       └── login.spec.ts           # UI tests for the login page
├── types/
│   └── auth.ts                     # TypeScript interfaces for authentication
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project metadata and dependencies
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
npx playwright test tests/auth.spec.ts
```

**UI Tests**

```bash
npx playwright test tests/ui/login.spec.ts
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

### API Tests (`tests/auth.spec.ts`)

These tests cover various scenarios for the `/users/signin` endpoint:

- **Successful Authentication**: Valid credentials return a 200 status with a valid token and user information
- **Validation Errors**: Tests for empty or short usernames/passwords, expecting 400 status codes with appropriate error messages
- **Authentication Errors**: Invalid credentials or missing fields result in 422 status codes with error messages
- **Invalid JSON**: Malformed JSON payloads return a 400 status with an error message indicating invalid format

### UI Tests (`tests/ui/login.spec.ts`)

These tests validate the login page's functionality and user experience:

- **Form Elements**: Ensures all necessary form elements are visible
- **Successful Login**: Valid credentials redirect the user away from the login page
- **Form Validations**: Empty or invalid inputs keep the user on the login page
- **Navigation**: Clicking on "Register" buttons or links navigates to the registration page
- **Form Reset**: Navigating away and back to the login page clears form fields
- **Keyboard Navigation**: Supports tabbing through fields and submitting the form with the Enter key

## 🧰 Technologies Used

- **Playwright**: End-to-end testing framework for web applications
- **TypeScript**: Typed superset of JavaScript
- **Docker**: Containerization platform
- **awesome-localstack**: Dockerized local AWS environment for development and testing

## UI Page Object Model (POM) Diagram

```mermaid
classDiagram
    class AbstractPage
    class LoggedOutPage
    class LoggedInPage
    class LoginPage
    class RegisterPage
    class HomePage
    class ProductsPage
    class TrafficPage
    class LoggedOutHeader
    class LoggedInHeader

    %% Inheritance (blue)
    AbstractPage <|-- LoggedOutPage
    AbstractPage <|-- LoggedInPage
    LoggedOutPage <|-- LoginPage
    LoggedOutPage <|-- RegisterPage
    LoggedInPage <|-- HomePage
    LoggedInPage <|-- ProductsPage
    LoggedInPage <|-- TrafficPage

    %% Composition (green)
    LoggedOutPage *-- LoggedOutHeader
    LoggedInPage *-- LoggedInHeader
```

### Textual Description for AI Agent

The system models different types of pages in a web application, separating logged-in and logged-out states.

- **AbstractPage**: Serves as the base class for all pages.
- **LoggedOutPage** (inherits from AbstractPage):
    - Has access to LoggedOutHeader (composition).
    - Specialised into:
        - LoginPage
        - RegisterPage
- **LoggedInPage** (inherits from AbstractPage):
    - Has access to LoggedInHeader (composition).
    - Specialised into:
        - HomePage
        - ProductsPage
        - TrafficPage

**Key distinction**:
- **Inheritance (blue)**: Defines specialisation of abstract/base pages.
- **Composition (green)**: Indicates that a page "has access to" or "contains" another component (e.g., a header).

## Playwright MCP

Read more about Playwright MCP here: https://github.com/microsoft/playwright-mcp

## 📝 License

This project is licensed under the ISC License.

For more information on setting up and using the Dockerized environment, refer to the awesome-localstack repository.