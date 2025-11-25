import type { APIRequestContext } from '@playwright/test';
import { test, expect } from '../../fixtures/apiAuthFixture';
import { getOrderById } from '../../http/getOrderByIdRequest';
import { placeOrderForClient } from './helpers/orderTestUtils';
import { attemptSignup } from '../../http/signupRequest';
import { attemptLogin } from '../../http/loginRequest';
import { generateClientUser } from '../../generators/userGenerator';
import type { LoginResponseDto, UserRegisterDto } from '../../types/auth';
import type { OrderDto } from '../../types/orders';

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

test.describe('GET /api/orders/{id} API tests', () => {
  test('client should retrieve their order - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await getOrderById(request, order.id, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: OrderDto = await response.json();
    expect(responseBody.id).toBe(order.id);
    expect(responseBody.username).toBe(clientAuth.userData.username);
    expect(responseBody.items.length).toBe(order.items.length);
  });

  test('admin should retrieve client order - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await getOrderById(request, order.id, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: OrderDto = await response.json();
    expect(responseBody.id).toBe(order.id);
    expect(responseBody.username).toBe(clientAuth.userData.username);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await getOrderById(request, 1);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found when another client accesses the order - 404', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    const otherClientToken = await createAnotherClientToken(request);

    // when
    const response = await getOrderById(request, order.id, otherClientToken);

    // then
    expect(response.status()).toBe(404);
  });

  test('should return not found for non-existent order - 404', async ({ request, clientAuth }) => {
    // given
    const missingOrderId = 999999;

    // when
    const response = await getOrderById(request, missingOrderId, clientAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});
