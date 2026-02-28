For API tests:
- always add npm run lint and npm run typecheck to ensure code quality
- always run full api test suite via npm run test:api
- you can use curl to test endpoints manually
- api docs are in api-docs.json
- track work status in api-test-plan.md
- for tests requiring auth use dedicated fixture
- order tests by status code ascending (200 -> 202 -> 400 -> 401 -> 403, etc.)
