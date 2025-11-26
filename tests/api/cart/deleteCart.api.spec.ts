import { test, expect } from '../../../fixtures/apiAuthFixture';
import { clearCart } from '../../../http/cart/clearCartRequest';
import { createTestProduct, addToCart, assertCartEmpty } from '../../helpers';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('DELETE /api/cart API tests', () => {
  test('client should clear cart - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { created: product } = await createTestProduct(request, adminAuth.token);
    await addToCart(request, product.id, clientAuth.token, 2);

    // when
    const response = await clearCart(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    await assertCartEmpty(request, clientAuth.token);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await clearCart(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await clearCart(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});
