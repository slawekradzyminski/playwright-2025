import { test, expect } from '../../fixtures/auth.fixtures';
import type { CartDto } from '../../types/cart';
import { getCart } from '../../http/getCart';
import { API_BASE_URL } from '../../constants/config';
import { validateCart } from '../../validators/cartValidator';

test.describe('/api/cart API tests', () => {
  test('should successfully get user cart - 200', async ({ request, authToken }) => {
    // when
    const response = await getCart(request, authToken);

    // then
    expect(response.status()).toBe(200);
    const cart: CartDto = await response.json();
    validateCart(cart);
  });

  test('should return 401 for invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await getCart(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 401 for missing token - 401', async ({ request }) => {
    // when
    const response = await request.get(`${API_BASE_URL}/api/cart`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });
}); 