# API Test Authoring Guide

- Use curl to test the API endpoints manually and use the response to create the test cases.
- Some endpoints are protected by authentication, so you need to provide a valid JWT token in the request. It is returned by login endpoint.
- Keep API test cases ordered by HTTP status code ascending (e.g. `200 -> 400 -> 401 -> 403 -> 404`).
- Structure each test with clear `given / when / then` comments.
- Split request logic into dedicated HTTP clients in `http/` (follow `http/loginClient.ts` style) and keep specs focused on assertions.
- Do not add many `400` input-validation tests; keep a small, representative set because unit tests cover validation in depth.
- After adding tests, run only the new spec(s) first to verify they pass before running broader suites.
