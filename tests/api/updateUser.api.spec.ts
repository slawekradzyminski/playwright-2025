import { test, expect } from '../../fixtures/apiAuthFixture';
import { APIResponse } from '@playwright/test';
import type { UserEditDto, UserEntity } from '../../types/auth';
import { updateUser } from '../../http/updateUserRequest';
import { generateClientUser, generateValidEditUserBody } from '../../generators/userGenerator';
import { INVALID_TOKEN } from '../../config/constants';
import { attemptSignup } from '../../http/signupRequest';

test.describe('/users/{username} PUT API tests', () => {
  test('client should be able to edit own user - 200', async ({ request, clientAuth }) => {
    // given
    const updateData = generateValidEditUserBody();

    // when
    const response = await updateUser(request, clientAuth.userData.username, updateData, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    await validateUserEntityResponse(response, updateData);
  });

  test('admin should be able to edit any user - 200', async ({ request, adminAuth }) => {
    // given
    const clientUser = generateClientUser();
    const signupResponse = await attemptSignup(request, clientUser);
    expect(signupResponse.status()).toBe(201);
    const updateData = generateValidEditUserBody();

    // when
    const response = await updateUser(request, clientUser.username, updateData, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    await validateUserEntityResponse(response, updateData);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // given
    const clientUser = generateClientUser();
    const signupResponse = await attemptSignup(request, clientUser);
    expect(signupResponse.status()).toBe(201);
    const updateData = generateValidEditUserBody();

    // when
    const response = await updateUser(request, clientUser.username, updateData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given
    const clientUser = generateClientUser();
    const signupResponse = await attemptSignup(request, clientUser);
    expect(signupResponse.status()).toBe(201);
    const updateData = generateValidEditUserBody();

    // when
    const response = await updateUser(request, clientUser.username, updateData, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when client updates another user - 403', async ({ request, clientAuth }) => {
    // given
    const clientUser = generateClientUser();
    const signupResponse = await attemptSignup(request, clientUser);
    expect(signupResponse.status()).toBe(201);
    const updateData = generateValidEditUserBody();

    // when
    const response = await updateUser(request, clientUser.username, updateData, clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for non-existent user - 404', async ({ request, adminAuth }) => {
    // given
    const updateData = generateValidEditUserBody();

    // when
    const response = await updateUser(request, 'nonexistentuser123456', updateData, adminAuth.token);

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

