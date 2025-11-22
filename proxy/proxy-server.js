const http = require('http');
const https = require('https');
const url = require('url');

// Allowed targets (only localhost services)
const ALLOWED_HOSTS = [
  'localhost:8081',
  '127.0.0.1:8081',
  'localhost:4001',
  '127.0.0.1:4001'
];

// Create HTTP server to handle proxy requests
const server = http.createServer((req, res) => {
  try {
    // Parse the target URL from the request
    const targetUrl = req.url.startsWith('http') ? req.url : `http://${req.url}`;
    const parsedUrl = url.parse(targetUrl);
    const targetHost = parsedUrl.host;

    console.log(`Request to: ${targetHost}${parsedUrl.path}`);

    // Check if target host is allowed
    if (!ALLOWED_HOSTS.includes(targetHost)) {
      console.log(`❌ Blocked request to: ${targetHost}`);
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied: Only localhost:8081 and localhost:4001 are allowed');
      return;
    }

    console.log(`✅ Allowed request to: ${targetHost}`);

    // Create the proxy request
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.path,
      method: req.method,
      headers: req.headers
    };

    // Choose the right protocol
    const proxyReq = (parsedUrl.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      // Forward the response headers
      res.writeHead(proxyRes.statusCode, proxyRes.headers);

      // Forward the response data
      proxyRes.pipe(res);
    });

    // Handle proxy request errors
    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err.message);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
      }
    });

    // Forward the request body if present
    req.pipe(proxyReq);

  } catch (error) {
    console.error('Request parsing error:', error);
    if (!res.headersSent) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad request');
    }
  }
});

const PORT = 3128;
server.listen(PORT, () => {
  console.log(`🚀 Secure proxy server running on http://localhost:${PORT}`);
  console.log(`✅ Only allowing traffic to: ${ALLOWED_HOSTS.join(', ')}`);
  console.log(`❌ Blocking all external domains`);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down proxy server...');
  server.close(() => {
    console.log('✅ Proxy server stopped');
    process.exit(0);
  });
});
