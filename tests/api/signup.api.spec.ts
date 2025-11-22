import { test, expect } from '@playwright/test';
import type { UserRegisterDto } from '../../types/auth';
import { attemptSignup } from '../../http/signupRequest';
import { generateRandomClientUser } from '../../generators/userGenerator';

test.describe('/users/signup API tests', () => {
  test('should successfully create a new user with valid data - 201', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateRandomClientUser();

    // when
    const response = await attemptSignup(request, userData);
    
    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for invalid data - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = {
      ...generateRandomClientUser(),
      username: 'abc'
    };

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for duplicate username - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateRandomClientUser();
    await attemptSignup(request, userData);

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Username is already in use');
  });

});

