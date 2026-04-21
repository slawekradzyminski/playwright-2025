#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { buildTrafficUrl } from './lib/buildTrafficUrl.mjs';
import { parseArgs } from './lib/parseArgs.mjs';
import { redactTrafficLog } from './lib/redactTrafficLog.mjs';
import { renderMarkdown } from './lib/renderMarkdown.mjs';
import { fail, parseJson } from './lib/utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

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

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
