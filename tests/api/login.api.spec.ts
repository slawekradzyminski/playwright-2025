import { test, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto, ErrorResponse } from '../../types/auth';

const API_BASE_URL = 'http://localhost:4001';
const SIGNIN_ENDPOINT = '/users/signin';

test.describe('/users/signin API tests', () => {
  test('should successfully authenticate with valid credentials - 200', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    const response = await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: LoginResponseDto = await response.json();
    expect(responseBody.token).toBeDefined();
    expect(responseBody.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(responseBody.username).toBe(loginData.username);
    expect(responseBody.email).toBeDefined();
    expect(responseBody.firstName).toBeDefined();
    expect(responseBody.lastName).toBeDefined();
    expect(responseBody.roles).toBeDefined();
    expect(Array.isArray(responseBody.roles)).toBe(true);
  });

  test('should return validation error for empty username - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: '',
      password: 'admin'
    };

    // when
    const response = await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return authentication error for invalid password - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'wrongpassword'
    };

    // when
    const response = await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });

}); 