import { test, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
import { loginRequest } from './http/loginRequest';
import {
  getValidCredentials,
  validateCorrectLoginResponse,
} from '../../utils/api/loginUtil';

test.describe('/users/signin API tests', () => {
  test('should successfully authenticate with valid credentials - 200', async ({
    request,
  }) => {
    // given
    const loginData = getValidCredentials();

    // when
    const response = await loginRequest(request, loginData);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as LoginResponseDto;
    validateCorrectLoginResponse(responseBody, loginData);
  });

  const validationCases: Array<{
    testName: string;
    loginData: LoginDto;
    expectedErrorField: 'username' | 'password';
    expectedErrorMessage: string;
  }> = [
    {
      testName: 'should return validation error for empty username - 400',
      loginData: { username: '', password: 'admin' },
      expectedErrorField: 'username',
      expectedErrorMessage: 'Minimum username length: 4 characters',
    },
    {
      testName: 'should return validation error for username too short - 400',
      loginData: { username: 'abc', password: 'admin' },
      expectedErrorField: 'username',
      expectedErrorMessage: 'Minimum username length: 4 characters',
    },
    {
      testName: 'should return validation error for password too short - 400',
      loginData: { username: 'admin', password: 'abc' },
      expectedErrorField: 'password',
      expectedErrorMessage: 'Minimum password length: 4 characters',
    },
  ];

  for (const validationCase of validationCases) {
    test(validationCase.testName, async ({ request }) => {
      // when
      const response = await loginRequest(request, validationCase.loginData);

      // then
      expect(response.status()).toBe(400);
      expect(response.headers()['content-type']).toContain('application/json');
      const responseBody = (await response.json()) as Record<string, string>;
      expect(responseBody[validationCase.expectedErrorField]).toBe(
        validationCase.expectedErrorMessage,
      );
    });
  }

  test('should return authentication error for both invalid credentials - 422', async ({
    request,
  }) => {
    // given
    const loginData: LoginDto = {
      username: 'wronguser',
      password: 'wrongpassword',
    };

    // when
    const response = await loginRequest(request, loginData);

    // then
    expect(response.status()).toBe(422);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as { message: string };
    expect(responseBody.message).toBe('Invalid username/password supplied');
  });
});
