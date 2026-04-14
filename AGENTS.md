# General rules
- use `// given` (test setup), `// when` (tested action) / `// then` (assertions) pattern
- API is documented in `api-docs.json` file

# API tests
- Always run all API tests after changing them via `npm run test:api` to avoid regressions
- order tests by status code ascending (200, 400, 401, 403, 404, etc.)
- before writing automated tests for given endpoint explore that it works using `curl`
- one spec file per distinct endpoint (method + path), e.g. `get-products.api.spec.ts`, `post-cart-items.api.spec.ts`
- group spec files by resource area in subfolders under `tests/api/`, e.g. `users/`, `products/`, `cart/` 
- admin API tests should use `tests/api/fixtures/adminAuthFixture.ts`; the seeded admin account is a shared actor, not shared mutable test data
- admin tests may run in parallel only when they are read-only or when each test creates and cleans up its own users/products/orders
- tests that mutate shared seeded data or depend on ordered state transitions must include `test.describe.configure({ mode: 'serial' })` and an `@serial-admin` tag in the describe title
- never mutate or delete seeded users/products/orders such as `admin`, `client`, `client2`, or `client3`
- never assert exact global counts from admin list endpoints while tests run in parallel; assert response shape or filter for test-owned data

# UI tests
- use page object model
- Always run all UI tests after changing them via `npm run test:ui` to avoid regressions