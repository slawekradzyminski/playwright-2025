import { test, expect, APIResponse } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { registerClient } from '../../httpclients/registerClient';

test.describe('/api/v1/users/signin API tests', () => {
  test('should successfully register new user - 201', async ({ request }) => {
    // given
    const randomUser = generateUser();

    // when
    const response = await registerClient.postRegister(request, randomUser);

    // then
    expect(response.status()).toBe(201);
  });

}); 
