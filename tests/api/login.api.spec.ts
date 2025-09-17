import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { attemptLogin } from '../../http/loginClient';
import { validateLoginResponse } from '../../utils/auth';
import { APIResponse } from '@playwright/test';

test.describe('/users/signin API tests', () => {
  test('should successfully authenticate with valid credentials - 200', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(200);
    validateLoginResponse(response as APIResponse);
  });

  test('should return validation error for empty password - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: ''
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.password).toBe('Minimum password length: 4 characters');
  });

  test('should return validation error for username too short - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'abc',
      password: 'admin'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for invalid JSON - 400', async ({ request }) => {
    // given
    const invalidJson = '{"username": "admin", "password":}';

    // when
    const response = await attemptLogin(request, invalidJson as unknown as LoginDto);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe(400);
    expect(responseBody.message).toContain('Invalid JSON format');
  });

  test('should return authentication error for invalid username - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'nonexistentuser',
      password: 'admin'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });

  test('should return authentication error for invalid password - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'wrongpassword'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });

  test('should return authentication error for both invalid credentials - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'wronguser',
      password: 'wrongpassword'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });
});