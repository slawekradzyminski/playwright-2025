# AGENTS Notes

- UI work must follow the `.cursor/rules/ui-tests-rules.mdc` guidance:
  - stick to the Page Object Model (`pages/` for pages, `pages/components/` for shared widgets),
  - rely on `data-testid` attributes for selectors,
  - target the frontend at `http://localhost:8081`,
  - explore the UI with Playwright MCP when adding scenarios,
  - and run the relevant Playwright specs after implementing changes.
- Prefer the existing `authenticatedUIAdmin` Playwright fixture so admin tests start with an authenticated session and land on `FRONTEND_URL/`.
- Keep assertions behaviour-focused, using the project’s `expect` helpers from `fixtures/uiAuthFixture.ts`.
- Commit structure: add new page objects/components before writing specs; encapsulate selector usage inside the POM to keep tests expressive.
