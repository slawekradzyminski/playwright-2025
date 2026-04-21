import { expect, test } from '@playwright/test';
import { randomUser } from '../../../generators/userGenerator';
import { expectErrorMessage, expectJsonResponse } from '../../../helpers/apiAssertions';
import { SignupClient } from '../../../httpclients/signupClient';
import type { UserRegisterDto } from '../../../types/auth';

test.describe('/api/v1/users/signup API tests', () => {
  let signupClient: SignupClient;

  test.beforeEach(async ({ request }) => {
    signupClient = new SignupClient(request);
  });

  test('should successfully register new user - 201', async () => {
    // given
    const userData = randomUser();

    // when
    const response = await signupClient.signup(userData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return error when registering existing user second time - 400', async () => {
    // given
    const userData = randomUser();

    const firstResponse = await signupClient.signup(userData);
    expect(firstResponse.status()).toBe(201);

    // when
    const response = await signupClient.signup(userData);

    // then
    await expectErrorMessage(response, 400, 'Username is already in use');
  });

  test('should return validation error for username too short - 400', async () => {
    // given
    const userData: UserRegisterDto = {
      ...randomUser(),
      username: 'abc'
    };

    // when
    const response = await signupClient.signup(userData);

    // then
    const responseBody = await expectJsonResponse<{ username: string }>(response, 400);
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

  test('should return validation error for password too short - 400', async () => {
    // given
    const userData: UserRegisterDto = {
      ...randomUser(),
      password: 'short'
    };

    // when
    const response = await signupClient.signup(userData);

    // then
    const responseBody = await expectJsonResponse<{ password: string }>(response, 400);
    expect(responseBody.password).toBe('Minimum password length: 8 characters');
  });

  test('should return validation error for invalid email - 400', async () => {
    // given
    const userData: UserRegisterDto = {
      ...randomUser(),
      email: 'invalid-email'
    };

    // when
    const response = await signupClient.signup(userData);

    // then
    const responseBody = await expectJsonResponse<{ email: string }>(response, 400);
    expect(responseBody.email).toBe('Email should be valid');
  });
});
