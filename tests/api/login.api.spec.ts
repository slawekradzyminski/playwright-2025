import { test, expect, APIResponse } from '@playwright/test';
import type { LoginResponseDto } from '../../types/auth';
import { LoginClient } from '../../httpclients/loginClient';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const LOGIN = process.env.LOGIN || '';
const PASSWORD = process.env.PASSWORD || '';

test.describe('/api/v1/users/signin API tests', () => {
  let client: LoginClient;

  test.beforeEach(async ({ request }) => {
    client = new LoginClient(request, APP_BASE_URL);
  });

  test('should successfully authenticate with valid credentials - 200', async () => {
    // when
    const response = await client.login({ username: LOGIN, password: PASSWORD });

    // then
    expect(response.status()).toBe(200);
    assertResponseBody(response);
  });

  test('should return validation error for empty username - 400', async () => {
    // when
    const response = await client.login({ username: '', password: PASSWORD });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for username too short - 400', async () => {
    // when
    const response = await client.login({ username: 'abc', password: PASSWORD });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for password too short - 400', async () => {
    // when
    const response = await client.login({ username: 'admin', password: 'abc' });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.password).toBe('Minimum password length: 4 characters');
  });

  test('should return authentication error for both invalid credentials - 422', async () => {
    // when
    const response = await client.login({ username: 'wronguser', password: 'wrongpassword' });

    // then
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });
});

const assertResponseBody = async (response: APIResponse) => {
  const responseBody: LoginResponseDto = await response.json();
  expect(responseBody.token).toBeDefined();
  expect(responseBody.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  expect(responseBody.username).toBe(LOGIN);
  expect(responseBody.email).toBeDefined();
  expect(responseBody.firstName).toBeDefined();
  expect(responseBody.lastName).toBeDefined();
  expect(responseBody.roles).toBeDefined();
  expect(Array.isArray(responseBody.roles)).toBe(true);
}
