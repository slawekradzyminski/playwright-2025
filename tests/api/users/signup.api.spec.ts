import { test, expect } from '@playwright/test';
import type { SignupDto } from '../../../types/auth';
import { LoginClient } from '../../../httpclients/loginClient';
import { SignupClient } from '../../../httpclients/signupClient';
import { generateUser } from '../../../generators/userGenerator';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('/api/v1/users/signup API tests', () => {
  let signupClient: SignupClient;
  let loginClient: LoginClient;

  test.beforeEach(async ({ request }) => {
    signupClient = new SignupClient(request, APP_BASE_URL);
    loginClient = new LoginClient(request, APP_BASE_URL);
  });

  test('should register a new user that can authenticate - 201 and 200', async () => {
    // given
    const user = generateUser();

    // when
    const signupResponse = await signupClient.signup(user);
    const loginResponse = await loginClient.login({ username: user.username, password: user.password });

    // then
    expect(signupResponse.status()).toBe(201);
    expect(await signupResponse.text()).toBe('');
    expect(loginResponse.status()).toBe(200);
  });

  test('should return validation error for duplicate username - 400', async () => {
    // given
    const existingUser = generateUser();
    const newUserWithSameUsername = {
      ...generateUser(),
      username: existingUser.username
    };

    // when
    const createUserResponse = await signupClient.signup(existingUser);
    const duplicateUsernameResponse = await signupClient.signup(newUserWithSameUsername);

    // then
    expect(createUserResponse.status()).toBe(201);
    expect(duplicateUsernameResponse.status()).toBe(400);
    const responseBody = await duplicateUsernameResponse.json();
    expect(responseBody.message).toBe('Username is already in use');
  });

  test('should return validation error for duplicate email - 400', async () => {
    // given
    const existingUser = generateUser();
    const newUserWithSameEmail = {
      ...generateUser(),
      email: existingUser.email
    };

    // when
    const createUserResponse = await signupClient.signup(existingUser);
    const duplicateEmailResponse = await signupClient.signup(newUserWithSameEmail);

    // then
    expect(createUserResponse.status()).toBe(201);
    expect(duplicateEmailResponse.status()).toBe(400);
    const responseBody = await duplicateEmailResponse.json();
    expect(responseBody.message).toBe('Email is already in use');
  });

  test('should return validation error for missing required fields - 400', async () => {
    // when
    const response = await signupClient.signup({} as SignupDto);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.username).toBe('Username is required');
    expect(responseBody.email).toBe('Email is required');
    expect(responseBody.password).toBe('Password is required');
    expect(responseBody.firstName).toBe('firstName is required');
    expect(responseBody.lastName).toBe('lastName is required');
  });

  test('should return validation errors for invalid field values - 400', async () => {
    // when
    const user = generateUser();
    const response = await signupClient.signup({
      ...user,
      email: 'not-an-email',
    });

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.email).toBe('Email should be valid');
  });

});
