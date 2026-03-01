import { test, expect } from '@playwright/test';
import type { StoredEmail } from '../../../types/email';
import { getOutboxRequest } from '../../../http/local-email-outbox/getOutboxRequest';

test.describe('/local/email/outbox GET API tests', () => {
  test('should return outbox entries - 200', async ({ request }) => {
    // when
    const response = await getOutboxRequest(request);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as StoredEmail[];
    expect(Array.isArray(responseBody)).toBe(true);
    expect(
      responseBody.every(
        (email) =>
          typeof email.timestamp === 'string' &&
          typeof email.destination === 'string' &&
          typeof email.payload === 'object' &&
          email.payload !== null,
      ),
    ).toBe(true);
  });
});
