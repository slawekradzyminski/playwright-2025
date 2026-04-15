# Playwright Fixtures Summary

## What Fixtures Are

Fixtures are Playwright Test's dependency injection mechanism.

Instead of manually preparing the same setup inside every test, you describe reusable setup once and ask for it in the test arguments:

```ts
test('should get current user info', async ({ request, auth }) => {
  const response = await usersMeClient.getUserMe(request, auth.token);

  expect(response.status()).toBe(200);
});
```

In that example:

- `request` is a built-in Playwright fixture.
- `auth` is a custom fixture from this repository.

The official Playwright idea is simple: each test receives only the environment it asks for. Fixtures are isolated between tests, reusable across files, on-demand, and composable.

## Built-In Fixtures You Already Use

Common Playwright fixtures:

- `page`: isolated browser page for one test
- `context`: isolated browser context for one test
- `browser`: shared browser instance
- `request`: isolated API request context
- `browserName`: current browser name, for example `chromium`

Example:

```ts
test('should open login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
```

`page` exists because Playwright prepares it before the test and disposes it after the test.

## Custom Fixture In This Repository

This project has a custom auth fixture in `fixtures/apiAuthFixture.ts`.

Simplified shape:

```ts
import { test as base } from '@playwright/test';

type AuthFixtureReturn = {
  auth: {
    user: RegisterDto;
    token: string;
  };
};

export const test = base.extend<AuthFixtureReturn>({
  auth: async ({ request }, use) => {
    const user = generateUser();
    await registerClient.postRegister(request, user);

    const loginResponse = await loginClient.postLogin(request, {
      username: user.username,
      password: user.password,
    });

    const loginResponseBody = await loginResponse.json();
    const token = loginResponseBody.token;

    await use({
      user,
      token,
    });

    // Cleanup would go here.
  },
});

export { expect } from '@playwright/test';
```

The flow is:

1. Generate a new user.
2. Register the user through API.
3. Log in through API.
4. Extract the token.
5. Pass `{ user, token }` into the test.
6. Optionally clean up after the test.

## The Most Important Line

```ts
await use({ user, token });
```

Everything before `await use(...)` is setup.

Everything after `await use(...)` is teardown.

Think about it like this:

```ts
fixture: async ({ dependency }, use) => {
  // before test

  await use(valueProvidedToTheTest);

  // after test
}
```

This is why fixtures are cleaner than separate `beforeEach` and `afterEach` hooks when setup and cleanup belong together.

## How Tests Consume The Fixture

A test imports `test` and `expect` from the fixture file:

```ts
import { test, expect } from '../../fixtures/apiAuthFixture';
```

Then it asks for `auth`:

```ts
test('should successfully get current user info - 200', async ({ request, auth }) => {
  const { user, token } = auth;

  const response = await usersMeClient.getUserMe(request, token);

  expect(response.status()).toBe(200);
  assertUserMeResponse(response, user);
});
```

If a test does not ask for `auth`, Playwright does not run the `auth` fixture.

That is the on-demand part.

## Fixtures Versus `beforeEach`

Use `beforeEach` when:

- setup is local to one file
- setup is very simple
- every test in the suite needs it
- no reusable value needs to be injected into the test

Example from the UI login tests:

```ts
test.beforeEach(async ({ page }) => {
  await page.goto(LOGIN_URL);
});
```

That is fine because every test in the suite starts on the login page.

Use a fixture when:

- setup is reused across files
- setup returns a value to the test
- setup needs matching teardown
- setup should run only for tests that ask for it
- setup depends on other fixtures, like `request` or `page`

The `auth` fixture is a good fixture because it gives tests a ready-to-use authenticated user and token.

## Fixtures Versus Helper Functions

A helper function is explicit:

```ts
const auth = await createAuthenticatedUser(request);
```

A fixture is injected:

```ts
test('example', async ({ auth }) => {
  // auth is already prepared
});
```

Use helper functions when the test should make the setup obvious as part of the scenario.

Use fixtures when the setup is infrastructure that many tests need and the test would be noisy without it.

Practical rule:

- if setup is part of the story, keep it in the test or a helper
- if setup is plumbing, consider a fixture

## Fixtures Versus Page Objects

Fixtures and page objects solve different problems.

Page objects model UI behavior:

```ts
await loginPage.loginAs('admin', password);
```

