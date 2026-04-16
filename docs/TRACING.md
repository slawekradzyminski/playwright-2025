# Playwright Tracing

## What A Trace Is

A Playwright trace is a recorded debugging package for a test run.

It can include:

- Playwright actions
- DOM snapshots
- screenshots
- network activity
- console messages
- source locations
- test attachments

The trace is usually saved as a `trace.zip` file and opened with Playwright Trace Viewer.

## Why Traces Matter

Terminal output usually tells you what failed.

A trace helps explain why it failed.

Use traces to answer:

- What did Playwright click?
- Was the element visible?
- What was the DOM at that moment?
- What network calls happened?
- Did the page show an error?
- Did the app navigate?
- Was the assertion too early?
- Did the test use the wrong selector?

## Current Project Configuration

This project has tracing configured in `playwright.config.ts`:

```ts
use: {
  trace: 'on-first-retry',
},
```

That means:

- Playwright does not record traces for every successful first attempt.
- If a test fails and is retried, Playwright records a trace for the first retry.
- This is a good CI/default setting because always-on tracing is heavier.

The official docs recommend `trace: 'on-first-retry'` for CI.

## Trace Modes

Useful modes:

```ts
trace: 'off'
```

No trace.

```ts
trace: 'on'
```

Trace every test. Good for a local demo, but not recommended as a permanent default because it is heavier.

```ts
trace: 'on-first-retry'
```

Trace the first retry. Good default for CI when retries are enabled.

```ts
trace: 'retain-on-failure'
```

Record traces, but keep them only for failed tests. Useful if you do not use retries.

## Fast Local Demo

Run one UI test with tracing enabled:

```bash
npx playwright test tests/ui/login.ui.spec.ts --trace on
```

Then open the Playwright HTML report:

```bash
npx playwright show-report
```

In the report, open the test and click the trace icon.

## Reusable NPM Commands

This project has helper scripts for local trace demos:

```bash
npm run trace:clean
npm run trace:test -- tests/ui/login.ui.spec.ts -g "should navigate to register page when register button is clicked"
npm run trace:open
```

What they do:

```bash
npm run trace:clean
```

Removes old Playwright output so the demo is easier to follow.

```bash
npm run trace:test -- tests/ui/login.ui.spec.ts -g "should navigate to register page when register button is clicked"
```

Runs the selected test with `--trace on`.

The `--` after `trace:test` is important. It forwards the rest of the arguments to Playwright.

```bash
npm run trace:open
```

Finds the newest `trace.zip` under `test-results` and opens it with Playwright Trace Viewer.

You can pass any normal Playwright selection:

```bash
npm run trace:test -- --grep @ui
npm run trace:test -- tests/ui/login.ui.spec.ts
npm run trace:test -- tests/ui/login.ui.spec.ts -g "should successfully login"
npm run trace:test -- --project chromium --grep @api
```

After each run:

```bash
npm run trace:open
```

## Demo With A Specific Test Name

Run only the login success test:

```bash
npx playwright test tests/ui/login.ui.spec.ts -g "should successfully login" --trace on
```

Open the report:

```bash
npx playwright show-report
```

## Demo With Tags

Run all UI tests and record traces:

```bash
npx playwright test --grep @ui --trace on
```

Run all API tests and record traces:

```bash
npx playwright test --grep @api --trace on
```

API tests can also produce traces, but traces are most visually useful for browser UI tests.

## Opening A Trace Zip Directly

If you have a trace file path:

```bash
npx playwright show-trace path/to/trace.zip
```

Example:

```bash
npx playwright show-trace test-results/tests-ui-login-ui-should-successfully-login-chromium/trace.zip
```

The exact path depends on the test name and output directory.

You can find trace files with:

```bash
find test-results -name trace.zip
```

Then open the first one:

```bash
npx playwright show-trace "$(find test-results -name trace.zip | head -n 1)"
```

## Trace Viewer Areas

When Trace Viewer opens, inspect these areas:

### Actions

Shows each Playwright action:

- `page.goto`
- `locator.fill`
- `locator.click`
- `expect(...)`

Use this to see where the test failed and what Playwright was trying to do.

