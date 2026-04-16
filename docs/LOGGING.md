# Logging Guide

## What Was Added

Two utilities live in `utils/`:

```
utils/logger.ts      — base Pino logger, shared across the whole project
utils/apiLogger.ts   — loggedApiCall() wrapper used in HTTP clients
```

Every HTTP client in `httpclients/` already uses `loggedApiCall`. When you create new tests, you will mainly work with two things:

- `createLogger` for contextual structured logs in any file
- `allure.step` and `allure.attachment` from `allure-playwright` for rich Allure report entries

---

## The Logger

`utils/logger.ts` configures a Pino logger with two outputs:

**Console** — colorized, human-readable, with timestamps and a `[context]` label:

```
07:22:14.031 DEBUG [http] → POST http://localhost:8081/api/v1/users/signin
07:22:14.803 INFO  [http] ← 200 POST http://localhost:8081/api/v1/users/signin
```

**File** — `logs/test.log` in the project root. JSON format, overwritten on each run. Useful for post-run inspection or feeding into log viewers.

### createLogger

Call `createLogger` with a short name that identifies where the log came from.

```ts
import { createLogger } from '../../utils/logger';

const log = createLogger('loginPage');
```

This returns a [Pino child logger](https://getpino.io/#/docs/child-loggers). Every message it emits includes `"context": "loginPage"` so you can filter logs by area.

### Log levels

| Method | Level | Use case |
|---|---|---|
| `log.debug(...)` | debug | Verbose data: payloads, intermediate values |
| `log.info(...)` | info | Milestones: navigation, form submission, assertion outcome |
| `log.warn(...)` | warn | Unexpected but recoverable situations |
| `log.error(...)` | error | Failures, caught exceptions |

The default level is `debug`. Change it with the `LOG_LEVEL` environment variable:

```bash
LOG_LEVEL=info npm run test:ui
```

### Structured logging

Pino logs are structured. Pass an object as the first argument for searchable key-value pairs:

```ts
log.info({ url: page.url(), username: credentials.username }, 'filling login form');
```

Do not concatenate strings to carry data:

```ts
// bad
log.info(`filling login form at ${page.url()} for user ${credentials.username}`);

// good
log.info({ url: page.url(), username: credentials.username }, 'filling login form');
```

The second form is queryable in the JSON log file and is cleaner in the terminal output.

---

## loggedApiCall

`utils/apiLogger.ts` exports `loggedApiCall`. It wraps an HTTP client call with:

1. A Pino `debug` log for the outgoing request
2. An Allure step named `METHOD URL`
3. An Allure attachment for the request body (if present)
4. A Pino `info` log for the response
5. An Allure attachment for the response body and status

All HTTP clients already use it. You do not need to call it yourself unless you are creating a new HTTP client.

New HTTP client pattern:

```ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { loggedApiCall } from '../utils/apiLogger';

export const SOME_ENDPOINT = '/api/v1/some-resource';

export const someClient = {
  async getSomething(request: APIRequestContext, token?: string): Promise<APIResponse> {
    const url = `${APP_BASE_URL}${SOME_ENDPOINT}`;
    return loggedApiCall(
      { method: 'GET', url },
      () => request.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      }),
    );
  },
};
```

Mask sensitive fields in the `body` argument passed to `loggedApiCall`:

```ts
loggedApiCall(
  { method: 'POST', url, body: { ...data, password: '***' } },
  () => request.post(url, { data }),
);
```

The `body` argument is only used for logging and Allure attachments. The real payload is what you pass to `request.post`.

---

## Using Logging In API Tests

For most API tests you do not need to add logging manually. The HTTP clients already log every request and response. If you want to add context inside a test, use `createLogger` and `allure.step`.

```ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createLogger } from '../../utils/logger';
import { loginClient } from '../../httpclients/loginClient';

const log = createLogger('login.api.spec');

test('should successfully authenticate with valid credentials - 200', async ({ request }) => {
  const loginData = { username: 'admin', password: process.env.ADMIN_PASSWORD ?? '' };

  log.info({ username: loginData.username }, 'starting login test');

  const response = await loginClient.postLogin(request, loginData);

  log.info({ status: response.status() }, 'login response received');

  expect(response.status()).toBe(200);
});
```

The HTTP client already creates an Allure step and attaches the request/response. The extra `log` calls above go to the console and the log file.

---

## Using Logging In UI Tests

UI tests do not use `loggedApiCall`. They use `createLogger` for Pino output and `allure.step` with `allure.attachment` directly for Allure report entries.

### Basic example

```ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createLogger } from '../../utils/logger';
import { ADMIN_PASSWORD } from '../../config/constants';

const APP_BASE_URL = process.env.APP_BASE_URL ?? 'http://localhost:8081';
const log = createLogger('login.ui.spec');

test('should successfully login with valid credentials', async ({ page }) => {
  log.info('navigating to login page');
  await page.goto(`${APP_BASE_URL}/login`);

  await allure.step('Fill and submit login form', async () => {
    log.debug({ username: 'admin' }, 'filling credentials');

    await page.getByRole('textbox', { name: 'Username' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
  });

  await allure.step('Assert successful redirect', async () => {
    await expect(page).not.toHaveURL(`${APP_BASE_URL}/login`);
    log.info({ url: page.url() }, 'login succeeded, current URL');
  });
});
```

`allure.step` groups related actions into a labeled step in the Allure report. Steps are nested under the test in the report timeline and expand to show attachments.

### Attaching a screenshot

Attach a screenshot inside a step to capture what the page looked like at a meaningful moment.

```ts
await allure.step('Assert error message is visible', async () => {
  await expect(page.getByText('Invalid username/password supplied')).toBeVisible();

  const screenshot = await page.screenshot();
  await allure.attachment('Error state', screenshot, { contentType: 'image/png' });

  log.info('error message confirmed visible');
});
```

### Attaching page state as JSON

When you need to log dynamic data in a structured way in the report:

```ts
await allure.step('Read current user from UI', async () => {
  const username = await page.getByTestId('username-label').textContent();
  const email = await page.getByTestId('email-label').textContent();

  const userData = { username, email };

  log.debug(userData, 'user data from UI');

  await allure.attachment('User state', JSON.stringify(userData, null, 2), {
    contentType: 'application/json',
  });
});
```

### Logging navigation events

```ts
const log = createLogger('checkout.ui.spec');

test('should complete checkout', async ({ page }) => {
  log.info('starting checkout flow');

  await allure.step('Navigate to product page', async () => {
    await page.goto(`${APP_BASE_URL}/products`);
    log.debug({ url: page.url() }, 'product page loaded');
  });

  await allure.step('Add product to cart', async () => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    log.info('product added to cart');
  });

  await allure.step('Submit order', async () => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.getByText('Order confirmed')).toBeVisible();
    log.info('order confirmed');
  });
});
```

---

## How Logs Appear In The Allure Report

When you open an Allure report after running tests, each test expands to show its step timeline.

Steps created by `loggedApiCall` in HTTP clients appear automatically:

```
▶ POST http://localhost:8081/api/v1/users/signin
    📎 Request Body         (JSON)
    📎 Response 200         (JSON with full response body)
▶ GET http://localhost:8081/api/v1/users/me
    📎 Response 200         (JSON with full response body)
```

Steps you create with `allure.step` in test files appear alongside them:

```
▶ Fill and submit login form
▶ Assert successful redirect
```

Steps nest when you call `allure.step` inside `loggedApiCall` or inside another `allure.step`.

Pino logs do not appear directly in the Allure report. They go to the terminal and `logs/test.log`. If you want a log line to appear in the report, use `allure.attachment` or wrap the action in `allure.step`.

---

## Controlling Log Output

### Change log level for a run

```bash
LOG_LEVEL=warn npm run test:api
```

Useful when the full debug output is too noisy during parallel runs.

### Inspect the log file

The log file is overwritten on each run:

```bash
cat logs/test.log | npx pino-pretty
```

Or filter by context:

```bash
cat logs/test.log | grep '"context":"loginPage"' | npx pino-pretty
```

Or filter by HTTP status:

```bash
cat logs/test.log | grep '"status":40' | npx pino-pretty
```

---

## Practical Rule

- Add `createLogger` at the top of any file that would benefit from contextual log output during a run.
- Wrap meaningful UI actions in `allure.step` so they appear as named checkpoints in the report.
- Use `allure.attachment` for screenshots, JSON payloads, or any data that helps diagnose a failure.
- Do not add Pino logs and `allure.attachment` for the same content unless both outputs are useful. For HTTP clients, `loggedApiCall` already handles both.
- Keep step names short and action-oriented: `Fill login form`, `Submit order`, `Assert redirect`.

## Sources

- Pino documentation: https://getpino.io/#/
- Pino child loggers: https://getpino.io/#/docs/child-loggers
- allure-playwright: https://www.npmjs.com/package/allure-playwright
- Playwright fixtures: https://playwright.dev/docs/test-fixtures
