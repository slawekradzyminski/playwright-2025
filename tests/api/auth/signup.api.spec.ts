import { expect, test } from '@playwright/test';
import { createUser } from '../../../generators/userGenerator';
import { attemptSignup } from '../../../http/signupClient';

test.describe('/users/signup API tests', () => {
  test('should successfully create user account - 201', async ({ request }) => {
    // given
    const userData = createUser();

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');
  });

  test('should return validation error for short username - 400', async ({ request }) => {
    // given
    const userData = createUser({ username: 'abc' });

    // when
    const response = await attemptSignup(request, userData);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      username: 'Minimum username length: 4 characters'
    });
  });

  test('should return error for username that already exists - 400', async ({ request }) => {
    // given
    const existingUser = createUser();
    const firstResponse = await attemptSignup(request, existingUser);
    expect(firstResponse.status()).toBe(201);
    const duplicateUser = createUser({ username: existingUser.username });

    // when
    const response = await attemptSignup(request, duplicateUser);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      message: 'Username is already in use'
    });
  });
});
