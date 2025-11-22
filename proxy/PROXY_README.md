# Secure Network Proxy Setup for Playwright MCP

This project includes a custom Node.js proxy server that restricts network access to only allow traffic to localhost services, providing an additional security layer for automated testing with Playwright MCP.

## Overview

The proxy server blocks all external network requests and only allows access to:
- `localhost:8081` (Frontend application)
- `127.0.0.1:8081` (Frontend application)
- `localhost:4001` (Backend API)
- `127.0.0.1:4001` (Backend API)

This setup ensures that Playwright MCP browser automation can only interact with the intended test environment, preventing accidental access to external websites during testing.

## Security Benefits

- **Network-level blocking**: Prevents browser from accessing external domains
- **DNS rebinding protection**: Blocks malicious domain redirections
- **Controlled environment**: Ensures tests only interact with intended services
- **Audit trail**: Logs all network requests for debugging

## Usage

### Starting the Proxy

```bash
# Start proxy server
npm run proxy

# Or start in background
npm run proxy:bg
```

The proxy runs on `http://localhost:3128`

### Configuration

The proxy is configured in the Playwright MCP server arguments in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--secrets=./secrets.env",
        "--proxy-server=http://localhost:3128"
      ]
    }
  }
}
```

## Testing

### External domains are blocked:
```bash
curl -x http://localhost:3128 http://awesome-testing.com
# Returns: "Access denied: Only localhost:8081 and localhost:4001 are allowed"
```

### Localhost services work:
```bash
curl -x http://localhost:3128 http://localhost:8081
# Returns: Frontend HTML content

curl -x http://localhost:3128 http://localhost:4001
# Returns: Backend API responses
```

### Testing with Playwright MCP

When using Playwright MCP browser tools, the proxy is automatically enforced:

```javascript
// ✅ This will work - localhost traffic allowed
await browser_navigate({ url: "http://localhost:8081" });

// ❌ This will fail - external domains blocked
await browser_navigate({ url: "https://awesome-testing.com" });
// Returns: ERR_EMPTY_RESPONSE
```

## Technical Details

- **Port**: 3128 (chosen to avoid permission issues)
- **Protocol**: HTTP proxy (handles both HTTP and HTTPS targets)
- **Implementation**: Pure Node.js using built-in `http` and `https` modules
- **Logging**: Console output shows allowed/blocked requests
