import { test, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
import { API_BASE_URL } from '../../http/constants';
import { login } from '../../http/loginClient';


test.describe('/users/signin API tests', () => {
  test('should successfully authenticate with valid credentials - 200', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    const response = await login(request, loginData);

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: LoginResponseDto = await response.json();
    expect(responseBody.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(responseBody.username).toBe(loginData.username);
    expect(responseBody.email).toBeDefined();
    expect(responseBody.firstName).toBeDefined();
    expect(responseBody.lastName).toBeDefined();
    expect(Array.isArray(responseBody.roles)).toBe(true);
  });

  test('should return validation error for empty username - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: '',
      password: 'admin'
    };

    // when
    const response = await login(request, loginData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return authentication error for invalid credentials - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'wronguser',
      password: 'wrongpassword'
    };

    // when
    const response = await login(request, loginData);

    // then
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });
}); 