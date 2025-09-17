import { test, expect } from '@playwright/test';
import type { UserRegisterDto } from '../../types/auth';
import { attemptSignup } from '../../http/signupClient';
import { randomClient } from '../../generators/userGenerator';

test.describe('/users/signup API tests', () => {
  test('should successfully create account with valid data - 201', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = randomClient();

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for missing password - 400', async ({ request }) => {
    // given
    const signupData = randomClient();
    const invalidSignupData = {
      ...signupData,
      password: ''
    };

    // when
    const response = await attemptSignup(request, invalidSignupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.password).toBe('Minimum password length: 8 characters');
  });

  test('should return error for duplicate username - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = randomClient();
    await attemptSignup(request, signupData);
    
    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Username is already in use');
  });
});

