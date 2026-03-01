import { test, expect } from '@playwright/test';
import { clearOutboxRequest } from '../../../http/local-email-outbox/clearOutboxRequest';

test.describe('/local/email/outbox DELETE API tests', () => {
  test('should clear outbox entries - 200', async ({ request }) => {
    // when
    const response = await clearOutboxRequest(request);

    // then
    expect(response.status()).toBe(200);
  });
});
