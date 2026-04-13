# 🧪 Test Automation in Practice 2025

A TypeScript-based Playwright suite for validating the current gateway-first application stack powered by awesome-localstack.

## 📦 Project Overview

This repository contains automated API and UI tests for the local training environment used during the Playwright course. The tests target the public gateway URL exposed by awesome-localstack, not raw internal service ports.

## 🔧 Features

- **API Testing**: Validates authentication endpoints with various scenarios, including successful logins and error handling.
- **UI Testing**: Ensures the login interface behaves correctly, covering form validations, navigation, and accessibility.
- **TypeScript Support**: Utilizes TypeScript for type safety and better developer experience with dedicated types in `/types` folder.
- **Dockerized Environment**: Tests are designed to run against services provided by the awesome-localstack Docker setup.

## 🗂️ Project Structure

```
.
├── httpclients/
│   └── loginClient.ts              # HTTP client for /api/v1/users/signin endpoint
├── tests/
│   ├── api/
│   │   └── login.api.spec.ts       # API tests for /api/v1/users/signin endpoint
│   └── ui/
│       └── login.ui.spec.ts        # UI tests for the login page
├── types/
│   └── auth.ts                     # TypeScript interfaces for authentication
├── .env                            # Local secrets — gitignored, never commit this
├── .env.example                    # Template showing which variables are required
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project metadata and dependencies
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js LTS, Recommended `v24.11.0`
- Docker

### Setup

1. **Clone the Repository**

```bash
git clone https://github.com/slawekradzyminski/playwright-2025
cd playwright-2025
```

2. **Install Dependencies**

```bash
npm install
npx playwright install chromium
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

The `.env` file is listed in `.gitignore` and **must never be committed** — it may contain real passwords. The following variables are supported:

| Variable | Default | Description |
|---|---|---|
| `APP_BASE_URL` | `http://localhost:8081` | Base URL of the running gateway |
| `ADMIN_USERNAME` | required | Username of the seeded admin user used by admin API fixtures |
| `ADMIN_PASSWORD` | required | Password of the seeded admin user |
| `LOGIN` | `client` | Regular demo user for UI tests |
| `PASSWORD` | `client` | Regular demo password for UI tests |

