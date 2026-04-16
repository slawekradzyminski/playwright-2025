import { APIResponse } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createLogger } from './logger';

const log = createLogger('http');

interface RequestInfo {
  method: string;
  url: string;
  body?: unknown;
}

const BINARY_CONTENT_TYPE_PREFIXES = [
  'image/',
  'audio/',
  'video/',
];

const BINARY_CONTENT_TYPES = [
  'application/octet-stream',
  'application/pdf',
  'application/zip',
];

function isBinaryContentType(contentType: string): boolean {
  const normalizedContentType = contentType.toLowerCase().split(';')[0].trim();

  return (
    BINARY_CONTENT_TYPE_PREFIXES.some((prefix) => normalizedContentType.startsWith(prefix)) ||
    BINARY_CONTENT_TYPES.includes(normalizedContentType)
  );
}

/**
 * Wraps an API call with:
 *  - Pino structured logging (console + file) for request & response
 *  - An Allure step that shows up in the HTML report, with request/response
 *    bodies attached as JSON so they are visible inside each test's timeline.
 *
 * Usage (inside an HTTP client):
 *   return loggedApiCall(
 *     { method: 'POST', url: fullUrl, body: loginData },
 *     () => request.post(fullUrl, { data: loginData, headers })
 *   );
 */
export async function loggedApiCall(
  info: RequestInfo,
  fn: () => Promise<APIResponse>,
): Promise<APIResponse> {
  const { method, url, body } = info;

  log.debug({ method, url, body }, `→ ${method} ${url}`);

  const response = await allure.step(`${method} ${url}`, async () => {
    // Attach request body to Allure step (if present)
    if (body !== undefined) {
      await allure.attachment(
        'Request Body',
        JSON.stringify(body, null, 2),
        { contentType: 'application/json' },
      );
    }

    const res = await fn();

    const status = res.status();
    const contentType = res.headers()['content-type'] ?? '';

    if (isBinaryContentType(contentType)) {
      const responseBody = await res.body();
      const responseSummary = {
        contentType,
        bodySizeBytes: responseBody.length,
        body: '<binary response omitted from logs>',
      };

      log.info({ method, url, status, response: responseSummary }, `← ${status} ${method} ${url}`);

      await allure.attachment(
        `Response ${status} Body`,
        responseBody,
        { contentType },
      );

      await allure.attachment(
        `Response ${status} Metadata`,
        JSON.stringify({ status, ...responseSummary }, null, 2),
        { contentType: 'application/json' },
      );

      return res;
    }

    // Read text/JSON response body for logging; Playwright buffers it so further
    // .json() / .text() calls in the test will still work correctly.
    let responseBody: unknown;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text();
    }

    log.info({ method, url, status, responseBody }, `← ${status} ${method} ${url}`);

    // Attach response to Allure step
    await allure.attachment(
      `Response ${status}`,
      JSON.stringify({ status, body: responseBody }, null, 2),
      { contentType: 'application/json' },
    );

    return res;
  });

  return response;
}
