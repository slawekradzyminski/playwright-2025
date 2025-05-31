import { test, expect } from '../../fixtures/auth.fixture';
import type { CartDto } from '../../types/cart';
import { validateCartDto } from '../../validators/cartValidator';
import { getCart } from '../../http/getCart';

test.describe('/api/cart API tests', () => {
  test('should successfully retrieve cart with valid authentication - 200', async ({ request, authToken }) => {
    // when
    const response = await getCart(request, authToken);

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: CartDto = await response.json();
    validateCartDto(responseBody);
  });

  test('should return unauthorized error without authentication token - 401', async ({ request }) => {
    // when
    const response = await getCart(request, '');

    // then
    expect(response.status()).toBe(401);
  });
}); 