`playwright.config.ts` loads `.env` automatically at startup using [dotenv](https://github.com/motdotla/dotenv). Any variable defined there is available as `process.env.VARIABLE_NAME` across all test files. `APP_BASE_URL` falls back to the default local gateway, but admin credentials must be provided through `.env` or the shell environment.

4. **Start the Dockerized Environment**

Follow the instructions in the awesome-localstack repository and start the lightweight profile:

```bash
git clone https://github.com/slawekradzyminski/awesome-localstack
cd awesome-localstack
docker compose -f lightweight-docker-compose.yml up -d
```

The tests expect the following public app URL:

- **App Gateway**: `http://localhost:8081`
- **Login Page**: `http://localhost:8081/login`
- **Auth API**: `http://localhost:8081/api/v1/users/signin`

You can also override variables inline without a `.env` file:

```bash
APP_BASE_URL=http://localhost:8081 ADMIN_USERNAME=admin ADMIN_PASSWORD=your-password npx playwright test
```

5. **Run Tests**

**API Tests**

```bash
npm run test:api
# or
npx playwright test tests/api/login.api.spec.ts
```

**UI Tests**

```bash
npm run test:ui
# or
npx playwright test tests/ui/login.ui.spec.ts
```

**All Tests**

```bash
npm test
# or
npx playwright test
```

## ⚙️ Configuration

The `playwright.config.ts` file is configured to:

- Run tests in parallel for faster execution
- Use Chromium browser for UI tests
- Collect trace information on the first retry of a failed test
- Use list reporter for test output
- Retry failed tests on CI (up to 2 retries)
- Use single worker on CI, parallel workers locally

## 🧪 Test Details

### Admin API Auth and Parallelism

Admin API tests use `tests/api/fixtures/adminAuthFixture.ts`. The fixture logs in as the seeded admin user once per Playwright worker and exposes:

- `adminTokens`: the admin access and refresh tokens
- `adminRequest`: a worker-scoped `APIRequestContext` with `Authorization: Bearer <token>` already attached

This is intentionally different from regular client tests. Regular API tests create a fresh client user with `registerAndLogin` because public signup always creates `ROLE_CLIENT`. Admin tests cannot create fresh admins through signup, so the single seeded admin is reused only as an actor.

The backend access token is a stateless JWT, and the backend reloads the current user and roles from the database for each authenticated request. That makes parallel read-only admin calls safe. The shared risk is backend data mutation, not the shared admin token.

Safe to run fully in parallel:

- read-only admin checks such as `GET /api/v1/orders/admin`
- admin mutations where each test creates and owns its target product/user/order
- authorization checks where a fresh regular user receives `403`
- assertions based on response shape or test-owned data

Not safe to run fully in parallel:

- tests that delete or edit seeded users such as `admin`, `client`, `client2`, or `client3`
- tests that update or delete seeded catalog products used by other cart/product tests
- order status tests that reuse seeded orders, because status transitions are destructive
- tests that call admin logout or refresh-token revocation from a shared admin fixture
- tests that assert exact global counts from `/api/v1/orders/admin`, `/api/v1/users`, or other shared list endpoints while other tests create data

When a suite must mutate shared state or verify ordered transitions on one shared object, constrain it in code:

```ts
test.describe.configure({ mode: 'serial' });

test.describe('PUT /api/v1/orders/{id}/status @serial-admin', () => {
  // ordered transition tests for one shared order
});
```

The `mode: 'serial'` setting is the enforcement mechanism: Playwright will not run tests in that describe block concurrently, even when `fullyParallel: true` is enabled. The `@serial-admin` tag is a searchable marker for reviews and selective runs.

Current admin coverage added by this strategy:

- `GET /api/v1/orders/admin`: admin `200`, missing token `401`, regular client `403`
- `POST /api/v1/products`: admin-created disposable product `201`, validation `400`, missing token `401`, regular client `403`
- `PUT /api/v1/products/{id}`: updates only a test-owned product, with `200`, `400`, `401`, `403`, and `404` checks
- `DELETE /api/v1/products/{id}`: deletes only a test-owned product, with `204`, `401`, `403`, and `404` checks

Product admin mutation tests are parallel-safe because they create unique products and clean them up. They must not be rewritten to touch seeded catalog products.

### API Tests (`tests/api/login.api.spec.ts`)

These tests cover various scenarios for the `/api/v1/users/signin` endpoint, ordered by response code:

- **Successful Authentication (200)**: Valid credentials return a 200 status with a JWT token and complete user information
- **Validation Errors (400)**: Tests for empty username, short username, and short password scenarios with appropriate error messages
- **Authentication Errors (422)**: Invalid credentials result in 422 status codes with error messages

### UI Tests (`tests/ui/login.ui.spec.ts`)

These tests validate the login page's functionality and user experience:

- **Successful Login**: Valid credentials redirect the user away from the login page
- **Form Validation**: Empty password and invalid credentials keep the user on the login page
- **Navigation**: Clicking on "Register" buttons or links navigates to the registration page
- **Input Validation**: Short username validation prevents form submission

## 🧰 Technologies Used

- **Playwright**: End-to-end testing framework for web applications
- **TypeScript**: Typed superset of JavaScript
- **Docker**: Containerization platform
- **awesome-localstack**: Dockerized local AWS environment for development and testing

## Current Target Architecture

The tests assume a gateway-first local setup:

- browser traffic goes to `http://localhost:8081`
- frontend routes are served by the gateway
- backend API is exposed behind the same origin under `/api/v1/...`
- no test should depend on raw backend port `4001`

## Playwright MCP

The Playwright MCP (Model Context Protocol) server enables browser automation capabilities, allowing AI coding assistants to interact with web pages through structured accessibility snapshots.

Read more about Playwright MCP here: https://github.com/microsoft/playwright-mcp

### Prerequisites

- Node.js 18 or newer
- Playwright installed

### Cursor

1. Navigate to `Cursor Settings` → `MCP` → `Add new MCP Server`
2. Name it "playwright" and set the command to `npx @playwright/mcp@latest`
3. Save the configuration

### VS Code (GitHub Copilot)

**Option 1: Using CLI**

```bash
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'
```

**Option 2: Manual Configuration**

Open your MCP configuration file:
- macOS: `~/Library/Application Support/Code/User/mcp.json`
- Windows: `%APPDATA%\Code\User\mcp.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Restart VS Code or reload the window.

### Codex

**Option 1: Using CLI**

```bash
codex mcp add playwright npx "@playwright/mcp@latest"
```

**Option 2: Manual Configuration**

Edit the configuration file `~/.codex/config.toml` and add:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

### Claude Code

Use the Claude Code CLI to add the Playwright MCP server:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

### Claude Desktop

Open the configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Restart Claude Desktop.

## 📝 License

This project is licensed under the ISC License.

For more information on setting up and using the Dockerized environment, refer to the awesome-localstack repository.
