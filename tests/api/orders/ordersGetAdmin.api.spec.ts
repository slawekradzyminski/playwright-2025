import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getAdminOrders } from '../../../http/ordersClient';
import type { OrderDto, PageDto } from '../../../types/order';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/orders/admin GET API tests', () => {
  test('should return all orders for admin - 200', async ({ request, adminAuth }) => {
    // given
    // when
    const response = await getAdminOrders(request, adminAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: PageDto<OrderDto> = await response.json();
    expect(Array.isArray(responseBody.content)).toBe(true);
  });

  test('should return unauthorized for admin orders request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/orders/admin`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return forbidden for non-admin admin orders request - 403', async ({
    request,
    clientAuth
  }) => {
    // given
    // when
    const response = await getAdminOrders(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
  });
});
