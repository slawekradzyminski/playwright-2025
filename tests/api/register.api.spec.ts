import { test, expect } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import { RegisterDto } from '../../types/auth';
import { generateRandomUser } from '../../generators/userGenerator';

const USERS_SIGNUP = '/users/signup';

test.describe('/users/signup API tests', () => {
  test('should successfully register a new user - 201', async ({ request }) => {
    // given
    const registerData: RegisterDto = generateRandomUser();

    // when
    const response = await request.post(`${API_BASE_URL}${USERS_SIGNUP}`, {
      data: registerData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(201);
    const responseBody = await response.text();
    expect(responseBody).toEqual('');
  });

  test('should return validation error for too short username - 400', async ({ request }) => {
    // given
    const registerData: RegisterDto = generateRandomUser();
    registerData.username = 'abc';

    // when
    const response = await request.post(`${API_BASE_URL}${USERS_SIGNUP}`, {
      data: registerData,
      headers: {
        'Content-Type': 'application/json'

      }
    });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });
});