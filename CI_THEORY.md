# CI Theory For Playwright Tests

## What CI Is For

Continuous Integration is not just "running tests on GitHub".

For Playwright projects, CI should answer one question quickly:

> Can this change be trusted enough to continue?

That requires more than a YAML file. A useful CI setup needs:

- deterministic environment setup
- clear test selection
- reliable test data
- useful artifacts
- readable failure output
- a policy for what blocks a pull request

This repository now has a concrete GitHub Actions example in `.github/workflows/ci.yml`. This file explains the theory behind that workflow and how to read it.

## This Repository's CI Example

The workflow is intentionally small, but it demonstrates the most important CI ideas for Playwright:

```yaml
name: CI

on:
  push:
  pull_request:
```

The workflow runs on every push and pull request. That makes it useful both for branch feedback and pull request review.

It uses one job with a matrix:

```yaml
strategy:
  fail-fast: false
  matrix:
    suite: [api, ui]
```

That creates two independent executions:

- `Playwright api tests`
- `Playwright ui tests`

`fail-fast: false` is important. If UI tests fail, API tests can still finish and upload artifacts. If API tests fail, UI tests can still provide browser-level feedback.

The matrix maps each suite to the matching npm script:

```yaml
- suite: api
  command: npm run test:api -- --reporter=list,html,allure-playwright
- suite: ui
  command: npm run test:ui -- --reporter=list,html,allure-playwright
```

The project scripts are tag-based:

```json
{
  "test:api": "playwright test --grep @api",
  "test:ui": "playwright test --grep @ui"
}
```

So CI is not tied to folders. CI runs the logical categories declared by Playwright tags.

## Application Stack In CI

The workflow checks out two repositories:

1. this test repository
2. `slawekradzyminski/awesome-localstack`

Then it starts the lightweight Docker Compose stack:

```yaml
docker compose -f lightweight-docker-compose.yml up -d
```

The workflow waits for real URLs:

```text
http://localhost:8081/swagger-ui/index.html
http://localhost:8081/login
http://localhost:8081/images/iphone.png
```

This is better than sleeping for a fixed number of seconds. Readiness checks prove that the app is responding before tests start.

The test environment is explicit:

```yaml
APP_BASE_URL: http://localhost:8081
ADMIN_USERNAME: admin
ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD || 'admin123' }}
PLAYWRIGHT_HTML_OPEN: never
CI: true
```

`CI: true` activates CI behavior from `playwright.config.ts`, such as retries and single-worker execution.

## Artifacts In This Workflow

The workflow uploads many artifacts deliberately:

- `playwright-report-api`
- `playwright-report-ui`
- `playwright-test-results-api`
- `playwright-test-results-ui`
- `playwright-traces-api`
- `playwright-traces-ui`
- `playwright-screenshots-api`
- `playwright-screenshots-ui`
- `playwright-videos-api`
- `playwright-videos-ui`
- `allure-results-api`
- `allure-results-ui`
- `allure-report-api`
- `allure-report-ui`
- `application-stack-diagnostics-api`
- `application-stack-diagnostics-ui`

This is intentionally generous for training. In a mature project, artifact retention and volume can be reduced once the team knows which artifacts they actually use.

Allure is available in two ways in this repository. First, each matrix job uploads its own downloadable CI artifact:

```text
allure-report-api
allure-report-ui
```

Second, the `deploy-allure-report` job downloads the API and UI raw results, generates one combined Allure report, and deploys it to GitHub Pages:

```text
https://slawekradzyminski.github.io/playwright-2025/
```

This is intentionally done in a separate job after the matrix finishes. Deploying from each matrix job would be risky because the API and UI jobs could overwrite each other.

Each artifact answers a different debugging question:

- Playwright HTML report: which test failed and where?
- trace zip: what did Playwright see and do?
- screenshot: what did the user see at failure time?
- video: how did the page state change before the failure?
- Allure report: readable high-level test report
- Allure raw results: input for report generation or history
- Docker diagnostics: was the app stack healthy?

## Failure Artifact Policy In This Project

The Playwright config keeps expensive artifacts only when useful:

