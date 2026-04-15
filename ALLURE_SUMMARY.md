# Allure Local Workflow Summary

## What Allure Produces

Allure has two important directories:

```text
allure-results/
allure-report/
```

`allure-results` contains raw result files written by the `allure-playwright` reporter during a Playwright test run.

`allure-report` contains the generated static HTML report.

Playwright creates or updates `allure-results`. It does not automatically rebuild `allure-report`.

## Why Old Reports Can Appear

If you run tests and then open an existing `allure-report`, you may be looking at stale generated HTML.

The flow is:

```text
Playwright test run -> allure-results -> generate report -> allure-report
```

If the middle step changes but the final generated report is not rebuilt, the browser still shows the old report.

There is another local gotcha: if old files remain in `allure-results`, the next generated report can include data from previous runs. This can make it look like tests were duplicated or old results are still current.

## Local Scripts

This project now has these scripts:

```json
{
  "allure:clean": "rm -rf allure-results allure-report",
  "allure:generate": "allure generate allure-results --output allure-report",
  "allure:open": "allure open allure-report",
  "allure:serve": "allure serve allure-results"
}
```

## Recommended Day-To-Day Flow

For local debugging, use `allure:serve`:

```bash
npm run allure:clean
npm run test:ui
npm run allure:serve
```

Or for API tests:

```bash
npm run allure:clean
npm run test:api
npm run allure:serve
```

`allure:serve` builds a temporary report and opens it in the browser. It is convenient because you do not have to manage the generated `allure-report` folder manually.

## Flow For A Persistent Report

Use this when you want a report directory that can be archived, inspected later, or uploaded by CI:

```bash
npm run allure:clean
npm run test:ui
npm run allure:generate
npm run allure:open
```

What happens:

```bash
npm run allure:clean
```

Deletes old raw results and old generated HTML.

```bash
npm run test:ui
```

Runs tests and writes fresh raw result files into `allure-results`.

```bash
npm run allure:generate
```

Builds a fresh static HTML report in `allure-report`.

```bash
npm run allure:open
```

Serves the generated `allure-report` directory locally.

## Why Cleaning Happens Before Generation

Allure v3 generation is handled by this script:

```bash
allure generate allure-results --output allure-report
```

The script does not clean old input or output by itself.

That is why the reliable local workflow starts by deleting both old raw results and old generated HTML:

```bash
npm run allure:clean
```

## How Tags And Descriptions Appear In Allure

The project uses Playwright metadata:

```ts
{
  tag: '@ui',
  annotation: {
    type: 'description',
    description: 'UI tests validate browser workflows, page navigation, form behavior, and visible user outcomes.',
  },
}
```

The tag is used for running tests with `--grep`.

The description is report metadata. In Allure, `allure-playwright` treats an annotation with `type: 'description'` as the test description.

## Practical Rule

For local work:

```bash
npm run allure:clean
npm run test:ui
npm run allure:serve
```

For a report artifact:

```bash
npm run allure:clean
npm run test:ui
npm run allure:generate
```

Clean before the run when you want one clear report for one clear execution.
