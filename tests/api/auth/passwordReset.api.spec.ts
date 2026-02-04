import { expect, test } from '@playwright/test';
import { createUser } from '../../../generators/userGenerator';
import { requestPasswordReset, resetPassword } from '../../../http/passwordResetClient';
import { attemptSignup } from '../../../http/signupClient';

test.describe('/users/password/forgot API tests', () => {
  test('should return reset token for existing account - 202', async ({ request }) => {
    // given
    const userData = createUser({ password: 'Password123!' });
    const signupResponse = await attemptSignup(request, userData);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await requestPasswordReset(request, { identifier: userData.username });

    // then
    expect(response.status()).toBe(202);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('If the account exists, password reset instructions have been sent.');
    expect(responseBody.token).toBeDefined();
    expect(responseBody.token.length).toBeGreaterThan(20);
  });

  test('should return validation error for empty identifier - 400', async ({ request }) => {
    // given
    const forgotPasswordPayload = { identifier: '' };

    // when
    const response = await requestPasswordReset(request, forgotPasswordPayload);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      identifier: 'Identifier is required'
    });
  });
});

test.describe('/users/password/reset API tests', () => {
  test('should reset password with valid token - 200', async ({ request }) => {
    // given
    const userData = createUser({ password: 'Password123!' });
    const signupResponse = await attemptSignup(request, userData);
    expect(signupResponse.status()).toBe(201);
    const forgotResponse = await requestPasswordReset(request, { identifier: userData.username });
    expect(forgotResponse.status()).toBe(202);
    const forgotResponseBody = await forgotResponse.json();

    // when
    const response = await resetPassword(request, {
      token: forgotResponseBody.token,
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!'
    });

    // then
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe('');
  });

  test('should return error for invalid password reset token - 400', async ({ request }) => {
    // given
    const resetPasswordPayload = {
      token: 'invalid-token',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!'
    };

    // when
    const response = await resetPassword(request, resetPasswordPayload);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      message: 'Invalid password reset token'
    });
  });
});
