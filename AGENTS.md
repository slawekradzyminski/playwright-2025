# API tests
- Always run all API tests after changing them via `npm run test:api` to avoid regressions
- tested API is documented in `api-docs.json` file
- order tests by status code ascending (200, 400, 401, 403, 404, etc.)
- use `// given` (test setup), `// when` (tested action) / `// then` (assertions) pattern
- before writing automated tests for given endpoint explore that it works using `curl` 