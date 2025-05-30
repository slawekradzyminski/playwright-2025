import { test, expect } from '../../fixtures/auth.fixtures';
import type { PageDtoOrderDto } from '../../types/orders';
import { getOrders } from '../../http/getOrders';
import { API_BASE_URL } from '../../constants/config';
import { validateOrdersPage } from '../../validators/orderValidator';

test.describe('/api/orders API tests', () => {
  test('should successfully get user orders - 200', async ({ request, authToken }) => {
    // when
    const response = await getOrders(request, authToken);

    // then
    expect(response.status()).toBe(200);
    const ordersPage: PageDtoOrderDto = await response.json();
    validateOrdersPage(ordersPage);
  });

  test('should return 401 for invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await getOrders(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 401 for missing token - 401', async ({ request }) => {
    // when
    const response = await request.get(`${API_BASE_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });
}); 