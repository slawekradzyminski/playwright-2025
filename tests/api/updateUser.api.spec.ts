import { test, expect, APIResponse } from '@playwright/test';
import type { UserEditDto, UserEntity, UserRegisterDto } from '../../types/auth';
import { attemptLogin } from '../../http/loginRequest';
import { attemptSignup } from '../../http/signupRequest';
import { updateUser } from '../../http/updateUserRequest';
import { generateClientUser } from '../../generators/userGenerator';
import { faker } from '@faker-js/faker';
import { INVALID_TOKEN } from '../../config/constants';

test.describe('/users/{username} PUT API tests', () => {
  test('should successfully update user with valid data - 200', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateClientUser();
    const signupResponse = await attemptSignup(request, userData);
    expect(signupResponse.status()).toBe(201);
    
    const loginResponse = await attemptLogin(request, { username: userData.username, password: userData.password });
    const loginBody = await loginResponse.json();
    const token = loginBody.token;

    const updateData: UserEditDto = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName()
    };

    // when
    const response = await updateUser(request, userData.username, updateData, token);

    // then
    expect(response.status()).toBe(200);
    await validateUserEntityResponse(response, updateData);
  });

  test('should allow admin to update any user - 200', async ({ request }) => {
    // given
    const clientUser: UserRegisterDto = generateClientUser();
    const signupResponse = await attemptSignup(request, clientUser);
    expect(signupResponse.status()).toBe(201);
    
    const adminLoginResponse = await attemptLogin(request, { username: 'admin', password: 'admin' });
    const adminLoginBody = await adminLoginResponse.json();
    const adminToken = adminLoginBody.token;

    const updateData: UserEditDto = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName()
    };

    // when
    const response = await updateUser(request, clientUser.username, updateData, adminToken);

    // then
    expect(response.status()).toBe(200);
    await validateUserEntityResponse(response, updateData);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // given
    const updateData: UserEditDto = {
      email: faker.internet.email()
    };

    // when
    const response = await updateUser(request, 'admin', updateData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given
    const updateData: UserEditDto = {
      email: faker.internet.email()
    };

    // when
    const response = await updateUser(request, 'admin', updateData, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when client updates another user - 403', async ({ request }) => {
    // given
    const clientUser: UserRegisterDto = generateClientUser();
    const signupResponse = await attemptSignup(request, clientUser);
    expect(signupResponse.status()).toBe(201);
    
    const loginResponse = await attemptLogin(request, { username: clientUser.username, password: clientUser.password });
    const loginBody = await loginResponse.json();
    const token = loginBody.token;

    const updateData: UserEditDto = {
      email: faker.internet.email()
    };

    // when
    const response = await updateUser(request, 'admin', updateData, token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for non-existent user - 404', async ({ request }) => {
    // given
    const loginResponse = await attemptLogin(request, { username: 'admin', password: 'admin' });
    const loginBody = await loginResponse.json();
    const token = loginBody.token;

    const updateData: UserEditDto = {
      email: faker.internet.email()
    };

    // when
    const response = await updateUser(request, 'nonexistentuser123456', updateData, token);

    // then
    expect(response.status()).toBe(404);
  });
});

const validateUserEntityResponse = async (response: APIResponse, expectedData: UserEditDto) => {
  const responseBody: UserEntity = await response.json();
  
  expect(typeof responseBody.id).toBe('number');
  expect(typeof responseBody.username).toBe('string');
  expect(responseBody.email).toBe(expectedData.email);
  expect(Array.isArray(responseBody.roles)).toBe(true);
  expect(responseBody.roles.length).toBeGreaterThan(0);
  
  if (expectedData.firstName) {
    expect(responseBody.firstName).toBe(expectedData.firstName);
  }
  
  if (expectedData.lastName) {
    expect(responseBody.lastName).toBe(expectedData.lastName);
  }
};

