# Playwright Tags Summary

## What Tags Are

Playwright tags are metadata attached to tests or suites. They are most useful when you want to run tests by logical category instead of by file path.

In this project, tags are defined once in `config/testDetails.ts`:

```ts
export const API_TEST_DETAILS = {
  tag: '@api',
  annotation: {
    type: 'description',
    description: 'API tests validate HTTP contracts, auth rules, status codes, and response payloads.',
  },
};

export const UI_TEST_DETAILS = {
  tag: '@ui',
  annotation: {
    type: 'description',
    description: 'UI tests validate browser workflows, page navigation, form behavior, and visible user outcomes.',
  },
};
```

Then the metadata is applied at the suite level:

```ts
test.describe('Login UI tests', UI_TEST_DETAILS, () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    // ...
  });
});
```

Every test inside that `test.describe` inherits the tag.

## How To Run Tagged Tests

Run API tests:

```bash
npm run test:api
```

This is equivalent to:

```bash
npx playwright test --grep @api
```

Run UI tests:

```bash
npm run test:ui
```

This is equivalent to:

```bash
npx playwright test --grep @ui
```

Exclude a tag:

```bash
npx playwright test --grep-invert @ui
```

Preview which tests match a tag without running them:

```bash
npx playwright test --grep @api --list
npx playwright test --grep @ui --list
```

## Tags Versus Folders

Folder filtering is physical:

```bash
npx playwright test tests/api
```

Tag filtering is logical:

```bash
npx playwright test --grep @api
```

Folders answer: "Where is this test stored?"

Tags answer: "What kind of test is this?"

Use folder filters when your test organization is simple and stable. Use tags when you need categories that can cut across folders, such as:

- `@api`
- `@ui`
- `@smoke`
- `@regression`
- `@auth`
- `@critical`
- `@slow`

## Why Suite-Level Tags Are Useful

Adding the tag to `test.describe` keeps the individual tests clean. Instead of repeating this on every test:

```ts
test('should save product', { tag: '@api' }, async ({ request }) => {
  // ...
});
```

The suite can declare the category once:

```ts
test.describe('/api/v1/products API tests', API_TEST_DETAILS, () => {
  test('should create product', async ({ request }) => {
    // ...
  });
});
```

This is better when the whole file or suite belongs to the same category.

## Where The Description Appears

The tag is used by Playwright filtering.

The `annotation.description` is reporter metadata. It does not normally appear in the terminal output. In this project, it is most visible in Allure because `allure-playwright` maps an annotation with `type: 'description'` to the test description in the Allure report.

If nobody reads reports, tags alone are often enough. If reports are part of the workflow, descriptions help explain the purpose of each test group.

## Practical Rule

Use tags for execution strategy. Use descriptions for human-readable reporting.

