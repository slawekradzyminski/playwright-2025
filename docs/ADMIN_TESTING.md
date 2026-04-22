# Admin Testing

Admin tests mutate shared backend state, so they live in dedicated projects:

- API admin specs: `tests/api/admin/**/*.admin.api.spec.ts`
- UI admin specs: `tests/ui/admin/**/*.admin.ui.spec.ts`

The default `npx playwright test` run executes the regular `chromium` project first. After it passes, `admin-api` runs with `workers: 1`, and then `admin-ui` runs with `workers: 1`. This keeps regular client tests parallel and admin tests sequential against the shared local stack.

Use `playwright.admin.config.ts` when you want to run only the admin lane.

## Commands

- `npm run test:api:admin` runs only admin API tests.
- `npm run test:ui:admin` runs only admin UI tests.
- `npm test` or `npx playwright test` runs regular tests first, then admin tests.
- `npm run test:admin` runs only the full admin lane.
- `npm run test:api:all` runs regular API tests first, then admin API tests.
- `npm run test:ui:all` runs regular UI tests first, then admin UI tests.
- `npm run test:all` runs regular API and UI suites first, then the admin lane.

## Data Rules

Every admin test must create and mutate only generated self-owned data. Product tests should use `randomAdminProduct()` or `randomAdminProductUpdate()` and names with the stable `admin-test-product` prefix.

Cleanup is centralized in `adminApiFixture` and `adminUiFixture`. Track created product ids and unique names through the fixture helpers, or use `createAdminProduct()` so tracking happens automatically. Cleanup deletes tracked ids directly, resolves tracked names through `GET /api/v1/products`, and accepts `204` or `404` while deleting.
