import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { cancelOrder } from '../../../http/ordersClient';
import type { OrderDto } from '../../../types/order';
import { test } from '../../fixtures/auth.fixture';
import { createPendingOrder } from '../helpers/orderTestUtils';

test.describe('/api/orders/{id}/cancel POST API tests', () => {
  test('should cancel order - 200', async ({ request, authenticatedUser }) => {
    // given
    const createdOrder = await createPendingOrder(request, authenticatedUser.jwtToken);

    // when
    const response = await cancelOrder(request, authenticatedUser.jwtToken, createdOrder.id);

    // then
    expect(response.status()).toBe(200);
    const responseBody: OrderDto = await response.json();
    expect(responseBody.status).toBe('CANCELLED');
  });

  test('should return error when order cannot be cancelled - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const createdOrder = await createPendingOrder(request, authenticatedUser.jwtToken);
    const firstCancel = await cancelOrder(request, authenticatedUser.jwtToken, createdOrder.id);
    expect(firstCancel.status()).toBe(200);

    // when
    const response = await cancelOrder(request, authenticatedUser.jwtToken, createdOrder.id);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Order cannot be cancelled in current status' });
  });

  test('should return unauthorized for cancel order without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/api/orders/1/cancel`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for order that does not exist - 404', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await cancelOrder(request, authenticatedUser.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Order not found' });
  });
});
