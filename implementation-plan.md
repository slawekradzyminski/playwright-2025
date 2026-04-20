# Implementation Plan: Traffic Logs API Tests and AI-Friendly Log Utility

## Context

Target endpoint:

```http
GET /api/v1/traffic/logs
```

Purpose: return paginated HTTP traffic logs captured by the application gateway/server.

Source of truth: `api-docs.json`, section `Traffic Monitoring`.

Related endpoints:

```http
GET /api/v1/traffic/logs/{correlationId}
GET /api/v1/traffic/info
```

The existing test suite is a TypeScript Playwright project with API clients under `httpclients/`, shared DTOs under `types/`, and API specs under `tests/api/`.

## Exploratory Test Findings

I tested the endpoint through the public gateway configured in `.env` as `APP_BASE_URL=http://localhost:8081`.

### Basic Availability

Command shape:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/logs?page=0&size=5"
```

Observed result:

- Status: `200`
- Content type: `application/json`
- No bearer token was required.
- Response top-level fields:
  - `content`
  - `pageNumber`
  - `pageSize`
  - `totalElements`
  - `totalPages`

### Traffic Info Endpoint

Command shape:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/info"
```

Observed result:

```json
{
  "webSocketEndpoint": "/api/v1/ws-traffic",
  "topic": "/topic/traffic",
  "description": "Connect to the WebSocket endpoint and subscribe to the topic to receive real-time HTTP traffic events"
}
```

### Deterministic Log Generation

I generated known traffic with `X-Client-Session-Id: codex-traffic-plan`:

```bash
curl -sS \
  -H "Content-Type: application/json" \
  -H "X-Client-Session-Id: codex-traffic-plan" \
  --data '{"username":"abc","email":"not-an-email","password":"short","firstName":"Traffic","lastName":"Probe"}' \
  "$APP_BASE_URL/api/v1/users/signup"
```

Observed status: `400`.

```bash
curl -sS \
  -H "Content-Type: application/json" \
  -H "X-Client-Session-Id: codex-traffic-plan" \
  --data '{"username":"wronguser","password":"wrongpassword"}' \
  "$APP_BASE_URL/api/v1/users/signin"
```

Observed status: `422`.

### Filtering

Filtering by `clientSessionId` returned only the two generated requests:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/logs?page=0&size=10&clientSessionId=codex-traffic-plan"
```

Observed log entry fields:

- `correlationId`
- `timestamp`
- `clientSessionId`
- `method`
- `path`
- `queryString`
- `status`
- `durationMs`
- `requestHeaders`
- `requestContentType`
- `requestBody`
- `requestBodyTruncated`
- `requestBodyOriginalLength`
- `requestBodyStoredLength`
- `responseHeaders`
- `responseContentType`
- `responseBody`
- `responseBodyTruncated`
- `responseBodyOriginalLength`
- `responseBodyStoredLength`

Combined filtering worked:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/logs?page=0&size=5&method=POST&status=422&pathContains=signin"
```

Observed result: one `/api/v1/users/signin` entry with status `422`.

Free-text filtering worked:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/logs?page=0&size=5&text=wronguser"
```

Observed result: one signin entry whose request body included `username: wronguser`.

Time-window filtering worked with ISO instants:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/logs?clientSessionId=codex-traffic-plan&from=2026-04-20T10:48:44.800Z&to=2026-04-20T10:48:45.000Z"
```

Observed result: the later signin entry only.

### Pagination and Ordering

With `clientSessionId=codex-traffic-plan`, `size=1` returned:

- `pageNumber: 0`, `pageSize: 1`, `totalElements: 2`, `totalPages: 2`
- page 0 contained the newer signin entry.
- page 1 contained the older signup entry.

Observed ordering is newest first.

### Correlation Detail Endpoint

Command shape:

```bash
curl -sS "$APP_BASE_URL/api/v1/traffic/logs/{correlationId}"
```

Observed result:

- Existing `correlationId`: `200`, full `TrafficLogEntryDto`.
- Missing `correlationId`: `404`, empty body.

### Error Handling

Observed invalid query behavior:

