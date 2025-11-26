import { test, expect } from '../../../fixtures/apiAuthFixture';
import { getOrders } from '../../../http/orders/getOrdersRequest';
import { updateOrderStatus } from '../../../http/orders/updateOrderStatusRequest';
import type { PageDtoOrderDto } from '../../../types/orders';
import { placeOrderForClient } from '../../helpers';

test.describe('GET /api/orders API tests', () => {
  test('client should retrieve their orders - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await getOrders(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: PageDtoOrderDto = await response.json();
    expect(responseBody.content.length).toBe(2);
    expect(responseBody.content.every((order) => order.username === clientAuth.userData.username)).toBe(true);
    expect(responseBody.totalElements).toBeGreaterThanOrEqual(2);
    expect(responseBody.pageNumber).toBe(0);
  });

  test('client should filter orders by status - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    const { order: paidOrder } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);
    const updateResponse = await updateOrderStatus(request, paidOrder.id, 'PAID', adminAuth.token);
    expect(updateResponse.status()).toBe(200);

    // when
    const response = await getOrders(request, clientAuth.token, { status: 'PAID' });

    // then
    expect(response.status()).toBe(200);
    const responseBody: PageDtoOrderDto = await response.json();
    expect(responseBody.content.length).toBeGreaterThanOrEqual(1);
    expect(responseBody.content.every((order) => order.status === 'PAID')).toBe(true);
    expect(responseBody.content.every((order) => order.username === clientAuth.userData.username)).toBe(true);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await getOrders(request);

    // then
    expect(response.status()).toBe(401);
  });
});
