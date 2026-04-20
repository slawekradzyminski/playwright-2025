# Agent Notes

## Traffic Logs Utility

Use `npm run traffic:logs -- [options]` to inspect server-side HTTP traffic captured by `GET /api/v1/traffic/logs`. The utility reads `APP_BASE_URL` from `.env`, prints AI-friendly Markdown by default, and redacts sensitive keys such as passwords, tokens, cookies, credentials, and session identifiers before output.

Useful examples:

```bash
npm run traffic:logs -- --size 5
npm run traffic:logs -- --session <clientSessionId> --size 20
npm run traffic:logs -- --method POST --status 422 --path signin
npm run traffic:logs -- --correlation-id <correlationId>
npm run traffic:logs -- --session <clientSessionId> --format json
```

Avoid `--unsafe-show-secrets` unless a human explicitly asks for raw sensitive values.
