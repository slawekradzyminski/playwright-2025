import { UsersClient } from '../../../httpclients/usersClient';
import type { EmailEventDto } from '../../../types/email';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

const VALID_EMAIL_EVENT_TYPES = ['GENERIC', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_CONFIRMED'];
const VALID_EMAIL_EVENT_STATUSES = ['QUEUED', 'SENT_TO_SMTP_SINK', 'FAILED'];

test.describe('GET /api/v1/users/me/email-events API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return current user email events - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await usersClient.getMyEmailEvents(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: EmailEventDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);

    for (const event of responseBody) {
      expect(VALID_EMAIL_EVENT_TYPES).toContain(event.type);
      expect(VALID_EMAIL_EVENT_STATUSES).toContain(event.status);
      expect(event.recipientMasked).toEqual(expect.any(String));
      expect(Date.parse(event.createdAt)).not.toBeNaN();
      expect(Date.parse(event.updatedAt)).not.toBeNaN();
    }
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getMyEmailEvents();

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getMyEmailEvents('invalid-token');

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});