Fixtures prepare test state:

```ts
test('example', async ({ auth }) => {
  // user already exists and has a token
});
```

They can work together:

```ts
const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

Do not create a page object only because a tutorial says so. Create one when repeated UI behavior is making tests harder to read or change.

## Test-Scoped Fixtures

Most custom fixtures should start as test-scoped fixtures.

Test-scoped means:

- setup runs separately for each test that uses it
- state is isolated
- tests do not accidentally depend on each other

The current `auth` fixture is test-scoped. Each test using `auth` gets a freshly generated user.

That is a good default for reliability.

## Worker-Scoped Fixtures

Worker-scoped fixtures run once per worker process.

They are useful for expensive setup that can be safely reused:

- starting a server
- creating a shared test account
- preparing a static dataset
- seeding a database once per worker

They are also easier to misuse.

Risk:

- shared state can leak between tests
- parallel workers can collide if data is not unique
- failures can become harder to reproduce

Use worker fixtures only when test-scoped setup is too expensive and shared state is safe.

## Automatic Fixtures

Automatic fixtures run even when tests do not request them directly.

They are useful for cross-cutting infrastructure:

- collecting logs on failure
- attaching extra diagnostics
- preparing global debugging hooks

But they can hide behavior.

Use automatic fixtures sparingly. If a fixture changes test state, the test should usually ask for it explicitly.

## Fixture Cleanup

The current fixture has a placeholder:

```ts
// This is cleanup section which will run after each test
```

In a mature project, this could delete the created user:

```ts
await use({ user, token });

await usersClient.deleteUser(request, user.username, token);
```

Cleanup should be:

- idempotent if possible
- safe to run after failed tests
- not dependent on assertions passing
- visible enough that maintainers know what data is removed

If cleanup fails, that is usually a test infrastructure problem, not a product failure.

## Common Fixture Mistakes

### Mistake 1: Hidden Business Setup

Bad:

```ts
test('should checkout', async ({ readyCheckoutPage }) => {
  await readyCheckoutPage.submitOrder();
});
```

The test hides too much. How was the user created? What product is in the cart? Which payment method is selected?

Better:

```ts
test('should checkout a cart with one product', async ({ page, auth }) => {
  const product = await createProductFor(auth.user);
  await addProductToCart(auth.user, product);

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

### Mistake 2: One Giant Fixture

Bad:

```ts
test('example', async ({ everything }) => {
  // user, token, product, cart, page, admin, settings...
});
```

Better:

```ts
test('example', async ({ auth, product }) => {
  // only what this test needs
});
```

Fixtures should be small and composable.

### Mistake 3: Fixture Does Assertions For The Test

Setup can verify that setup succeeded, but the main business assertion should stay in the test.

Good setup assertion:

```ts
expect(loginResponse.status()).toBe(200);
```

Risky hidden business assertion:

```ts
// hidden inside fixture
expect(orderStatus).toBe('PAID');
```

If the purpose of the test is order payment, keep that assertion in the test.

## Recommended Fixture Roadmap For This Project

### Current Good Fixture

Keep:

- `auth`: creates user and token through API

### Useful Next Fixtures

Potential additions:

- `adminAuth`: logs in as admin and returns admin token
- `clientAuth`: creates or logs in a client user
- `createdProduct`: creates a product and returns its DTO/id
- `loggedInPage`: opens browser with authenticated storage state
- `cleanUser`: creates user and removes it after the test

Example:

```ts
type ProductFixture = {
  product: ProductResponse;
};

export const test = base.extend<ProductFixture>({
  product: async ({ request, auth }, use) => {
    const created = await productsClient.createProduct(request, generateProduct(), auth.token);

    await use(await created.json());

    // cleanup product here
  },
});
```

## Teaching Script For Day 2

Use this order:

1. Show a test with repeated login/setup code.
2. Extract a helper function.
3. Explain why the helper is still manually called.
4. Convert it to a fixture with `base.extend`.
5. Explain `await use(...)`.
6. Show that tests only run fixtures they ask for.
7. Add teardown after `await use(...)`.
8. Discuss when fixtures become too magical.

## Practical Rule

Fixtures are for controlled, reusable test environment setup.

They should make tests shorter, but not mysterious.

## Sources

- Playwright fixtures documentation: https://playwright.dev/docs/test-fixtures

