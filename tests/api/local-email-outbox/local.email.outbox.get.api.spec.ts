import { expect, test } from '@playwright/test';
import { LocalEmailOutboxClient } from '../../../httpclients/localEmailOutboxClient';
import type { StoredEmail } from '../../../types/email';

test.describe('GET /api/v1/local/email/outbox API tests', () => {
  test('should return local email outbox messages - 200', async ({ request }) => {
    // given
    const localEmailOutboxClient = new LocalEmailOutboxClient(request);
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
