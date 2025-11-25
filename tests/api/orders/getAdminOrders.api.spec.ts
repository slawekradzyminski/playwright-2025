import { test, expect } from '../../../fixtures/apiAuthFixture';
import { getAdminOrders } from '../../../http/orders/getAdminOrdersRequest';
import { updateOrderStatus } from '../../../http/orders/updateOrderStatusRequest';
import type { PageDtoOrderDto } from '../../../types/orders';
import { placeOrderForClient } from './helpers/orderTestUtils';

test.describe('GET /api/orders/admin API tests', () => {
  test('admin should retrieve all orders - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await getAdminOrders(request, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: PageDtoOrderDto = await response.json();
    expect(Array.isArray(responseBody.content)).toBe(true);
    expect(responseBody.pageNumber).toBe(0);
    expect(responseBody.totalElements).toBeGreaterThan(0);
  });

  test('admin should filter orders by status - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    const updateResponse = await updateOrderStatus(request, order.id, 'SHIPPED', adminAuth.token);
    expect(updateResponse.status()).toBe(200);

    // when
    const response = await getAdminOrders(request, adminAuth.token, { status: 'SHIPPED' });

    // then
    expect(response.status()).toBe(200);
    const responseBody: PageDtoOrderDto = await response.json();
    expect(responseBody.content.length).toBeGreaterThanOrEqual(1);
    expect(responseBody.content.every((entry) => entry.status === 'SHIPPED')).toBe(true);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await getAdminOrders(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden for client token - 403', async ({ request, clientAuth }) => {
    // when
    const response = await getAdminOrders(request, clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });
});