- `page=-1` returns `400` with `{ "error": "Page index must not be less than zero" }`.
- `status=abc` returns `400` with `{ "error": "For input string: \"abc\"" }`.
- `from=not-a-date` returns `400` with `{ "error": "Invalid instant format: not-a-date" }`.
- `size=0` returns `200` and behaves as `pageSize: 1`; this is an implementation quirk, not an obvious negative-test expectation.

### Security and Redaction Note

The traffic endpoint returns request and response bodies. During exploration, request bodies included `password` fields. Any AI-facing utility must redact sensitive values before showing logs to a model or saving output.

## Implementation Goals

1. Add focused Playwright API coverage for `GET /api/v1/traffic/logs`.
2. Keep tests deterministic by generating unique traffic per test via `X-Client-Session-Id`.
3. Add strongly typed DTOs and an API client matching the project style.
4. Add an AI-friendly traffic log inspection utility that summarizes server-side communications safely.
5. Avoid depending on raw backend ports; use only `APP_BASE_URL`.

## Proposed File Changes

### Add Traffic DTOs

Create:

```text
types/traffic.ts
```

Proposed interfaces:

```ts
export interface PageDto<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface TrafficLogEntryDto {
  correlationId: string;
  timestamp: string;
  clientSessionId: string | null;
  method: string;
  path: string;
  queryString: string | null;
  status: number;
  durationMs: number;
  requestHeaders: Record<string, string[]> | null;
  requestContentType: string | null;
  requestBody: unknown;
  requestBodyTruncated: boolean;
  requestBodyOriginalLength: number;
  requestBodyStoredLength: number;
  responseHeaders: Record<string, string[]> | null;
  responseContentType: string | null;
  responseBody: unknown;
  responseBodyTruncated: boolean;
  responseBodyOriginalLength: number;
  responseBodyStoredLength: number;
}

export interface TrafficLogsQuery {
  page?: number;
  size?: number;
  clientSessionId?: string;
  method?: string;
  status?: number;
  pathContains?: string;
  text?: string;
  from?: string;
  to?: string;
}
```

### Add Traffic API Client

Create:

```text
httpclients/trafficClient.ts
```

Responsibilities:

- Build URLs from `APP_BASE_URL`.
- Encode optional query params with `URLSearchParams`.
- Expose:
  - `getLogs(query?: TrafficLogsQuery): Promise<APIResponse>`
  - `getLog(correlationId: string): Promise<APIResponse>`
  - `getInfo(): Promise<APIResponse>`

Suggested constants:

```ts
export const TRAFFIC_LOGS_ENDPOINT = '/api/v1/traffic/logs';
export const TRAFFIC_INFO_ENDPOINT = '/api/v1/traffic/info';
export const CLIENT_SESSION_HEADER = 'X-Client-Session-Id';
```

### Add Test Data Helper

Create:

```text
helpers/trafficTestData.ts
```

Responsibilities:

- Generate unique session IDs, for example:

```ts
export function trafficSessionId(testTitle: string): string {
  return `pw-${Date.now()}-${testTitle.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)}`;
}
```

- Optionally expose payload builders for known signin/signup failures.

This avoids cross-test contamination from older logs.

### Add Traffic Logs API Spec

Create:

```text
tests/api/trafficLogs.api.spec.ts
```

Use Playwright request fixture plus existing clients.

Recommended test cases:

1. `should return paginated traffic logs - 200`
   - Call `getLogs({ page: 0, size: 5 })`.
   - Assert status `200`.
   - Assert page fields are numbers.
   - Assert `content` is an array.
   - If content is non-empty, validate representative entry shape.

2. `should record and filter logs by client session id - 200`
   - Generate unique session ID.
   - Send one known failing request to `/api/v1/users/signin` with `X-Client-Session-Id`.
   - Poll `getLogs({ clientSessionId, pathContains: 'signin', status: 422 })` until the entry appears.
   - Assert:
     - one or more entries returned
     - all entries have matching `clientSessionId`
     - target entry has `method: POST`
     - target entry has `path: /api/v1/users/signin`
     - target entry has `status: 422`
     - `responseBody.message` is `Invalid username/password supplied`

3. `should support method status path and text filters - 200`
   - Generate unique session ID.
   - Send signin failure using unique username text, e.g. `wronguser-${Date.now()}`.
   - Query with:
     - `clientSessionId`
     - `method: POST`
     - `status: 422`
     - `pathContains: signin`
     - `text: uniqueUsername`
   - Assert the filtered entry matches all criteria.

