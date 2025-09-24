import { test, expect } from '@playwright/test';
import type { UserRegisterDto } from '../../types/auth';
import { attemptSignup } from '../../http/signupClient';
import { generateAdmin, generateClient } from '../../generator/userGenerator';

test.describe('/users/signup API tests', () => {
  test('should successfully create admin user - 201', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = generateAdmin();

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should successfully create client user - 201', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = generateClient();

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for short username - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = {
      ...generateClient(),
      username: 'abc' // Less than 4 characters
    };

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('username');
  });

  test('should return validation error for short password - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = {
      ...generateClient(),
      password: '1234567' // Less than 8 characters
    };

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('password');
  });

  test('should return validation error for short firstName - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = {
      ...generateClient(),
      firstName: 'abc' // Less than 4 characters
    };

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('firstName');
  });

  test('should return validation error for short lastName - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = {
      ...generateClient(),
      lastName: 'abc' // Less than 4 characters
    };

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('lastName');
  });

  test('should return validation error for invalid email - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = {
      ...generateClient(),
      email: 'invalid-email'
    };

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('email');
  });

  test('should return validation error for missing required fields - 400', async ({ request }) => {
    // given
    const signupData = {
      username: 'testuser'
      // Missing other required fields
    } as UserRegisterDto;

    // when
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return validation error for duplicate username - 400', async ({ request }) => {
    // given
    const signupData: UserRegisterDto = generateClient();
    
    // Create user first
    await attemptSignup(request, signupData);

    // when - Try to create the same user again
    const response = await attemptSignup(request, signupData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Username is already in use');
  });
});
