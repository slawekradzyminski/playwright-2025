import { test, expect } from '@playwright/test';
import type { UserRegisterDto, ValidationErrorResponse } from '../../types/user';
import { signup } from '../../http/registrationClient';
import { generateValidUser, generateInvalidUser } from '../../generators/userGenerator';

test.describe('/users/signup API tests', () => {
  test('should successfully create user with valid data - 201', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateValidUser();

    // when
    const response = await signup(request, userData);

    // then
    expect(response.status()).toBe(201);
  });

  test('should return validation error for empty username - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateInvalidUser('username', '');

    // when
    const response = await signup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody: ValidationErrorResponse = await response.json();
    expect(responseBody.username).toBe('Minimum username length: 4 characters');
  });

});
