import { expect, test } from '@playwright/test';
import { LocalEmailOutboxClient } from '../../../httpclients/localEmailOutboxClient';
import type { StoredEmail } from '../../../types/email';

test.describe('DELETE /api/v1/local/email/outbox API tests', () => {
  test('should clear local email outbox - 200', async ({ request }) => {
    // given
    const localEmailOutboxClient = new LocalEmailOutboxClient(request);

    // when
    const response = await localEmailOutboxClient.clearOutbox();

    // then
    expect(response.status()).toBe(200);

    const getResponse = await localEmailOutboxClient.getOutbox();
    const getResponseBody: StoredEmail[] = await getResponse.json();
    expect(getResponseBody).toHaveLength(0);
  });
});
