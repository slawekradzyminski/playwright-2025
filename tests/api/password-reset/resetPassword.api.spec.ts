import { test, expect } from '../../fixtures/auth.fixture';
import { generateUser } from '../../../generators/userGenerator';
import type {
  ForgotPasswordResponseDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
} from '../../../types/auth';
import type { UserRegisterDto } from '../../../types/user';
import { expectAnyNonEmptyErrorMessage } from '../../../utils/api/errorUtil';
import { forgotPasswordRequest } from '../../../http/password-reset/forgotPasswordRequest';
import { loginRequest } from '../../../http/users/loginRequest';
import { resetPasswordRequest } from '../../../http/password-reset/resetPasswordRequest';
import { signupRequest } from '../../../http/users/signupRequest';

type ResetValidationField = keyof ResetPasswordRequestDto;
type ResetValidationErrorResponse = Partial<Record<ResetValidationField, string>>;

test.describe('/users/password/reset API tests', () => {
  test('should reset password with valid token and allow login with new password - 200', async ({
    request,
    clientAuth,
  }) => {
    // given
    const forgotResponse = await forgotPasswordRequest(request, {
      identifier: clientAuth.userDetails.username,
    });
    expect(forgotResponse.status()).toBe(202);
    const forgotResponseBody = (await forgotResponse.json()) as ForgotPasswordResponseDto;
    const resetToken = forgotResponseBody.token as string;
    expect(resetToken).toBeTruthy();

    const newPassword = 'newPassword123';

    // when
    const resetResponse = await resetPasswordRequest(request, {
      token: resetToken,
      newPassword,
      confirmPassword: newPassword,
    });

    // then
    expect(resetResponse.status()).toBe(200);

    const loginResponse = await loginRequest(request, {
      username: clientAuth.userDetails.username,
      password: newPassword,
    });
    expect(loginResponse.status()).toBe(200);
    const loginResponseBody = (await loginResponse.json()) as LoginResponseDto;
    expect(loginResponseBody.token).toBeTruthy();
  });

  test('should return error for invalid reset token - 400', async ({ request }) => {
    // when
    const response = await resetPasswordRequest(request, {
      token: 'invalid-reset-token',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  const validationCases: Array<{
    testName: string;
    requestBody: ResetPasswordRequestDto;
    expectedErrorField: ResetValidationField;
  }> = [
    {
      testName: 'should return validation error for missing token - 400',
      requestBody: {
        token: '',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      },
      expectedErrorField: 'token',
    },
    {
      testName: 'should return validation error for short newPassword - 400',
      requestBody: {
        token: 'placeholder-token',
        newPassword: '1234567',
        confirmPassword: '1234567',
      },
      expectedErrorField: 'newPassword',
    },
  ];

  for (const validationCase of validationCases) {
    test(validationCase.testName, async ({ request }) => {
      // given
      const userData: UserRegisterDto = generateUser();
      const signupResponse = await signupRequest(request, userData);
      expect(signupResponse.status()).toBe(201);

      // when
      const response = await resetPasswordRequest(request, validationCase.requestBody);

      // then
      expect(response.status()).toBe(400);
      expect(response.headers()['content-type']).toContain('application/json');
      const responseBody = (await response.json()) as ResetValidationErrorResponse;
      expect(typeof responseBody[validationCase.expectedErrorField]).toBe('string');
      expect(responseBody[validationCase.expectedErrorField]).toBeTruthy();
    });
  }

  test('should return error when confirmPassword does not match - 400', async ({ request }) => {
    // given
    const userData: UserRegisterDto = generateUser();
    const signupResponse = await signupRequest(request, userData);
    expect(signupResponse.status()).toBe(201);

    const forgotResponse = await forgotPasswordRequest(request, {
      identifier: userData.username,
    });
    expect(forgotResponse.status()).toBe(202);
    const forgotResponseBody = (await forgotResponse.json()) as ForgotPasswordResponseDto;
    expect(forgotResponseBody.token).toBeTruthy();

    // when
    const response = await resetPasswordRequest(request, {
      token: forgotResponseBody.token ?? '',
      newPassword: 'newPassword123',
      confirmPassword: 'differentPassword123',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as Record<string, unknown>;
    expectAnyNonEmptyErrorMessage(responseBody);
  });
});