4. `should paginate filtered traffic logs newest first - 200`
   - Generate unique session ID.
   - Send two known requests with the same session ID:
     - signup validation failure, expected `400`
     - signin invalid credentials, expected `422`
   - Query `size: 1`, page `0` and page `1`.
   - Assert:
     - `totalElements: 2`
     - `totalPages: 2`
     - page 0 has the later request
     - page 1 has the earlier request
     - first timestamp is greater than or equal to second timestamp

5. `should filter logs by time window - 200`
   - Capture `beforeRequest = new Date().toISOString()`.
   - Send a known request with a unique session ID.
   - Capture `afterRequest = new Date().toISOString()`.
   - Poll `getLogs({ clientSessionId, from: beforeRequest, to: afterRequest })`.
   - Assert returned entries are inside the time window.

6. `should return traffic log by correlation id - 200`
   - Generate one known request.
   - Query logs by unique session ID.
   - Take `correlationId`.
   - Call `getLog(correlationId)`.
   - Assert returned entry matches the list entry.

7. `should return 404 for missing correlation id`
   - Call `getLog('00000000-0000-0000-0000-000000000000')`.
   - Assert status `404`.
   - Do not assert JSON body because exploration showed an empty response.

8. `should return validation errors for invalid query params`
   - `page=-1`: assert `400` and error message.
   - `status=abc`: assert `400` and an `error` field.
   - `from=not-a-date`: assert `400` and an `error` field.

Do not add a failing expectation for `size=0` unless the product team confirms it should be invalid. Current behavior is `200` with `pageSize: 1`.

### Polling Strategy

Traffic logging may be asynchronous. Add a small helper:

```ts
async function expectTrafficEntryEventually(
  trafficClient: TrafficClient,
  query: TrafficLogsQuery,
  predicate: (entry: TrafficLogEntryDto) => boolean
): Promise<TrafficLogEntryDto>
```

Implementation idea:

- Use `expect.poll` from Playwright.
- Poll every `250ms` for up to `5s`.
- Return the matching entry once found.

This keeps tests stable without arbitrary sleeps.

## AI-Friendly Traffic Log Utility

### Purpose

Create a command-line utility that an AI agent or developer can run to inspect recent server-side HTTP communications without manually reading raw JSON responses.

The utility should answer questions such as:

- What did the frontend or test send to the backend?
- Which endpoint returned an error?
- What was the request/response body for a given correlation ID?
- What happened during this specific test session?
- Which logs mention a given text fragment?

### Proposed File

Create:

```text
scripts/traffic-logs.mjs
```

Use plain Node.js to avoid requiring TypeScript runtime setup. Node 24 already provides global `fetch`; `dotenv` is already installed and can load `.env`.

Add package script:

```json
"traffic:logs": "node scripts/traffic-logs.mjs"
```

### Supported CLI Options

Recommended options:

```text
--session <clientSessionId>
--method <GET|POST|PUT|PATCH|DELETE>
--status <number>
--path <pathContains>
--text <text>
--from <ISO instant>
--to <ISO instant>
--page <number>
--size <number>
--correlation-id <id>
--format <markdown|json>
--show-headers
--show-bodies
--raw
```

Defaults:

- `page=0`
- `size=10`
- `format=markdown`
- headers summarized, not fully printed
- bodies shown in redacted and truncated form
- `raw=false`

### Example Commands

Recent logs:

```bash
npm run traffic:logs -- --size 5
```

Logs for one test run:

```bash
npm run traffic:logs -- --session pw-traffic-123 --size 20
```

Only failed signin calls:

```bash
npm run traffic:logs -- --method POST --status 422 --path signin
```

Specific log entry:

```bash
npm run traffic:logs -- --correlation-id 08ce0ca7-7336-4e02-97a5-9f472862c622
```

Machine-readable output:

```bash
npm run traffic:logs -- --session pw-traffic-123 --format json
```

### AI-Friendly Markdown Output

For list output, render compact records:

```markdown
# Traffic Logs

- totalElements: 2
- pageNumber: 0
- pageSize: 10

## 1. POST /api/v1/users/signin -> 422

- correlationId: 08ce0ca7-7336-4e02-97a5-9f472862c622
- timestamp: 2026-04-20T10:48:44.894278Z
- clientSessionId: codex-traffic-plan
- durationMs: 390
- requestContentType: application/json
- responseContentType: application/json
- requestBody:
  {"username":"wronguser","password":"[REDACTED]"}
- responseBody:
  {"message":"Invalid username/password supplied"}
```

