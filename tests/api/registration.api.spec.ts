import { test, expect } from '@playwright/test';
import { attemptRegistration } from '../../http/registrationClient';
import { generateUserData, generateInvalidUserData } from '../../generators/userGenerator';

test.describe('/users/signup API tests', () => {
  test('should successfully register a new user with ROLE_CLIENT - 201', async ({ request }) => {
    // given
    const registerData = generateUserData(['ROLE_CLIENT']);

    // when
    const response = await attemptRegistration(request, registerData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should successfully register a new user with ROLE_ADMIN - 201', async ({ request }) => {
    // given
    const registerData = generateUserData(['ROLE_ADMIN']);

    // when
    const response = await attemptRegistration(request, registerData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should successfully register a new user with multiple roles - 201', async ({ request }) => {
    // given
    const registerData = generateUserData(['ROLE_ADMIN', 'ROLE_CLIENT']);

    // when
    const response = await attemptRegistration(request, registerData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for username too short - 400', async ({ request }) => {
    // given
    const registerData = generateInvalidUserData.withShortUsername();

    // when
    const response = await attemptRegistration(request, registerData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toContain('Minimum username length: 4 characters');
  });

  test('should return validation error for invalid email format - 400', async ({ request }) => {
    // given
    const registerData = generateInvalidUserData.withInvalidEmail();

    // when
    const response = await attemptRegistration(request, registerData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.email).toBe('Email should be valid');
  });

  // should fail to register a user which already exists
  test('should fail to register a user which already exists - 400', async ({ request }) => {
    // given
    const registerData = generateUserData(['ROLE_CLIENT']);
    await attemptRegistration(request, registerData);

    // when
    const response = await attemptRegistration(request, registerData);  

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toContain('Username is already in use');
  });
});
