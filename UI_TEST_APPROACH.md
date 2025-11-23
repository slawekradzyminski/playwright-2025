# UI Test Approach

This guide captures how UI tests are structured in `playwright-2025` so contributors and AI agents can confidently extend the suite without relearning conventions from scratch.

## Core Principles
- Keep tests readable with the `// given`, `// when`, `// then` comment markers in every scenario.
- Drive the application only through page objects in `pages/` (and their component classes) so selectors stay centralized.
- Prefer `data-testid` locators and helper methods exposed by the page objects instead of ad-hoc selectors inside tests.
- Use the faker-based generators in `generators/` plus HTTP helpers in `http/` for data setup and cleanup.
- Avoid over-testing client-side validation details; cover the primary happy path and the few most meaningful validation states.
- Always run UI tests in headless mode (default Playwright behavior in this repo).

## Project Layout & Shared Utilities
- `tests/ui/**`: UI specs, named `*.ui.spec.ts`. Each file focuses on a single page or flow (e.g. `products.ui.spec.ts`).
- `pages/**`: Page Object Model (POM) classes. Examples:
  - `LoginPage`, `RegisterPage` for public screens.
  - `HomePage`, `ProductsPage`, `ProductDetailPage` for authenticated sections.
  - `pages/components/**` houses reusable widgets such as `LoggedInHeaderComponent`, `ToastComponent`.
- `fixtures/uiAuthFixture.ts`: extends Playwright’s `test` to preload `localStorage` with a valid JWT token (client or admin) via API calls before navigating to the UI. Use `authenticatedUiClientUser` for standard flows, `authenticatedUiAdminUser` if admin-specific UI exists.
- `fixtures/helpers/authHelper.ts`: signs up + logs in users via API (`attemptSignup`, `attemptLogin`) and returns `{ token, userData }`.
- `config/constants.ts`: exposes `UI_BASE_URL`, used everywhere to build navigation and URL assertions.
- Scripts: `npm run test:ui` (or `playwright test tests/ui/`) runs only the UI specs.

## Authentication & Data Setup
- Logged-out flows (login, register) can import `test` directly from `@playwright/test` like `tests/ui/login.ui.spec.ts`.
- Logged-in flows must import `test`/`expect` from `../../fixtures/uiAuthFixture` to gain access to `authenticatedUiClientUser` and to automatically have tokens seeded into local storage before page load.
- Use `generateRandomClientUser` + `attemptSignup` when a UI scenario needs an existing account (e.g. login success test).
- Reuse HTTP helpers inside UI tests for setup when the UI itself cannot efficiently create the state (e.g. registering users, seeding data).

## Page Object Usage
- Instantiate page objects in `test.beforeEach` whenever possible so every test starts from a fresh navigation (`await <Page>.goto()`).
- Interact with the UI exclusively through the methods and locators defined on the page object (`loginPage.login(credentials)`, `productsPage.clickCategory('electronics')`, etc.).
- Component properties (e.g. `homePage.header`, `loginPage.toast`) expose nested helper methods for shared UI (navigation links, toasts).
- If a locator is missing, add it to the relevant page object instead of reaching into `page` directly from the spec.

## Writing a UI Test
Typical structure (from `tests/ui/login.ui.spec.ts`):

```ts
test('should successfully login with valid credentials', async ({ page, request }) => {
  // given
  const randomUser = generateRandomClientUser();
  await attemptSignup(request, randomUser);
  const credentials: LoginDto = { username: randomUser.username, password: randomUser.password };
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  const homePage = new HomePage(page);

  // when
  await loginPage.login(credentials);

  // then
  await homePage.expectToBeOnHomePage();
  await homePage.header.expectLogoutButtonVisible();
});
```

### Checklist
- Navigation: call the relevant `goto()` or rely on the auth fixture (which already navigates to the home page) before performing actions.
- State: seed any required backend state via HTTP helpers (e.g. register a user, add items to a cart) so UI interactions can assume it exists.
- Assertions: combine URL checks (`await expect(page).toHaveURL(...)`), specific element expectations (`await loginPage.expectPasswordError(...)`), and component helpers (`homePage.header.expectCartCount(2)`).
- Toasts and transient UI: use `ToastComponent` helpers or targeted `Locator` queries in the page objects so tests remain resilient.
- Data: rely on generator helpers, not hard-coded strings, unless the scenario explicitly tests invalid values.
- Comments: always include `// given`, `// when`, `// then` markers even if a section is intentionally empty.

## Adding a New UI Suite
1. **Page Object**: update an existing page class or create a new one in `pages/` with typed locators and helper methods that lean on `data-testid` attributes.
2. **Spec File**: place it under `tests/ui/` and name it `<feature>.ui.spec.ts`. Import either `@playwright/test` or the custom UI auth fixture depending on whether the flow requires authentication.
3. **Setup**: in `test.beforeEach`, instantiate page objects and navigate to the relevant URL. Use fixtures/generators to seed data.
4. **Tests**: structure scenarios with descriptive names (`should ...`), follow the comment convention, and avoid redundant coverage of trivial validation states.
5. **Run**: execute `npm run test:ui` (headless) or `playwright test tests/ui/<file>` to validate.
6. **Troubleshooting**: leverage Playwright’s trace viewer if needed (`npx playwright show-trace test-results/...`), but keep the final tests deterministic.

## References & Tips
- `products.ui.spec.ts` showcases deep interactions (filtering, sorting, cart updates) and how to reuse header + toast components.
- `home.ui.spec.ts` demonstrates how the auth fixture positions the test on the home page so assertions can run immediately.
- `register.ui.spec.ts` illustrates how to mix UI interactions with API setup (signup) for error state coverage.
- Use Playwright MCP/inspector tools to explore new elements, then codify the selectors inside page objects before writing assertions.

Following these guidelines ensures any new UI scenario integrates smoothly with the existing suite and remains maintainable for humans and AI tooling alike.
