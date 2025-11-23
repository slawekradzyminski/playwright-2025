import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { OrderDto } from '../../../types/order';
import { updateOrderStatus, updateOrderStatusWithoutAuth } from '../../../http/orders/updateOrderStatusRequest';
import { createOrderForClient } from './orderTestHelper';

test.describe('PUT /api/orders/{id}/status API tests', () => {
  test('should update order status as admin - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await updateOrderStatus(request, adminToken, order.id, 'PAID');

    // then
    expect(response.status()).toBe(200);
    const body: OrderDto = await response.json();
    expect(body.status).toBe('PAID');
  });

  test('should return forbidden error when client attempts to update status - 403', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await updateOrderStatus(request, clientToken, order.id, 'PAID');

    // then
    expect(response.status()).toBe(403);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await updateOrderStatusWithoutAuth(request, order.id, 'PAID');

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent order id - 404', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const nonExistentOrderId = 999999;

    // when
    const response = await updateOrderStatus(request, adminToken, nonExistentOrderId, 'PAID');

    // then
    expect(response.status()).toBe(404);
  });
});
