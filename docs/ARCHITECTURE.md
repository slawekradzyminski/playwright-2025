# System Under Test Architecture

This project tests the `../awesome-localstack/lightweight-docker-compose.yml` stack. The stack is intentionally gateway-first: tests and browsers enter through `http://localhost:8081`, and the gateway decides whether traffic goes to the frontend, backend API, Swagger/OpenAPI, actuator endpoints, or static images.

## Scope

The System Under Test is the lightweight local stack, not this Playwright repository itself.

- test runner: this repository, using Playwright API and UI tests
- compose file: `../awesome-localstack/lightweight-docker-compose.yml`
- gateway URL: `http://localhost:8081`
- Keycloak URL: `http://localhost:8082`
- Ollama mock URL: `http://localhost:11434`

The backend container exposes port `4001` only inside the Docker network. Tests should not call `4001` directly.

## Container Topology

```mermaid
flowchart LR
    subgraph Host["Developer machine"]
        Human["Human tester"]
        AI["AI coding assistant"]
        Tests["Playwright test runner<br/>this repository"]
        Browser["Chromium browser"]
    end

    subgraph Stack["awesome-light Docker Compose project"]
        Gateway["gateway<br/>nginx<br/>localhost:8081"]
        Frontend["frontend<br/>slawekradzyminski/frontend:3.6.8<br/>container port 80"]
        Backend["backend<br/>slawekradzyminski/backend:3.6.10<br/>container port 4001"]
        Keycloak["keycloak<br/>localhost:8082 -> 8080"]
        KeycloakInit["keycloak-init<br/>mock user password setup"]
        OllamaMock["ollama-mock<br/>localhost:11434"]
        Images["static images<br/>../awesome-localstack/images"]
    end

    Human --> Tests
    AI --> Tests
    Tests --> Gateway
    Browser --> Gateway
    Gateway --> Frontend
    Gateway --> Backend
    Gateway --> Images
    Backend --> Keycloak
    Backend --> OllamaMock
    KeycloakInit --> Keycloak
```

## Gateway Routing

The Nginx gateway in `../awesome-localstack/nginx/conf.d/lightweight-app-gateway.conf` provides one public application origin.

| Public route | Target |
| --- | --- |
| `/` and frontend routes | `frontend:80` |
| `/api/v1/` | `backend:4001` |
| `/api/v1/ws-traffic` | `backend:4001` with WebSocket upgrade headers |
| `/swagger-ui/` | `backend:4001` |
| `/v3/api-docs` | `backend:4001` |
| `/actuator/` | `backend:4001` |
| `/images/` | static files mounted from `../awesome-localstack/images` |

This means API tests should build URLs from `APP_BASE_URL`, and `APP_BASE_URL` should normally be `http://localhost:8081`.

## Runtime Responsibilities

- `gateway` is the public entry point for UI and API traffic.
- `frontend` serves the browser application behind the gateway.
- `backend` serves application APIs, Swagger/OpenAPI, actuator endpoints, and integration points used by tests.
- `keycloak` provides the local `awesome-testing` realm for SSO flows.
- `keycloak-init` waits for Keycloak and sets passwords for mock social-login users.
- `ollama-mock` provides a deterministic local replacement for the LLM service.

The backend runs with the `local` Spring profile and SSO enabled. It uses the browser-facing issuer `http://localhost:8082/realms/awesome-testing` and the Docker-network JWK endpoint `http://keycloak:8080/realms/awesome-testing/protocol/openid-connect/certs`.

## API Test Flow

```mermaid
sequenceDiagram
    participant Test as Playwright API test
    participant Client as HTTP client class
    participant Gateway as Nginx gateway localhost:8081
    participant Backend as Backend backend:4001
    participant Keycloak as Keycloak keycloak:8080
    participant Ollama as Ollama mock ollama-mock:11434

    Test->>Client: arrange request data
    Client->>Gateway: HTTP request to APP_BASE_URL + endpoint
    Gateway->>Backend: proxy /api/v1/* request
    Backend-->>Keycloak: validate SSO/JWK data when needed
    Backend-->>Ollama: call mock LLM when endpoint requires it
    Backend-->>Gateway: JSON response
    Gateway-->>Client: public-origin response
    Client-->>Test: APIResponse
    Test->>Test: assert status and body
```

