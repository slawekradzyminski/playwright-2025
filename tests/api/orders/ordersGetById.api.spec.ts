import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getOrderById } from '../../../http/ordersClient';
import type { OrderDto } from '../../../types/order';
import { test } from '../../fixtures/auth.fixture';
import { createPendingOrder } from '../helpers/orderTestUtils';

test.describe('/api/orders/{id} GET API tests', () => {
  test('should return order by id - 200', async ({ request, clientAuth }) => {
    // given
    const createdOrder = await createPendingOrder(request, clientAuth.jwtToken);

    // when
    const response = await getOrderById(request, clientAuth.jwtToken, createdOrder.id);

    // then
    expect(response.status()).toBe(200);
    const responseBody: OrderDto = await response.json();
    expect(responseBody.id).toBe(createdOrder.id);
  });

  test('should return unauthorized for get order by id without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/orders/1`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for order that does not exist - 404', async ({
    request,
    clientAuth
  }) => {
    // given
    // when
    const response = await getOrderById(request, clientAuth.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Order not found' });
  });
});
