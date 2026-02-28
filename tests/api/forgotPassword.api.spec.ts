import { test, expect } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import type { ForgotPasswordRequestDto, ForgotPasswordResponseDto, UserRegisterDto } from '../../types/auth';
import { expectAnyNonEmptyErrorMessage } from '../../utils/api/errorUtil';
import { forgotPasswordRequest } from './http/forgotPasswordRequest';
import { signupRequest } from './http/signupRequest';

type ValidationErrorResponse = Partial<Record<keyof ForgotPasswordRequestDto, string>>;

test.describe('/users/password/forgot API tests', () => {
  test('should start password reset flow for existing user - 202', async ({ request }) => {
    // given
    const userData = generateUser();
    const signupResponse = await signupRequest(request, userData);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await forgotPasswordRequest(request, { identifier: userData.username });

    // then
    expect(response.status()).toBe(202);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ForgotPasswordResponseDto;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message.length).toBeGreaterThan(0);
  });

  test('should return validation error for missing identifier - 400', async ({ request }) => {
    // when
    const response = await forgotPasswordRequest(request, {
      identifier: '',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ValidationErrorResponse;
    expect(typeof responseBody.identifier).toBe('string');
    expect(responseBody.identifier).toBeTruthy();
  });

  test('should return validation error for invalid resetBaseUrl - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateUser();
    const signupResponse = await signupRequest(request, userData);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await forgotPasswordRequest(request, {
      identifier: userData.email,
      resetBaseUrl: 'not-a-valid-url',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as Record<string, unknown>;
    expectAnyNonEmptyErrorMessage(responseBody);
  });
});
