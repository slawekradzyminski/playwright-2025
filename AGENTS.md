## General
- use English
- read `ARCHITECTURE.md` for the lightweight SUT topology, gateway routing, and human/AI testing workflow

## API test rules
- follow the patterns from `login.api.spec.ts` and `loginClient.ts` - http clients in separate folder
- initialize HTTP clients in `test.beforeEach` instead of inside individual tests
- use given (test setup), when (tested action), then (assertions)
- order tests by status code ascending (200 -> 400 -> 401 -> 403 -> ...)
- always run newly created tests to make sure they work and then full api test suite via `npm run test:api`
- you can explore how given endpoint work by reading `api-docs.json` and using curl command
- each endpoint should be in a separate file (so one file for GET, one for PUT, etc.)
- you can read server-side logs using `CLI_TRAFFIC_LOGS_UTILITY.md`
- backend code is available in ../test-secure-backend
- apply DRY rule, always try to extract common code to shared helpers, utilities, etc.
