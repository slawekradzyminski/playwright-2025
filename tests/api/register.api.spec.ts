import { test, expect } from '@playwright/test';
import { RegisterDto, ErrorResponse } from '../../types/auth';
import { API_BASE_URL } from '../../constants/config';
import { getRandomUser } from '../../generators/userGenerator';
import { attemptRegister } from '../../http/postSignUp';

const SIGNUP_ENDPOINT = '/users/signup';

test.describe('/users/signup API tests', () => {
  test('should successfully register a new user - 201', async ({ request }) => {
    // given
    const registerData: RegisterDto = getRandomUser();

    // when
    const response = await attemptRegister(request, registerData);

    // then
    expect(response.status()).toBe(201);
    const responseText = await response.text();
    expect(responseText).toBe('');
  });

  test('should return 400 for too short password - 400', async ({ request }) => {
    // given
    const registerData: RegisterDto = {
      ...getRandomUser(),
      password: 'short'
    };

    // when
    const response = await attemptRegister(request, registerData);

    // then
    expect(response.status()).toBe(400);
    const errorResponse: ErrorResponse = await response.json();
    expect(errorResponse.password).toBeDefined();
    expect(errorResponse.password).toBe('Minimum password length: 8 characters');
  });

  test('should return 400 for existing user - 400', async ({ request }) => {
    // given
    const registerData: RegisterDto = {
      ...getRandomUser(),
      username: 'admin'
    };

    // when
    const response = await attemptRegister(request, registerData);

    // then
    expect(response.status()).toBe(400);
    const errorResponse: ErrorResponse = await response.json();
    expect(errorResponse.message).toBeDefined();
    expect(errorResponse.message).toBe('Username is already in use');
  });

});


