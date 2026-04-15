# Day 2 Theory: What To Teach Beyond Tags, CI, And Tracing

## Context

Day 2 should move participants from "I can write a Playwright test" to "I can maintain a small automation project responsibly".

Tags, CI, and tracing are important, but they are not the whole Day 2 story. They are supporting tools. The main goal is to teach judgment:

- how to structure test code
- how to manage test data
- how to avoid flaky tests
- how to debug failures after the fact
- how to use AI without outsourcing understanding

## What This Branch Adds Compared To `master`

The `sciaga` branch adds educational material and a small tagging/reporting layer:

- shared test metadata in `config/testDetails.ts`
- `@api` and `@ui` tags applied at `test.describe` level
- tag-based npm scripts
- local Allure scripts
- `TAG_SUMMARY.md`
- `ALLURE_SUMMARY.md`
- README notes about running by tags

Compared to `master`, this branch also includes broader API test work that was already present before the latest commit:

- API clients
- fixtures
- data generators
- additional API specs
- DTO/type files
- environment example updates
- dependency updates

So when reviewing the diff against `master`, separate two stories:

1. Test-suite growth: more API coverage, clients, fixtures, types, generators.
2. Learning-note growth: tags, Allure workflow, local reporting habits.

## What `ci1404` Already Covers

The `ci1404` branch appears to cover the CI topic heavily:

- GitHub Actions workflow
- lightweight stack setup for CI
- Node runtime setup
- broader UI and API organization
- page objects and components
- auth helpers
- accessibility test example
- artifacts from exploratory/debugging work

Because of that, Day 2 theory here should not spend too much time re-explaining CI YAML. Instead, it should explain what must exist before CI becomes valuable:

- reliable selectors
- stable test data
- clear categories of tests
- useful artifacts
- deterministic setup
- readable failure output

## Recommended Day 2 Topics

### 1. Test Code Organization

Teach participants how to recognize when a test suite starts needing structure.

Start from a simple test:

```ts
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).not.toHaveURL('/login');
});
```

Then discuss what happens when there are 20 tests like this:

- duplicated navigation
- duplicated credentials
- repeated selectors
- hard-to-change flows
- unclear intent

Teach the transition path:

1. Extract constants only when duplication is real.
2. Extract helper functions for repeated flows.
3. Introduce page objects only when the page has enough behavior to justify them.
4. Keep assertions in tests unless moving them improves readability.

Key lesson: page objects are not mandatory architecture. They are a tool for managing repeated UI behavior.

### 2. Fixtures

Fixtures are one of the most important Playwright concepts for Day 2.

Teach them as controlled setup, not magic.

Good fixture use cases:

- create an authenticated API context
- create a test user before a test
- prepare a page in a known state
- share setup across multiple tests without hiding the test purpose

Bad fixture use cases:

- doing too much hidden setup
- making every test depend on a large global context
- hiding important preconditions from the reader

Practical example:

```ts
test('should get current user info', async ({ request, auth }) => {
  const response = await usersMeClient.getUserMe(request, auth.token);

  expect(response.status()).toBe(200);
});
```

The test remains short, but the reader still understands that authentication matters.

### 3. Test Data Strategy

Day 2 should cover how data decisions affect stability.

Teach three categories:

- static seeded data
- generated data
- data created through API setup

Static data is simple, but it can collide between tests.

Generated data avoids collisions, but it can make failures harder to reproduce if values are not logged or visible.

API setup is usually faster and more reliable than UI setup, but it must still reflect real business rules.

Recommended rule:

Use API setup for preconditions. Use UI actions for the behavior you are actually testing.

Example:

- create user through API
- login through UI
- assert browser-visible behavior

### 4. Selector Strategy

Selectors are a stability topic, not only a syntax topic.

Teach selector priority:

1. `getByRole`
2. `getByLabel`
3. `getByText` when text is stable and user-facing
4. `getByTestId` for elements that need explicit automation hooks
5. CSS/XPath only when there is no better option

Explain the tradeoff:

- role and label selectors test accessibility and user semantics
- test ids are stable, but they can hide accessibility problems
- CSS selectors often couple tests to implementation details

Practical exercise:

Give participants a brittle selector and ask them to rewrite it:

```ts
page.locator('.btn-primary:nth-child(2)')
```

Into something user-oriented:

```ts
page.getByRole('button', { name: 'Sign in' })
```

### 5. Flakiness

Do not treat flakiness as a random Playwright problem. Teach it as a symptom.

Common causes:

- missing assertions
- racing against network or UI updates
- relying on fixed sleeps
- test data collisions
- shared state between tests
- unstable selectors
- environment not ready

Teach what not to do:

```ts
await page.waitForTimeout(3000);
```

