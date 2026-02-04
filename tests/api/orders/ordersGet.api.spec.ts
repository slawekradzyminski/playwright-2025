import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getOrders } from '../../../http/ordersClient';
import type { OrderDto, PageDto } from '../../../types/order';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/orders GET API tests', () => {
  test('should return user orders - 200', async ({ request, authenticatedUser }) => {
    // given
    // when
    const response = await getOrders(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: PageDto<OrderDto> = await response.json();
    expect(Array.isArray(responseBody.content)).toBe(true);
  });

  test('should return unauthorized for get orders request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/orders`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
