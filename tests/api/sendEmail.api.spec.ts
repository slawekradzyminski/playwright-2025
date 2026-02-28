import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { EmailDto } from '../../types/email';
import { sendEmailRequest } from './http/sendEmailRequest';

test.describe('/email API tests', () => {
  test('should send email for authenticated user - 200', async ({ request, clientAuth }) => {
    // given
    const payload: EmailDto = {
      to: clientAuth.userDetails.email,
      subject: 'API test subject',
      message: 'API test message',
      template: 'GENERIC',
      properties: {
        source: 'api-test',
      },
    };

    // when
    const response = await sendEmailRequest(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
  });

  test('should return validation error for invalid payload - 400', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await sendEmailRequest(request, clientAuth.jwtToken, {
      subject: '',
      message: '',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/email', {
      data: {
        subject: 'subject',
        message: 'message',
      } as EmailDto,
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});
