import { test, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
import { API_BASE_URL } from '../../config/constants';

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

  test('should return validation error for empty password - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: ''
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
    expect(responseBody.password).toBe('Minimum password length: 4 characters');
  });

  test('should return validation error for username too short - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'abc',
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

  test('should return validation error for password too short - 400', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'abc'
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
    expect(responseBody.password).toBe('Minimum password length: 4 characters');
  });

  test('should return validation error for invalid JSON - 400', async ({ request }) => {
    // given
    const invalidJson = '{"username": "admin", "password":}';

    // when
    const response = await request.post(`${API_BASE_URL}${SIGNIN_ENDPOINT}`, {
      data: invalidJson,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe(400);
    expect(responseBody.message).toContain('Invalid JSON format');
  });

  test('should return authentication error for missing username - 422', async ({ request }) => {
    // given
    const loginData = {
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
    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });

  test('should return authentication error for missing password - 422', async ({ request }) => {
    // given
    const loginData = {
      username: 'admin'
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

  test('should return authentication error for invalid username - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'nonexistentuser',
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

  test('should return authentication error for both invalid credentials - 422', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'wronguser',
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