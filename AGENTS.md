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
- use given (test setup), when (tested action), then (expected result) structure for tests

For UI tests:
- always run full ui test suite via npm run test:ui
- use page object model with reusable components
- prefer data-testid selectors over role selectors
- use Playwright CLI (`playwright-cli --help`) to see the page in browser (find selectors, interact with elements, etc.)
- prefer to setup test state via http requests
- track work status in ui-test-plan.md
- When you test navigation to other page assert both url and some text/selector presence on the new page (you may have to create a page object for the new page)
- do not add tests which only verify presence of pre-defined text/selectors on the page
