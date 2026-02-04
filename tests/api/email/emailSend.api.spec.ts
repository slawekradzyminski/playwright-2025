import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { sendEmail } from '../../../http/emailClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/email POST API tests', () => {
  test('should send email for authenticated request - 200', async ({ request, authenticatedUser }) => {
    // given
    const payload = {
      to: 'user@example.com',
      subject: 'Test subject',
      message: 'Test message'
    };

    // when
    const response = await sendEmail(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe('');
  });

  test('should return validation error for invalid payload - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = {
      subject: '',
      message: ''
    };

    // when
    const response = await sendEmail(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      subject: 'Email subject is required',
      message: 'Email content is required'
    });
  });

  test('should return unauthorized for email send request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/email`, {
      data: { subject: 'A', message: 'B' }
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