### Timeline

Shows snapshots over time.

Use this to understand whether the page was still loading, navigating, or changing when the failure happened.

### DOM Snapshot

Shows what the page looked like at a specific action.

Use this to inspect:

- visible text
- element state
- accessible UI structure
- whether the selector matched the intended element

### Network

Shows requests made by the page.

Use this to answer:

- Did login request happen?
- Did API return 401, 403, 500?
- Did the frontend wait for the right response?
- Did a backend call fail before the assertion?

### Console

Shows browser console messages.

Use this to catch:

- frontend exceptions
- failed resource loads
- warnings that explain missing UI state

## How To Debug With A Trace

Use this order:

1. Start at the failed action.
2. Check the action error message.
3. Look at the DOM snapshot before the failure.
4. Check whether the locator matched the right element.
5. Inspect network calls around the failure.
6. Inspect console errors.
7. Decide whether the problem is test code, app behavior, data, or environment.

Do not start by changing timeouts.

## Common Trace Findings

### Wrong Selector

Symptom:

- click fails
- strict mode violation
- Playwright clicked a different element than expected

Fix:

- use `getByRole` with a clear name
- scope the locator to a region
- use `filter({ hasText })` or `filter({ has })`

### Missing Wait Condition

Symptom:

- assertion runs before UI update
- network call is still pending

Fix:

```ts
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
```

Do not fix with:

```ts
await page.waitForTimeout(3000);
```

### Bad Test Data

Symptom:

- UI shows validation error
- API returns duplicate or unauthorized error
- expected state never appears

Fix:

- generate unique data
- create preconditions through API
- log relevant generated values

### Environment Not Ready

Symptom:

- `page.goto` fails
- network calls fail with connection errors
- login page does not load

Fix:

- verify local stack is running
- check `APP_BASE_URL`
- check seed data and credentials

## Suggested Live Demo

### Demo 1: Successful Trace

Run:

```bash
npx playwright test tests/ui/login.ui.spec.ts -g "should navigate to register page when register button is clicked" --trace on
npx playwright show-report
```

Show:

- action list
- click action
- before/after DOM snapshots
- navigation to `/register`

### Demo 2: Failure Trace

Temporarily change an expectation in a local working copy, for example expect the wrong URL:

```ts
await expect(page).toHaveURL(`${APP_BASE_URL}/wrong-page`);
```

Run:

```bash
npx playwright test tests/ui/login.ui.spec.ts -g "should navigate to register page when register button is clicked" --trace on
npx playwright show-report
```

Show:

- the click happened
- the app navigated correctly
- the assertion was wrong

Then revert the temporary change.

### Demo 3: Open Trace Zip Directly

Run:

```bash
find test-results -name trace.zip
npx playwright show-trace "$(find test-results -name trace.zip | head -n 1)"
```

This shows that a trace is just an artifact file that can be opened later.

## Console Commands For Your Demo

Use these commands live:

```bash
# Clean old test output for a clearer demo.
rm -rf test-results playwright-report

# Run one UI test with trace recording forced on.
npx playwright test tests/ui/login.ui.spec.ts -g "should navigate to register page when register button is clicked" --trace on

# Open Playwright HTML report.
npx playwright show-report

# List trace files created by the run.
find test-results -name trace.zip

# Open first trace directly.
npx playwright show-trace "$(find test-results -name trace.zip | head -n 1)"
```

If the local app is not running, start the application stack first. The tests expect:

```text
http://localhost:8081
```

You can override it:

```bash
APP_BASE_URL=http://localhost:8081 npx playwright test tests/ui/login.ui.spec.ts --trace on
```

## Practical Rule

Use `--trace on` for local demonstrations and focused debugging.

Use `trace: 'on-first-retry'` or `trace: 'retain-on-failure'` for regular project configuration.

Do not keep `trace: 'on'` as the default for the whole suite unless you deliberately accept the storage and performance cost.

## Sources

- Playwright Trace Viewer documentation: https://playwright.dev/docs/trace-viewer
- Playwright trace option documentation: https://playwright.dev/docs/api/class-testoptions#test-options-trace
