import type { APIRequestContext } from '@playwright/test';
import { test, expect } from '../../../fixtures/apiAuthFixture';
import { cancelOrder } from '../../../http/orders/cancelOrderRequest';
import { placeOrderForClient } from './helpers/orderTestUtils';
import { attemptSignup } from '../../../http/users/signupRequest';
import { attemptLogin } from '../../../http/users/loginRequest';
import { generateClientUser } from '../../../generators/userGenerator';
import type { LoginResponseDto, UserRegisterDto } from '../../../types/auth';

const createAnotherClientToken = async (request: APIRequestContext): Promise<string> => {
  const newUser: UserRegisterDto = generateClientUser();
  const signupResponse = await attemptSignup(request, newUser);
  expect(signupResponse.status()).toBe(201);

  const loginResponse = await attemptLogin(request, {
    username: newUser.username,
    password: newUser.password
  });
  expect(loginResponse.status()).toBe(200);
  const loginBody: LoginResponseDto = await loginResponse.json();

  return loginBody.token;
};

test.describe('POST /api/orders/{id}/cancel API tests', () => {
  test('client should cancel pending order - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await cancelOrder(request, order.id, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
  });

  test('client should not cancel order twice - 400', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    const firstResponse = await cancelOrder(request, order.id, clientAuth.token);
    expect(firstResponse.status()).toBe(200);

    // when
    const response = await cancelOrder(request, order.id, clientAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized when token is missing - 401', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await cancelOrder(request, order.id);

    // then
    expect(response.status()).toBe(401);
  });

  test.fixme('should return forbidden when canceling another clients order - 403', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    const otherClientToken = await createAnotherClientToken(request);

    // when
    const response = await cancelOrder(request, order.id, otherClientToken);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for missing order - 404', async ({ request, clientAuth }) => {
    // when
    const response = await cancelOrder(request, 999999, clientAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});
