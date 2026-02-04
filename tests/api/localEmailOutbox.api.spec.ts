import { expect, test } from '@playwright/test';
import { clearLocalEmailOutbox, getLocalEmailOutbox } from '../../http/localEmailOutboxClient';

test.describe('/local/email/outbox API tests', () => {
  test('should return email outbox entries - 200', async ({ request }) => {
    // given
    await clearLocalEmailOutbox(request);

    // when
    const response = await getLocalEmailOutbox(request);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should clear email outbox - 200', async ({ request }) => {
    // given
    // when
    const response = await clearLocalEmailOutbox(request);

    // then
    expect([200, 204]).toContain(response.status());
    expect(await response.text()).toBe('');
  });
});
