import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { OrderDto } from '../../../types/order';
import { cancelOrder, cancelOrderWithoutAuth } from '../../../http/orders/cancelOrderRequest';
import { createOrderForClient } from './orderTestHelper';

test.describe('POST /api/orders/{id}/cancel API tests', () => {
  test('should cancel a pending order - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await cancelOrder(request, clientToken, order.id);

    // then
    expect(response.status()).toBe(200);
    const body: OrderDto = await response.json();
    expect(body.status).toBe('CANCELLED');
  });

  test('should return bad request when cancelling already cancelled order - 400', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);
    const firstResponse = await cancelOrder(request, clientToken, order.id);
    expect(firstResponse.status()).toBe(200);

    // when
    const secondResponse = await cancelOrder(request, clientToken, order.id);

    // then
    expect(secondResponse.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await cancelOrderWithoutAuth(request, order.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent order id - 404', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const nonExistentOrderId = 999999;

    // when
    const response = await cancelOrder(request, token, nonExistentOrderId);

    // then
    expect(response.status()).toBe(404);
  });
});
