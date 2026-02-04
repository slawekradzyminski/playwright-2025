import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { updateOrderStatus } from '../../../http/ordersClient';
import type { OrderDto } from '../../../types/order';
import { test } from '../../fixtures/auth.fixture';
import { createPendingOrder } from './orderTestUtils';

test.describe('/api/orders/{id}/status PUT API tests', () => {
  test('should update order status as admin - 200', async ({ request, authenticatedUser, adminAuth }) => {
    // given
    const createdOrder = await createPendingOrder(request, authenticatedUser.jwtToken);

    // when
    const response = await updateOrderStatus(request, adminAuth.jwtToken, createdOrder.id, 'PAID');

    // then
    expect(response.status()).toBe(200);
    const responseBody: OrderDto = await response.json();
    expect(responseBody.status).toBe('PAID');
  });

  test('should return validation error for invalid status payload - 400', async ({
    request,
    authenticatedUser,
    adminAuth
  }) => {
    // given
    const createdOrder = await createPendingOrder(request, authenticatedUser.jwtToken);

    // when
    const response = await updateOrderStatus(request, adminAuth.jwtToken, createdOrder.id, 'INVALID');

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe(400);
    expect(responseBody.message).toContain('Invalid JSON format');
  });

  test('should return unauthorized for update order status without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.put(`${API_BASE_URL}/api/orders/1/status`, { data: 'PAID' });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return forbidden for non-admin update order status - 403', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const createdOrder = await createPendingOrder(request, authenticatedUser.jwtToken);

    // when
    const response = await updateOrderStatus(
      request,
      authenticatedUser.jwtToken,
      createdOrder.id,
      'PAID'
    );

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
  });

  test('should return not found for order that does not exist - 404', async ({ request, adminAuth }) => {
    // given
    // when
    const response = await updateOrderStatus(request, adminAuth.jwtToken, 999999999, 'PAID');

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Order not found' });
  });
});
