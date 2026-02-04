import { test, expect, APIResponse } from '@playwright/test';
import type { LoginDto } from '../../../types/auth';
import { attemptLogin } from '../../../http/loginClient';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../config/constants';

test.describe('/users/signin API tests', () => {
  test('should successfully authenticate with valid credentials - 200', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(200);
    await validateLoginResponse(response, loginData);
  });

  test('should return validation error for empty username - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: '',
      password: 'admin'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      username: 'Minimum username length: 4 characters'
    });
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
    expect(responseBody).toEqual({
      username: 'Minimum username length: 4 characters'
    });
  });

  test('should return validation error for password too short - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: ADMIN_USERNAME,
      password: 'abc'
    };

    // when
    const response = await attemptLogin(request, loginData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      password: 'Minimum password length: 4 characters'
    });
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

const validateLoginResponse = async (response: APIResponse, loginData: LoginDto) => {
  const responseBody = await response.json();
  expect(response.headers()['content-type']).toContain('application/json');
  expect(responseBody.token).toBeDefined();
  expect(responseBody.refreshToken).toBeDefined();
  expect(responseBody.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  expect(responseBody.username).toBe(loginData.username);
  expect(typeof responseBody.email).toBe('string');
  expect(responseBody.email).toBeDefined();
  expect(typeof responseBody.firstName).toBe('string');
  expect(responseBody.firstName).toBeDefined();
  expect(typeof responseBody.lastName).toBe('string');
  expect(responseBody.lastName).toBeDefined();
  expect(responseBody.roles).toBeDefined();
  expect(responseBody.roles.length).toBeGreaterThan(0);
  expect(responseBody.roles).toEqual(expect.arrayContaining(['ROLE_ADMIN']));
  expect(Array.isArray(responseBody.roles)).toBe(true);
} 
