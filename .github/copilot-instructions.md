---
description: Always use these rules when API tests are mentioned, created, or edited.
applyTo: "**/.api.spec.ts"
---

# GitHub Copilot Instructions for API Testing

### General Directives
* **Adhere to project standards**: All generated code must follow the project's established conventions.
* **Prioritize clarity**: Write clear, well-commented code.
* **Use TypeScript**: All new code for this project must be written in TypeScript.
* **Authentication**: When dealing with authentication objects, create custom TypeScript types in the `types` folder.
* **API Base URL**: The base URL for backend API calls is `http://localhost:4001`.

***

### Playwright API Testing Structure
* **Location**: API test files must be located in the `tests/api` directory.
* **File Naming**: API test files must follow the pattern `[test-name].api.spec.ts`, for example: `login.api.spec.ts`.
* **Request Context**: Use Playwright's `request` context for all backend API testing.

***

### Testing Best Practices
* **Comprehensive Coverage**: Create tests for both **positive** (success) and **negative** (failure) scenarios.
* **Test Ordering**: Order API tests by their expected response code, from success to failure: `200` → `400` → `401` → `403` → `404`.
* **Comment Structure**: Use the "Given/When/Then" comment structure to describe the steps of each test.
* **Parallel Execution**: Remember that tests run in parallel, so ensure they are independent and do not rely on shared state.