For all tests:
- always add npm run lint and npm run typecheck to ensure code quality
- for tests requiring auth use dedicated fixture
- use /generators folder for test data generation

For API tests:
- you can use curl to test endpoints manually
- always run full api test suite via npm run test:api
- api docs are in api-docs.json
- track work status in api-test-plan.md
- order tests by status code ascending (200 -> 202 -> 400 -> 401 -> 403, etc.)

For UI tests:
- always run full ui test suite via npm run test:ui
- use page object model with reusable components
- prefer data-testid selectors over role selectors
- use Playwright MCP to see the page in browser (find selectors, interact with elements, etc.)
- prefer to setup test state via http requests
- track work status in ui-test-plan.md
