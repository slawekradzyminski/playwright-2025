import { test, expect } from '@playwright/test';
import { generateUser } from '../../../generators/userGenerator';
import type { UserRegisterDto } from '../../../types/user';
import { seedFakerForTest } from '../../../utils/fakerSeed';
import { signupRequest } from '../../../http/users/signupRequest';

type RegisterValidationField = keyof UserRegisterDto;
type RegisterValidationErrorResponse = Partial<Record<RegisterValidationField, string>>;

test.describe('/users/signup API tests', () => {
  test.beforeEach(({}, testInfo) => {
    const seed = seedFakerForTest(testInfo.parallelIndex, testInfo.testId);
    console.log(`[faker-seed] worker=${testInfo.parallelIndex} test=${testInfo.testId} seed=${seed}`);
  });

  test('should successfully register a new user - 201', async ({ request }) => {
    // given
    const signupData = generateUser();

    // when
    const response = await signupRequest(request, signupData);

    // then
    expect(response.status()).toBe(201);
    expect(response.ok()).toBe(true);
    const responseBody = await response.text();
    expect(responseBody.trim()).toBe('');
  });

  test('should return complete validation errors for fully invalid payload - 400', async ({
    request,
  }) => {
    // given
    const invalidSignupData: UserRegisterDto = {
      username: 'abc',
      email: 'not-an-email',
      password: '1234567',
      firstName: 'abc',
      lastName: 'abc',
      roles: [],
    };

    // when
    const response = await signupRequest(request, invalidSignupData);

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as RegisterValidationErrorResponse;
    expect(responseBody).toEqual({
      username: 'Minimum username length: 4 characters',
      email: 'Email should be valid',
      password: 'Minimum password length: 8 characters',
      firstName: 'Minimum firstName length: 4 characters',
      lastName: 'Minimum lastName length: 4 characters',
      roles: 'At least one role must be specified',
    });
  });

  const validationCases: Array<{
    testName: string;
    overrides: Partial<UserRegisterDto>;
    expectedErrorField: RegisterValidationField;
    expectedErrorMessage: string;
  }> = [
    {
      testName: 'should return validation error for username too short - 400',
      overrides: { username: 'abc' },
      expectedErrorField: 'username',
      expectedErrorMessage: 'Minimum username length: 4 characters',
    },
    {
      testName: 'should return validation error for invalid email - 400',
      overrides: { email: 'invalid-email' },
      expectedErrorField: 'email',
      expectedErrorMessage: 'Email should be valid',
    },
    {
      testName: 'should return validation error for password too short - 400',
      overrides: { password: '1234567' },
      expectedErrorField: 'password',
      expectedErrorMessage: 'Minimum password length: 8 characters',
    },
    {
      testName: 'should return validation error for firstName too short - 400',
      overrides: { firstName: 'abc' },
      expectedErrorField: 'firstName',
      expectedErrorMessage: 'Minimum firstName length: 4 characters',
    },
    {
      testName: 'should return validation error for lastName too short - 400',
      overrides: { lastName: 'abc' },
      expectedErrorField: 'lastName',
      expectedErrorMessage: 'Minimum lastName length: 4 characters',
    },
    {
      testName: 'should return validation error for missing roles - 400',
      overrides: { roles: [] },
      expectedErrorField: 'roles',
      expectedErrorMessage: 'At least one role must be specified',
    },
  ];

  for (const { testName, overrides, expectedErrorField, expectedErrorMessage } of validationCases) {
    test(testName, async ({ request }) => {
      // given
      const signupData = generateUser(overrides);

      // when
      const response = await signupRequest(request, signupData);

      // then
      expect(response.status()).toBe(400);
      expect(response.headers()['content-type']).toContain('application/json');

      const responseBody = (await response.json()) as RegisterValidationErrorResponse;
      expect(responseBody[expectedErrorField]).toBe(expectedErrorMessage);
    });
  }
});
