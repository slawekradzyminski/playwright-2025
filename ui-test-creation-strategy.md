# UI Test Creation Strategy

## 1. Exploration Phase
- Use Playwright MCP to explore the application in real-time
- Use Playwright MCP to register new user on http://localhost:8081/register and use it for exploration.
- Navigate through the UI to understand features and user flows
- Identify interactive elements and their behavior
- Document test cases in a markdown file before writing code. Test cases should be written in BDD (given/when/then) style as that's the way I create tests.

## 2. Implementation Strategy
### Find Data Test IDs
- Use Playwright MCP `browser_snapshot` to view page structure
- Use `browser_evaluate` to extract `data-testid` attributes from elements
- Frontend should already have test IDs in place

### Follow Page Object Model
- Create page objects in `pages/` folder
- Create reusable components in `pages/components/`
- Use composition to include shared components (e.g., `loggedInHeader`)
- Each page should have an `expectOnPage()` method for URL verification

### Write Tests Following Project Patterns
- Use `given/when/then` comments structure
- Order tests logically (happy path first, then edge cases)
- Use fixtures for authentication (`authenticatedUIAdmin`, `authenticatedUIClient`)
- Keep test descriptions clear and behavior-focused
- Considering these are top-level tests, you should write them in a way that they cover the most important scenarios and flows. Do not cover corner cases, assume sufficient unit tests coverage for them.

## 3. Test Execution Loop
- Run tests immediately after writing them: `npx playwright test tests/ui/[file].spec.ts`
- Fix failing tests by checking actual vs expected test IDs
- Use Playwright MCP to verify correct selectors if tests timeout
- Iterate until all tests pass
- Check for linter errors and fix them

## 4. Refactoring
- Extract common patterns into reusable components
- Ensure tests use proper page object instances for assertions

## Key Rules
- See `.cursor/rules/ui-tests-rules.mdc` for project-specific conventions
- Always execute tests to verify they work
- Use data-testid selectors exclusively
- Frontend runs on `http://localhost:8081`

