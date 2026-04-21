import { expect, test } from '@playwright/test';
import { LocalEmailOutboxClient } from '../../../httpclients/localEmailOutboxClient';
import type { StoredEmail } from '../../../types/email';

test.describe('GET /api/v1/local/email/outbox API tests', () => {
  let localEmailOutboxClient: LocalEmailOutboxClient;

  test.beforeEach(async ({ request }) => {
    localEmailOutboxClient = new LocalEmailOutboxClient(request);
  });

  test('should return local email outbox messages - 200', async () => {
    // given
    const clearResponse = await localEmailOutboxClient.clearOutbox();
    expect(clearResponse.status()).toBe(200);

    // when
    const response = await localEmailOutboxClient.getOutbox();

    // then
    expect(response.status()).toBe(200);

    const responseBody: StoredEmail[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody).toHaveLength(0);
  });
});
