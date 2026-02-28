#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const DEFAULT_CSV_PATH = 'gatling_feeder_10000.csv';
const DEFAULT_API_DOCS_PATH = 'api-docs.json';
const DEFAULT_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4001';
const DEFAULT_TIMEOUT_MS = 15000;

const REQUIRED_CSV_COLUMNS = [
  'firstName',
  'lastName',
  'username',
  'password',
  'email',
];

const parseArgs = (argv) => {
  const config = {
    csvPath: DEFAULT_CSV_PATH,
    apiDocsPath: DEFAULT_API_DOCS_PATH,
    baseUrl: DEFAULT_BASE_URL,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--csv' && argv[index + 1]) {
      config.csvPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--api-docs' && argv[index + 1]) {
      config.apiDocsPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--base-url' && argv[index + 1]) {
      config.baseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--timeout-ms' && argv[index + 1]) {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid --timeout-ms value: ${argv[index + 1]}`);
      }
      config.timeoutMs = value;
      index += 1;
      continue;
    }

    if (arg === '--help') {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return config;
};

const printUsage = () => {
  console.log(`\nVerify registrations from CSV\n\nUsage:\n  node scripts/register-users-from-csv.mjs [options]\n\nOptions:\n  --csv <path>         CSV file with users (default: ${DEFAULT_CSV_PATH})\n  --api-docs <path>    OpenAPI docs file (default: ${DEFAULT_API_DOCS_PATH})\n  --base-url <url>     API base URL (default: ${DEFAULT_BASE_URL})\n  --timeout-ms <ms>    Per-request timeout in ms (default: ${DEFAULT_TIMEOUT_MS})\n  --help               Show this help\n`);
};

const normalizeHeader = (header) =>
  header.replace(/^\uFEFF/, '').trim();

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const extractFailureReason = (jsonBody, textBody, status) => {
  if (jsonBody && typeof jsonBody === 'object') {
    if (typeof jsonBody.message === 'string') {
      return jsonBody.message;
    }

    if (Array.isArray(jsonBody.message)) {
      return jsonBody.message.join('; ');
    }

    const keys = Object.keys(jsonBody);
    if (keys.length > 0) {
      return JSON.stringify(jsonBody);
    }
  }

  if (textBody) {
    return textBody.length > 300 ? `${textBody.slice(0, 300)}...` : textBody;
  }

  return `HTTP ${status}`;
};

const loadSignupConfig = async (apiDocsPath) => {
  const raw = await fsPromises.readFile(apiDocsPath, 'utf8');
  const docs = JSON.parse(raw);

  const paths = docs?.paths ?? {};
  const candidate = Object.entries(paths).find(([, pathDef]) => pathDef?.post?.operationId === 'signup')
    ?? Object.entries(paths).find(([endpoint]) => endpoint.toLowerCase().includes('signup'));

  const signupPath = candidate?.[0] ?? '/users/signup';
  const signupPost = candidate?.[1]?.post;

  const schemaRef = signupPost?.requestBody?.content?.['application/json']?.schema?.$ref;
  const schemaName = typeof schemaRef === 'string' ? schemaRef.split('/').at(-1) : null;
  const registerSchema = schemaName ? docs?.components?.schemas?.[schemaName] : null;

  const roleEnum = registerSchema?.properties?.roles?.items?.enum;
  const defaultRole = Array.isArray(roleEnum) && roleEnum.includes('ROLE_CLIENT')
    ? 'ROLE_CLIENT'
    : Array.isArray(roleEnum) && roleEnum.length > 0
      ? roleEnum[0]
      : 'ROLE_CLIENT';

  return {
    signupPath,
    defaultRole,
  };
};

const verifyCsvColumns = (headers) => {
  const missing = REQUIRED_CSV_COLUMNS.filter((required) => !headers.includes(required));
  if (missing.length > 0) {
    throw new Error(`CSV is missing required columns: ${missing.join(', ')}`);
  }
};

const postSignup = async ({ baseUrl, endpoint, payload, timeoutMs }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await response.text();
    const json = safeJsonParse(text);

    return {
      ok: response.status === 201,
      status: response.status,
      bodyJson: json,
      bodyText: text,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const ensureReportDirectory = async () => {
  await fsPromises.mkdir('test-results', { recursive: true });
};

const main = async () => {
  const startedAt = new Date();
  const { csvPath, apiDocsPath, baseUrl, timeoutMs } = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  if (!fs.existsSync(apiDocsPath)) {
    throw new Error(`API docs file not found: ${apiDocsPath}`);
  }

  const signupConfig = await loadSignupConfig(apiDocsPath);

  console.log(`Base URL: ${baseUrl}`);
  console.log(`Signup endpoint: ${signupConfig.signupPath}`);
  console.log(`CSV file: ${csvPath}`);
  console.log(`Default role: ${signupConfig.defaultRole}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let headers = [];
  let totalProcessed = 0;
  let successCount = 0;
  let failureCount = 0;

  const failures = [];

  for await (const rawLine of rl) {
    lineNumber += 1;
    const line = rawLine.trimEnd();

    if (lineNumber === 1) {
      headers = parseCsvLine(line).map(normalizeHeader);
      verifyCsvColumns(headers);
      continue;
    }

    if (line.trim().length === 0) {
      continue;
    }

    const values = parseCsvLine(line);
    const row = Object.fromEntries(
      headers.map((header, index) => [header, (values[index] ?? '').trim()]),
    );

    totalProcessed += 1;

    const payload = {
      username: row.username,
      email: row.email,
      password: row.password,
      firstName: row.firstName,
      lastName: row.lastName,
      roles: [signupConfig.defaultRole],
    };

    try {
      const response = await postSignup({
        baseUrl,
        endpoint: signupConfig.signupPath,
        payload,
        timeoutMs,
      });

      if (response.ok) {
        successCount += 1;
      } else {
        failureCount += 1;
        const reason = extractFailureReason(response.bodyJson, response.bodyText, response.status);
        failures.push({
          lineNumber,
          username: row.username,
          email: row.email,
          status: response.status,
          reason,
        });
        console.log(`FAIL line ${lineNumber} (${row.username}): ${response.status} ${reason}`);
      }
    } catch (error) {
      failureCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      failures.push({
        lineNumber,
        username: row.username,
        email: row.email,
        status: 0,
        reason: message,
      });
      console.log(`FAIL line ${lineNumber} (${row.username}): ${message}`);
    }

    if (totalProcessed % 100 === 0) {
      console.log(`Progress: processed ${totalProcessed} users (success: ${successCount}, failed: ${failureCount})`);
    }
  }

  const finishedAt = new Date();
  const durationMs = finishedAt.getTime() - startedAt.getTime();

  await ensureReportDirectory();
  const timestamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join('test-results', `registration-verification-${timestamp}.json`);

  const report = {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs,
    baseUrl,
    signupEndpoint: signupConfig.signupPath,
    csvPath,
    totalProcessed,
    successCount,
    failureCount,
    allSucceeded: failureCount === 0,
    failures,
  };

  await fsPromises.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('\n=== Registration verification summary ===');
  console.log(`Processed: ${totalProcessed}`);
  console.log(`Succeeded: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`All succeeded: ${failureCount === 0 ? 'YES' : 'NO'}`);
  console.log(`Report: ${reportPath}`);

  if (failureCount > 0) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(`Fatal error: ${message}`);
  process.exitCode = 1;
});
