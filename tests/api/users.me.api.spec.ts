import { test, expect, APIResponse } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { registerClient } from '../../httpclients/registerClient';
import { usersMeClient } from '../../httpclients/usersMeClient';
import { loginClient } from '../../httpclients/loginClient';

test.describe('/api/v1/users/me API tests', () => {
  test('should successfully get current user info - 200', async ({ request }) => {
    // given
    const user = generateUser();
    await registerClient.postRegister(request, user);
    const loginResponse = await loginClient.postLogin(request, {
      username: user.username,
      password: user.password
    });
    const loginResponseBody = await loginResponse.json();
    const token = loginResponseBody.token;

    // when
    const response = await usersMeClient.getUserMe(request, token);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: ['ROLE_CLIENT'],
      id: expect.any(Number)
    });

  });

}); 