API tests should keep transport details inside `httpclients/` and keep test files focused on given, when, then steps. Endpoint documentation can be checked through `api-docs.json` in this repository or the live gateway endpoint at `http://localhost:8081/v3/api-docs`.

## UI Test Flow

```mermaid
sequenceDiagram
    participant Test as Playwright UI test
    participant Browser as Chromium
    participant Gateway as Nginx gateway localhost:8081
    participant Frontend as Frontend frontend:80
    participant Backend as Backend API backend:4001
    participant Keycloak as Keycloak localhost:8082

    Test->>Browser: open /login
    Browser->>Gateway: GET /login
    Gateway->>Frontend: proxy frontend route
    Frontend-->>Browser: login application
    Browser->>Gateway: API calls under /api/v1/*
    Gateway->>Backend: proxy API request
    Backend-->>Gateway: application response
    Gateway-->>Browser: same-origin API response
    Browser-->>Keycloak: redirect for SSO flows when selected
```

UI tests should still start from `http://localhost:8081`; SSO browser redirects may leave that origin temporarily to use Keycloak on `http://localhost:8082`.

## Human And AI Cooperation

The project is structured so a human tester and an AI coding assistant can work from the same observable system: compose files, OpenAPI docs, gateway behavior, traffic logs, backend code, and Playwright test output.

```mermaid
flowchart TD
    Human["Human tester<br/>defines goal and reviews behavior"]
    AI["AI assistant<br/>reads docs, code, logs, and test results"]
    Contract["API contract<br/>api-docs.json or /v3/api-docs"]
    Stack["Running lightweight stack<br/>../awesome-localstack"]
    Code["Test code<br/>tests/, httpclients/, helpers/, types/"]
    Logs["Diagnostics<br/>curl, Docker logs, traffic utility"]
    Tests["Verification<br/>targeted Playwright test, then npm run test:api"]

    Human --> AI
    AI --> Contract
    AI --> Stack
    AI --> Logs
    AI --> Code
    Code --> Tests
    Stack --> Tests
    Tests --> AI
    AI --> Human
```

Recommended cooperation loop:

1. Human states the endpoint or behavior to test.
2. AI checks the OpenAPI contract, existing client/test patterns, and current gateway behavior.
3. AI adds or updates shared types, helpers, HTTP clients, and focused tests.
4. AI runs the new test first, then the full API suite when API tests are changed.
5. Human reviews the result, the test intent, and any unresolved behavior questions.

## Human And AI Debugging Loop

```mermaid
sequenceDiagram
    participant Human as Human tester
    participant AI as AI assistant
    participant Docs as Docs and contracts
    participant Stack as Lightweight stack
    participant Logs as Logs and traffic utility
    participant Tests as Playwright tests

    Human->>AI: report target behavior or failure
    AI->>Docs: inspect README, AGENTS.md, api-docs.json
    AI->>Stack: verify endpoint with curl if behavior is unclear
    AI->>Logs: inspect gateway/backend/traffic logs when needed
    AI->>Tests: update or add focused tests
    Tests-->>AI: pass/fail signal
    AI->>Tests: run full API suite for API changes
    AI-->>Human: summarize changed files, verification, and risks
```

Use `CLI_TRAFFIC_LOGS_UTILITY.md` when a response needs correlation with backend-side traffic. Use `../test-secure-backend` when the endpoint behavior cannot be understood from OpenAPI and observed responses alone.

## Quick Checks

From `../awesome-localstack`:

```bash
docker compose -f lightweight-docker-compose.yml ps
curl -i http://localhost:8081/login
curl -i http://localhost:8081/v3/api-docs
curl -i http://localhost:8081/images/iphone.png
curl -i http://localhost:8082/realms/awesome-testing/.well-known/openid-configuration
curl -i http://localhost:11434/api/tags
```

From this repository:

```bash
APP_BASE_URL=http://localhost:8081 npm run test:api
```