```ts
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

Meaning:

- traces are collected on the first retry
- screenshots are saved only for failing tests
- videos are retained only for failing tests

This keeps normal successful runs lighter, but still gives enough evidence for debugging failures.

## Local First, CI Second

CI should not be the first place where a test becomes understandable.

Before a test is useful in CI, it should be possible to run and debug it locally:

```bash
npm test
npm run test:api
npm run test:ui
npx playwright test --grep @smoke
```

If a test is hard to run locally, it will be painful in CI.

Good local workflow:

1. Start app stack.
2. Run focused test locally.
3. Inspect trace/report if it fails.
4. Make the test stable.
5. Add it to CI selection.

CI is the enforcement layer, not the debugging strategy.

## What Should Run On Pull Requests

Pull request checks should be fast and trustworthy.

Good PR candidates:

- smoke tests
- critical login/auth flow
- basic API contract checks
- tests for changed area
- lint/typecheck if configured

Bad PR candidates:

- very slow full regression suite
- known flaky tests
- tests depending on external unstable systems
- huge browser matrix before the suite is stable

Recommended first PR command:

```bash
npx playwright test --grep @smoke
```

If there are no `@smoke` tags yet, a reasonable intermediate step is:

```bash
npm run test:api
npm run test:ui
```

But long term, `@smoke` should mean "small set of tests that can block a PR".

## What Should Run Nightly

Nightly or scheduled jobs can be broader.

Good nightly candidates:

- full regression suite
- slower UI scenarios
- cross-browser matrix
- mobile viewport checks
- more expensive API coverage
- accessibility checks
- reporting/history generation

Example strategy:

```bash
npx playwright test --grep @regression
```

Or:

```bash
npx playwright test
```

Nightly failures should still be investigated. If nobody reads nightly results, they become noise.

## Test Categories In CI

Useful tags:

- `@smoke`: minimal confidence set, blocks PRs
- `@regression`: broader coverage, may run nightly
- `@api`: service/API layer
- `@ui`: browser workflows
- `@auth`: authentication domain
- `@critical`: high-risk business path
- `@slow`: excluded from fast PR jobs unless needed

Examples:

```ts
test('should login with valid credentials', { tag: ['@ui', '@smoke', '@auth'] }, async ({ page }) => {
  // ...
});
```

```ts
test('should reject invalid token', { tag: ['@api', '@regression', '@auth'] }, async ({ request }) => {
  // ...
});
```

The tag itself is not the lesson. The lesson is deciding which tests are safe and valuable enough to run in each pipeline.

## CI Environment Setup

Playwright CI needs the same assumptions as local tests, but explicit.

Typical setup:

1. Check out repository.
2. Install Node.
3. Install dependencies with `npm ci`.
4. Install Playwright browsers.
5. Start application stack.
6. Wait until the app is ready.
7. Run tests.
8. Upload reports and artifacts.

Example commands:

```bash
npm ci
npx playwright install --with-deps chromium
npm run test:api
npm run test:ui
```

If the app is Dockerized, CI also needs:

```bash
docker compose up -d
```

And a readiness check.

Do not rely on "sleep 30" as the primary readiness mechanism. Prefer checking the app URL or health endpoint.

## Environment Variables

Tests should not hardcode environment-specific values.

Common variables:

```bash
APP_BASE_URL=http://localhost:8081
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
CI=true
```

Rules:

- commit `.env.example`
- do not commit real secrets
- use GitHub Actions secrets for sensitive values
- document required variables
- fail clearly when a required variable is missing

In local development, `.env` is convenient.

In CI, explicit workflow variables and secrets are better.

## Test Data In CI

CI runs are repeatable only if test data is controlled.

Risky patterns:

- relying on one shared user changed by multiple tests
- tests that depend on execution order
- tests that leave dirty state
- tests that reuse fixed product names or emails

Safer patterns:

- generate unique users
- create data through API setup
- isolate each test
- clean up after test when practical
- reset the environment before the run

The fixture pattern in this repository is a good direction:

```ts
auth: async ({ request }, use) => {
  const user = generateUser();
  await registerClient.postRegister(request, user);
  const token = await loginAndReturnToken(request, user);

  await use({ user, token });

  // cleanup can happen here
}
```

CI rewards tests that are independent.

## Retries

Retries are useful in CI, but they should not hide poor tests.

This project uses:

```ts
retries: process.env.CI ? 2 : 0,
```

That means:

- local runs fail fast
- CI retries failures up to two times

Good use of retries:

- tolerate rare infrastructure timing issues
- collect trace on retry
- reduce one-off false negatives

Bad use of retries:

- masking flaky selectors
- hiding shared data collisions
- accepting tests that fail every other run

If a test needs retries to pass regularly, fix the test.

## Workers And Parallelism

This project uses:

```ts
workers: process.env.CI ? 1 : undefined,
```

That means:

- local runs can use default parallelism
- CI runs use one worker

This is conservative and good for training because it reduces data collisions and ordering surprises.

Later, when tests are isolated, CI can increase workers for speed.

Before increasing workers, check:

- do tests share users?
- do tests share products?
- do tests mutate global settings?
- do tests depend on sequence?
- can generated data collide?

Parallelism exposes bad isolation.

## Artifacts In CI

If CI fails and provides no useful artifacts, people will rerun blindly.

Useful artifacts:

- Playwright HTML report
- trace files
- screenshots
- videos for selected failures
- Allure results/report
- console/network logs if collected

Recommended policy:

- trace: `on-first-retry` or `retain-on-failure`
- screenshot: `only-on-failure`
- video: `retain-on-failure` when useful
- upload report even when tests fail

Example Playwright config:

```ts
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
```

Artifacts should help answer:

- what failed?
- where did it fail?
- what did the user see?
- what did the browser console say?
- what network calls happened?

## Allure In CI

Allure has two layers:

- `allure-results`: raw results from the test run
- `allure-report`: generated HTML report

In CI, a typical flow is:

```bash
npm run allure:clean
npm test
npm run allure:generate
```

Then upload:

- `allure-results`
- `allure-report`
- Playwright report if used

For local debugging, `allure:serve` is convenient. For CI artifacts and Pages deployment, `allure:generate` is better.

The Pages deployment in this workflow:

1. waits for API and UI jobs
2. downloads both `allure-results-*` artifacts
3. generates one combined `allure-report`
4. uploads a Pages artifact
5. deploys it to the `github-pages` environment

Do not deploy one matrix job directly to Pages, because the second matrix job can overwrite the first one.

## What Should Block A Pull Request

A failing test should block a PR only if the team trusts that failure.

Good blocking checks:

- stable smoke tests
- basic API health/contract tests
- critical login or checkout path
- typecheck/lint if present

Bad blocking checks:

- known flaky tests
- slow exploratory tests
- tests with unclear ownership
- tests nobody can debug from artifacts

If a CI check blocks merging, it must be maintained like production code.

## Debugging A CI Failure

Use this order:

1. Read the failing test name.
2. Read the exact assertion error.
3. Download/open the trace.
4. Check screenshot or video.
5. Inspect console and network in trace.
6. Compare with local run.
7. Identify category: app bug, test bug, data bug, environment bug.
8. Fix the root cause.

Avoid:

- rerunning until green without investigation
- increasing timeouts first
- adding `waitForTimeout`
- marking flaky tests as acceptable without owner/date/context

## CI Anti-Patterns

### Anti-Pattern 1: Full Suite Too Early

Running everything on every PR sounds rigorous, but early suites are often unstable.

Better:

- start with smoke
- fix isolation
- add regression gradually
- move broad checks to nightly until stable

### Anti-Pattern 2: No Artifacts

If CI says "failed" but gives no trace, screenshot, or report, developers waste time reproducing.

Better:

- always upload reports on failure
- keep traces for failing tests
- make artifact links visible

### Anti-Pattern 3: Secret Local Assumptions

Tests pass locally because someone has a `.env` file, seeded database, or running service.

Better:

- document environment requirements
- commit `.env.example`
- make CI setup explicit
- add readiness checks

### Anti-Pattern 4: Flaky Tests As Normal

Flaky tests train people to ignore CI.

Better:

- quarantine only with clear owner and deadline
- keep flaky tests out of PR-blocking smoke
- fix selectors/data/setup
- track repeat offenders

## Minimal CI Teaching Flow

For a training session, teach CI in this order:

1. Run a test locally.
2. Add a tag that decides when it should run.
3. Run the same command locally with `--grep`.
4. Put that exact command in CI.
5. Add artifacts.
6. Break a test intentionally.
7. Open the CI artifact and debug the failure.
8. Fix the failure and rerun.

This makes CI concrete. Participants see that CI is just the same command in a clean machine with better discipline.

## Recommended CI Jobs

### Pull Request Job

Purpose: fast confidence.

Run:

```bash
npx playwright test --grep @smoke
```

Artifacts:

- HTML report
- traces for failures

### API Job

Purpose: fast backend contract feedback.

Run:

```bash
npm run test:api
```

Artifacts:

- Allure results/report

### UI Job

Purpose: browser workflow confidence.

Run:

```bash
npm run test:ui
```

Artifacts:

- Playwright HTML report
- traces
- screenshots on failure

### Nightly Regression Job

Purpose: broad coverage.

Run:

```bash
npx playwright test
```

Artifacts:

- full report
- trace/screenshot/video for failures
- Allure report

## Practical Rule

CI is not where test quality appears. CI reveals whether test quality is already there.

Before adding more CI complexity, make sure tests are:

- independently runnable
- tagged intentionally
- using stable data
- using reliable selectors
- producing useful artifacts
- easy to debug locally
