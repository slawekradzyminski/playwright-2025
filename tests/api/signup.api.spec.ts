import { test, expect } from '@playwright/test';
import type { UserRegisterDto } from '../../types/auth';
import { attemptSignup } from '../../http/signupRequest';
import { generateClientUser } from '../../generators/userGenerator';
import { faker } from '@faker-js/faker';

test.describe('/users/signup API tests', () => {
  test('should successfully create a new user with valid data - 201', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser();

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should successfully create user with both roles - 201', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      roles: ['ROLE_CLIENT', 'ROLE_ADMIN']
    });

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for duplicate username - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      username: faker.internet.username()
    });
    const initialResponse = await attemptSignup(request, userData);
    expect(initialResponse.status()).toBe(201);
    const userDataWithDuplicateUsername: UserRegisterDto = generateClientUser({
      username: userData.username
    });

    // when
    const duplicateResponse = await attemptSignup(request, userDataWithDuplicateUsername);

    // then
    expect(duplicateResponse.status()).toBe(400);
    const duplicateResponseBody = await duplicateResponse.json();
    expect(duplicateResponseBody.message).toBe('Username is already in use');
  });

  test('should return validation error for duplicate email - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      email: faker.internet.email()
    });
    const initialResponse = await attemptSignup(request, userData);
    expect(initialResponse.status()).toBe(201);
    const userDataWithDuplicateEmail: UserRegisterDto = generateClientUser({
      email: userData.email
    });

    // when
    const duplicateResponse = await attemptSignup(request, userDataWithDuplicateEmail);

    // then
    expect(duplicateResponse.status()).toBe(400);
    const duplicateResponseBody = await duplicateResponse.json();
    expect(duplicateResponseBody.message).toBe('Email is already in use');
  });

  test('should return validation error for short username - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      username: 'abc'
    });

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for short password - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      password: 'abc'
    });

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.password).toBe('Minimum password length: 8 characters');
  });

  test('should return validation error for missing roles - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      roles: []
    });

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.roles).toBe('At least one role must be specified');
  });

  test('should return validation error for invalid email format - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser({
      email: 'invalid-email'
    });

    // when
    const response = await attemptSignup(request, userData);

    // then

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.email).toBe('Email should be valid');
  });

});

