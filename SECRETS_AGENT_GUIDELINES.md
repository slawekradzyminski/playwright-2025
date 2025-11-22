# Secure Agent Guidelines for Playwright MCP

## Quick Setup

### 1. Configure MCP with Secrets

`.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--secrets=./secrets.env"]
    }
  }
}
```

### 2. Create Secrets File

`secrets.env`:
```bash
X-LOGIN=your_username
X-PASSWORD=your_password
X-API-KEY=your_api_key
```

### 3. Protect Secrets

`.gitignore` and `.cursorignore`:
```
secrets.env
```

## Usage

### Filling Forms Securely

Use secret **key names** (not actual values):

```javascript
await browser_fill_form({
  fields: [
    { name: "Username", type: "textbox", ref: "e1", value: "X-LOGIN" },
    { name: "Password", type: "textbox", ref: "e2", value: "X-PASSWORD" }
  ]
});
```

MCP generates secure Playwright code:

```javascript
await page.getByTestId('login-username-input').fill(process.env['X-LOGIN']);
await page.getByTestId('login-password-input').fill(process.env['X-PASSWORD']);
```

### Typing Securely

```javascript
await browser_type({
  element: "password field",
  ref: "e3",
  text: "X-PASSWORD"
});
```

## How It Works

- MCP detects secret keys automatically
- Generates: `process.env['X-LOGIN']` instead of hardcoded values
- Masks secrets in snapshots: `<secret>X-LOGIN</secret>`
- Never exposes actual values in logs or traces

## Rules for AI Agents

1. **Always reference secrets by KEY name** (e.g., `"X-PASSWORD"`), never actual values
2. **Use `browser_fill_form` or `browser_type`** for sensitive inputs
3. **Never hardcode credentials** in test code
4. **Verify secrets are masked** in snapshots (look for `<secret>` tags)

## Security Checklist

- ✅ `secrets.env` in `.gitignore`
- ✅ `secrets.env` in `.cursorignore`
- ✅ `--secrets` flag in MCP config
- ✅ Use key names, not values
- ✅ Verify masking in output

## References

- [Playwright MCP Secrets Tests](https://github.com/microsoft/playwright/blob/main/tests/mcp/secrets.spec.ts)
- [Playwright MCP Documentation](https://github.com/microsoft/playwright-mcp)