For JSON output, return redacted structured JSON suitable for tool consumption.

### Required Redaction

Redact sensitive values recursively in:

- request headers
- response headers
- request body
- response body
- query string values where possible

Sensitive key patterns:

```text
authorization
cookie
set-cookie
token
access_token
refresh_token
id_token
password
secret
api_key
apikey
key
credential
session
```

Recommended redaction behavior:

- Replace scalar values with `[REDACTED]`.
- Preserve object shape and array lengths.
- Truncate long strings after a configurable limit, for example `500` characters.
- `--raw` may bypass formatting but should still require an explicit flag name that makes risk clear, for example `--raw --unsafe-show-secrets`.

### Utility Implementation Notes

Implementation outline:

1. Load `.env`.
2. Resolve `APP_BASE_URL`.
3. Parse CLI arguments with a small local parser to avoid new dependencies.
4. Build URL using `URL` and `URLSearchParams`.
5. Fetch either:
   - `/api/v1/traffic/logs`
   - `/api/v1/traffic/logs/{correlationId}`
6. Redact the response object.
7. Render markdown or JSON.
8. Exit non-zero if:
   - `APP_BASE_URL` is missing
   - the endpoint returns a non-2xx response other than expected `404` for detail lookup
   - response JSON cannot be parsed when a body is expected

### Utility Tests

Add focused unit tests only if the project gets a test runner for non-Playwright unit tests. Otherwise, cover the utility indirectly by:

- keeping redaction as a pure exported function in `scripts/lib/redactTrafficLog.mjs`
- manually verifying with `node scripts/traffic-logs.mjs --session <id>`

If adding Playwright-based tests for the utility is acceptable, create:

```text
tests/api/trafficLogUtility.spec.ts
```

It can import the redaction function and verify:

- password fields are redacted recursively
- authorization/cookie headers are redacted case-insensitively
- non-sensitive fields remain visible
- arrays preserve length

## Risks and Mitigations

### Risk: Existing Logs Pollute Results

Mitigation:

- Always generate a unique `X-Client-Session-Id`.
- Always filter by that session ID.

### Risk: Logging Is Eventually Consistent

Mitigation:

- Use `expect.poll` with a short timeout instead of fixed sleeps.

### Risk: Sensitive Data Exposure

Mitigation:

- Do not print raw traffic logs in tests.
- Redact utility output by default.
- Require an explicit unsafe flag before showing raw secrets.
- Avoid storing utility output in the repository.

### Risk: Date-Based Tests Are Flaky

Mitigation:

- Use a broad enough `from`/`to` window.
- Prefer session-id filtering first, then time assertions.

### Risk: Endpoint Is Open

Mitigation:

- Add tests that document current behavior only if the product owner confirms unauthenticated access is intended.
- Otherwise, keep auth behavior out of the initial automated coverage and create a separate security discussion.

## Implementation Order

1. Add `types/traffic.ts`.
2. Add `httpclients/trafficClient.ts`.
3. Add test helper for unique traffic session IDs and eventual polling.
4. Add `tests/api/trafficLogs.api.spec.ts`.
5. Run the new spec locally:

```bash
npx playwright test tests/api/trafficLogs.api.spec.ts
```

6. Add `scripts/traffic-logs.mjs`.
7. Add `scripts/lib/redactTrafficLog.mjs` if redaction logic grows beyond a small helper.
8. Add `traffic:logs` package script.
9. Manually verify utility output with a generated session ID.
10. Run the existing API suite:

```bash
npm run test:api
```

## Acceptance Criteria

- Playwright tests create their own traffic and do not depend on pre-existing server logs.
- Tests validate pagination, filtering, correlation lookup, and invalid query behavior.
- Tests use `APP_BASE_URL`, not raw service ports.
- The traffic utility produces concise markdown by default.
- The traffic utility can output redacted JSON for AI/tool consumption.
- Sensitive fields are redacted by default.
- The implementation does not expose tokens, passwords, cookies, or session identifiers unless an explicit unsafe flag is used.
