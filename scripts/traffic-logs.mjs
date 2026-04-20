#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { redactTrafficLog } from './lib/redactTrafficLog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

const TRAFFIC_LOGS_ENDPOINT = '/api/v1/traffic/logs';
const DEFAULT_PAGE = '0';
const DEFAULT_SIZE = '10';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = process.env.APP_BASE_URL;

  if (!baseUrl) {
    fail('APP_BASE_URL is required. Set it in .env or the current shell.');
  }

  const response = await fetch(buildTrafficUrl(baseUrl, args));
  const responseText = await response.text();

  if (response.status === 404 && args.correlationId) {
    console.error(`No traffic log found for correlation id: ${args.correlationId}`);
    process.exit(1);
  }

  if (!response.ok) {
    fail(`Traffic logs request failed with HTTP ${response.status}: ${responseText}`);
  }

  const payload = parseJson(responseText);
  const safePayload = redactTrafficLog(payload, {
    unsafeShowSecrets: args.unsafeShowSecrets,
    maxStringLength: args.maxStringLength
  });

  if (args.raw || args.format === 'json') {
    console.log(JSON.stringify(safePayload, null, 2));
    return;
  }

  console.log(renderMarkdown(safePayload, args));
}

function parseArgs(argv) {
  const args = {
    page: DEFAULT_PAGE,
    size: DEFAULT_SIZE,
    format: 'markdown',
    raw: false,
    showHeaders: false,
    showBodies: true,
    unsafeShowSecrets: false,
    maxStringLength: 500
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    switch (arg) {
      case '--session':
        args.clientSessionId = readValue(argv, ++index, arg);
        break;
      case '--method':
        args.method = readValue(argv, ++index, arg);
        break;
      case '--status':
        args.status = readValue(argv, ++index, arg);
        break;
      case '--path':
        args.pathContains = readValue(argv, ++index, arg);
        break;
      case '--text':
        args.text = readValue(argv, ++index, arg);
        break;
      case '--from':
        args.from = readValue(argv, ++index, arg);
        break;
      case '--to':
        args.to = readValue(argv, ++index, arg);
        break;
      case '--page':
        args.page = readValue(argv, ++index, arg);
        break;
      case '--size':
        args.size = readValue(argv, ++index, arg);
        break;
      case '--correlation-id':
        args.correlationId = readValue(argv, ++index, arg);
        break;
      case '--format':
        args.format = readValue(argv, ++index, arg);
        if (!['markdown', 'json'].includes(args.format)) {
          fail(`Unsupported --format value: ${args.format}`);
        }
        break;
      case '--max-string-length':
        args.maxStringLength = Number(readValue(argv, ++index, arg));
        if (!Number.isInteger(args.maxStringLength) || args.maxStringLength < 1) {
          fail('--max-string-length must be a positive integer.');
        }
        break;
      case '--show-headers':
        args.showHeaders = true;
        break;
      case '--show-bodies':
        args.showBodies = true;
        break;
      case '--no-bodies':
        args.showBodies = false;
        break;
      case '--raw':
        args.raw = true;
        break;
      case '--unsafe-show-secrets':
        args.unsafeShowSecrets = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        fail(`Unknown option: ${arg}`);
    }
  }

  return args;
}

function readValue(argv, index, flag) {
  const value = argv[index];

  if (!value || value.startsWith('--')) {
    fail(`${flag} requires a value.`);
  }

  return value;
}

function buildTrafficUrl(baseUrl, args) {
  const url = new URL(
    args.correlationId
      ? `${TRAFFIC_LOGS_ENDPOINT}/${encodeURIComponent(args.correlationId)}`
      : TRAFFIC_LOGS_ENDPOINT,
    baseUrl
  );

  if (args.correlationId) {
    return url;
  }

  const queryParams = {
    page: args.page,
    size: args.size,
    clientSessionId: args.clientSessionId,
    method: args.method,
    status: args.status,
    pathContains: args.pathContains,
    text: args.text,
    from: args.from,
    to: args.to
  };

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

function parseJson(responseText) {
  try {
    return JSON.parse(responseText);
  } catch (error) {
    fail(`Traffic logs response was not valid JSON: ${error.message}`);
  }
}

function renderMarkdown(payload, args) {
  if (Array.isArray(payload.content)) {
    return renderListMarkdown(payload, args);
  }

  return renderEntryMarkdown(payload, args, '# Traffic Log');
}

function renderListMarkdown(page, args) {
  const lines = [
    '# Traffic Logs',
    '',
    `- totalElements: ${page.totalElements}`,
    `- totalPages: ${page.totalPages}`,
    `- pageNumber: ${page.pageNumber}`,
    `- pageSize: ${page.pageSize}`
  ];

  if (page.content.length === 0) {
    lines.push('', 'No matching traffic logs.');
    return lines.join('\n');
  }

  page.content.forEach((entry, index) => {
    lines.push('', renderEntryMarkdown(entry, args, `## ${index + 1}. ${entry.method} ${entry.path} -> ${entry.status}`));
  });

  return lines.join('\n');
}

function renderEntryMarkdown(entry, args, title) {
  const lines = [
    title,
    '',
    `- correlationId: ${entry.correlationId}`,
    `- timestamp: ${entry.timestamp}`,
    `- clientSessionId: ${entry.clientSessionId}`,
    `- durationMs: ${entry.durationMs}`,
    `- requestContentType: ${entry.requestContentType}`,
    `- responseContentType: ${entry.responseContentType}`,
    `- requestBodyTruncated: ${entry.requestBodyTruncated}`,
    `- responseBodyTruncated: ${entry.responseBodyTruncated}`
  ];

  if (args.showHeaders) {
    lines.push('- requestHeaders:', fencedJson(entry.requestHeaders));
    lines.push('- responseHeaders:', fencedJson(entry.responseHeaders));
  }

  if (args.showBodies) {
    lines.push('- requestBody:', fencedJson(entry.requestBody));
    lines.push('- responseBody:', fencedJson(entry.responseBody));
  }

  return lines.join('\n');
}

function fencedJson(value) {
  return ['```json', JSON.stringify(value, null, 2), '```'].join('\n');
}

function printHelp() {
  console.log(`Usage: npm run traffic:logs -- [options]

Options:
  --session <clientSessionId>       Filter by X-Client-Session-Id
  --method <method>                 Filter by HTTP method
  --status <number>                 Filter by response status
  --path <text>                     Filter by pathContains
  --text <text>                     Free-text search
  --from <ISO instant>              Start timestamp filter
  --to <ISO instant>                End timestamp filter
  --page <number>                   Page number, default 0
  --size <number>                   Page size, default 10
  --correlation-id <id>             Fetch one traffic log
  --format <markdown|json>          Output format, default markdown
  --show-headers                    Include redacted headers
  --no-bodies                       Omit request and response bodies
  --raw                             Alias for redacted JSON output
  --unsafe-show-secrets             Disable redaction
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch(error => fail(error instanceof Error ? error.message : String(error)));
