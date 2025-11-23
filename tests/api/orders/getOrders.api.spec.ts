import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { PageDtoOrderDto } from '../../../types/order';
import { getOrders, getOrdersWithoutAuth } from '../../../http/orders/getOrdersRequest';
import { createOrderForClient } from './orderTestHelper';

test.describe('GET /api/orders API tests', () => {
  test('should retrieve authenticated user orders - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await getOrders(request, clientToken);

    // then
    expect(response.status()).toBe(200);
    const body: PageDtoOrderDto = await response.json();
    expect(body.content.length).toBeGreaterThan(0);
    const retrievedOrder = body.content.find(({ id }) => id === order.id);
    expect(retrievedOrder).toBeTruthy();
    expect(retrievedOrder?.status).toBe(order.status);
    expect(retrievedOrder?.totalAmount).toBe(order.totalAmount);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given / when
    const response = await getOrdersWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });
});
