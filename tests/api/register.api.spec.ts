import { test, expect } from '@playwright/test';
import type { UserRegisterDto } from '../../types/auth';
import { attemptRegistration } from '../../http/registerClient';
import { generateRandomUser } from '../../generators/userGenerator';

test.describe('/users/signup API tests', () => {
  test('should successfully create a new user account with valid data - 201', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateRandomUser();

    // when
    const response = await attemptRegistration(request, userData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for username too short - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = {
      ...generateRandomUser(),
      username: 'abc'
    };

    // when
    const response = await attemptRegistration(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBeDefined();
  });

  test('should return validation error for password too short - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = {
      ...generateRandomUser(),
      password: 'short'
    };

    // when
    const response = await attemptRegistration(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.password).toBeDefined();
  });

  test('should return validation error for invalid email format - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = {
      ...generateRandomUser(),
      email: 'invalid-email'
    };

    // when
    const response = await attemptRegistration(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.email).toBeDefined();
  });

  test('should return validation error for missing roles - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = {
      ...generateRandomUser(),
      roles: []
    };

    // when
    const response = await attemptRegistration(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.roles).toBeDefined();
  });
});