Teach what to do instead:

```ts
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
```

Key lesson:

Wait for a meaningful condition, not for time to pass.

### 6. API Testing Inside A UI Automation Course

API tests are useful even in a UI-focused Playwright course.

They help with:

- faster feedback
- setup and teardown
- validating contracts
- debugging whether a bug is frontend or backend

Teach a split:

- API tests validate service behavior directly.
- UI tests validate user workflows.
- API helpers can prepare UI tests.

Avoid turning every UI scenario into an API scenario. The test should match the risk.

### 7. Reporting And Artifacts

Tracing is one artifact, not the whole reporting strategy.

Teach what each artifact answers:

- trace: what happened in the browser and Playwright actions
- screenshot: what the user saw at a point in time
- video: how the visible state changed over time
- console logs: frontend errors and warnings
- network logs: request and response clues
- Allure report: readable summary for humans
- Playwright HTML report: fast local debugging

Recommended artifact policy:

- collect trace on first retry locally and in CI
- collect screenshots on failure
- collect video only when it helps or during debugging
- publish reports as CI artifacts
- clean local Allure results when you want one clear run

### 8. Smoke Versus Regression

Tags are the mechanism. Test selection strategy is the lesson.

Smoke tests:

- small
- fast
- cover critical confidence paths
- run on every pull request

Regression tests:

- broader
- slower
- cover edge cases and business rules
- may run on schedule or before release

Example:

```ts
test('should login with valid credentials', { tag: ['@ui', '@smoke'] }, async ({ page }) => {
  // ...
});
```

Discuss what makes a test worthy of `@smoke`:

- if it fails, would we stop the release?
- is it stable enough to block a pull request?
- does it cover a real critical path?

### 9. AI As An Accelerator

AI should support the tester's judgment, not replace it.

Good uses:

- generate first draft of a test
- suggest selectors
- explain a trace
- propose refactoring
- create checklist for review
- summarize failures
- compare API docs with tests

Bad uses:

- accepting generated assertions without understanding them
- allowing AI to invent selectors
- adding arbitrary waits
- merging code that was never run
- trusting tests that pass for the wrong reason

Practical AI workflow:

1. Ask AI for a draft.
2. Read the draft like a reviewer.
3. Run the test.
4. Inspect selectors.
5. Remove unnecessary abstraction.
6. Keep the smallest reliable version.

### 10. Review Checklist For Automated Tests

Give participants a checklist they can use immediately:

- Does the test name describe business behavior?
- Is the setup clear?
- Is the assertion meaningful?
- Are selectors user-oriented?
- Is there any fixed wait?
- Is test data isolated?
- Can the test run independently?
- Would the failure message help me debug?
- Is this UI test really a UI risk?
- Should this test be `@smoke`, `@regression`, or neither?

## Suggested Day 2 Workshop Flow

### Block 1: Refactor A Simple Test Suite

Start with duplicated login/register tests.

Refactor in small steps:

1. constants
2. helper function
3. fixture
4. optional page object

Goal: teach why structure emerges from pain, not from fashion.

### Block 2: Add Test Data Generation

Create users or products with generated data.

Discuss:

- uniqueness
- readability
- reproducibility
- cleanup

Goal: make tests independent.

### Block 3: Add Tags And Selection Strategy

Add:

- `@api`
- `@ui`
- `@smoke`
- `@regression`

Run:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @api
npx playwright test --grep-invert @ui
```

Goal: connect tags to execution decisions.

### Block 4: Debug A Failure

Introduce a controlled failure.

Use:

- terminal output
- trace
- screenshot
- Allure report

Goal: teach a repeatable debugging process.

### Block 5: Prepare For CI

Do not spend too much time writing YAML if `ci1404` already covers it.

Instead, ask:

- what should run on pull requests?
- what should run nightly?
- what artifacts should be uploaded?
- what secrets or environment variables are needed?
- what makes a failure actionable?

Goal: make CI a consequence of good local test design.

## What To Add Next In This Repository

Recommended next additions:

1. Add `@smoke` to one or two critical UI/API tests.
2. Add `@regression` to broader validation scenarios.
3. Add `SMOKE_REGRESSION_SUMMARY.md` with selection rules.
4. Add one intentionally documented flaky-test example and its fixed version.
5. Add a short `TEST_REVIEW_CHECKLIST.md`.
6. Add an example of API setup for a UI test.
7. Add a report/artifact policy section to README.

## Practical Teaching Position

Day 2 is not "more Playwright methods".

Day 2 is where participants learn how test automation fails in real projects:

- unclear ownership
- unstable data
- too much abstraction
- weak assertions
- noisy CI
- unreadable reports
- blind trust in generated code

The course should teach them to prevent those problems early.

