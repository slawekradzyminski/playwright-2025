import { APIResponse } from '@playwright/test';
import { allure } from 'allure-playwright';
import { createLogger } from './logger';

const log = createLogger('http');

interface RequestInfo {
  method: string;
  url: string;
  body?: unknown;
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

    // Read response body for logging; Playwright buffers it so further
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
