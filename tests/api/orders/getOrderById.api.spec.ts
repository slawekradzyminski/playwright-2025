import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { OrderDto } from '../../../types/order';
import { getOrderById, getOrderByIdWithoutAuth } from '../../../http/orders/getOrderByIdRequest';
import { createOrderForClient } from './orderTestHelper';

test.describe('GET /api/orders/{id} API tests', () => {
  test('should retrieve order by id - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await getOrderById(request, clientToken, order.id);

    // then
    expect(response.status()).toBe(200);
    const body: OrderDto = await response.json();
    expect(body.id).toBe(order.id);
    expect(body.totalAmount).toBe(order.totalAmount);
    expect(body.items.length).toBe(order.items.length);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await getOrderByIdWithoutAuth(request, order.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent order id - 404', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const nonExistentOrderId = 999999;

    // when
    const response = await getOrderById(request, token, nonExistentOrderId);

    // then
    expect(response.status()).toBe(404);
  });
});
