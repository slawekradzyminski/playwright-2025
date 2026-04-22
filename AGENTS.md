## General
- use English
- read `docs/ARCHITECTURE.md` for the lightweight SUT topology, gateway routing, and human/AI testing workflow
- use given (test setup), when (tested action), then (assertions)
- you can read server-side logs using `docs/CLI_TRAFFIC_LOGS_UTILITY.md`
- backend code is available in ../test-secure-backend
- apply DRY rule, always try to extract common code to shared helpers, utilities, etc.
- run static code analysis with autofix using `npm run check:fix` and fix any remaining issues before finishing work

## UI test rules
- follow the patterns from `login.ui.spec.ts`, `loginPage.ts`, `toastComponent.ts`. Use page object model
- initialize tested page object in `test.beforeEach`
- always run newly created tests to make sure they work and then full ui test suite via `npm run test:ui`
- explore how given page looks like using `playwright-cli` and Playwright CLI Skill available in repository
- each screen should have tests in a separate file
- prefer `data-testid` selectors if present

## API test rules
- follow the patterns from `login.api.spec.ts` and `loginClient.ts` - http clients in separate folder
- initialize HTTP clients in `test.beforeEach` instead of inside individual tests
- order tests by status code ascending (200 -> 400 -> 401 -> 403 -> ...)
- always run newly created tests to make sure they work and then full api test suite via `npm run test:api`
- explore how given endpoint work by reading `api-docs.json` and using curl command
- each endpoint should be in a separate file (so one file for GET, one for PUT, etc.)

## Admin test rules (API and UI)
- admin tests mutate shared data; keep them in `tests/api/admin` or `tests/ui/admin` and use generated self-owned data only
- use admin fixtures for auth and cleanup; created test entities must be tracked or created through fixture helpers
- admin suites run sequentially after regular tests by default; for admin-only checks use `npm run test:api:admin`, `npm run test:ui:admin`, or `npm run test:admin`
- see `docs/ADMIN_TESTING.md` for details
