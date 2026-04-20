import { test, expect } from '@playwright/test';
import { randomUser } from '../../generators/userGenerator';
import type { UserRegisterDto } from '../../types/auth';
import { SignupClient } from '../../httpclients/signupClient';

test.describe('/api/v1/users/signup API tests', () => {
  test('should successfully register new user - 201', async ({ request }) => {
    // given
    const signupClient = new SignupClient(request);
    const userData = randomUser();

    // when
    const response = await signupClient.signup(userData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return error when registering existing user second time - 400', async ({ request }) => {
    // given
    const signupClient = new SignupClient(request);
    const userData = randomUser();

    const firstResponse = await signupClient.signup(userData);
    expect(firstResponse.status()).toBe(201);

    // when
    const response = await signupClient.signup(userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Username is already in use');
  });

  test('should return validation error for username too short - 400', async ({ request }) => {
    // given
    const signupClient = new SignupClient(request);
    const userData: UserRegisterDto = {
      ...randomUser(),
      username: 'abc'
    };

    // when
    const response = await signupClient.signup(userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for password too short - 400', async ({ request }) => {
    // given
    const signupClient = new SignupClient(request);
    const userData: UserRegisterDto = {
      ...randomUser(),
      password: 'short'
    };

    // when
    const response = await signupClient.signup(userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.password).toBe('Minimum password length: 8 characters');
  });

  test('should return validation error for invalid email - 400', async ({ request }) => {
    // given
    const signupClient = new SignupClient(request);
    const userData: UserRegisterDto = {
      ...randomUser(),
      email: 'invalid-email'
    };

    // when
    const response = await signupClient.signup(userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.email).toBe('Email should be valid');
  });
});
