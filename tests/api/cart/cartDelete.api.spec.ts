import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { addCartItem } from '../../../http/cartItemsClient';
import { clearCart, getCart } from '../../../http/cartClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/cart DELETE API tests', () => {
  test('should clear current user cart - 204', async ({ request, authenticatedUser }) => {
    // given
    await addCartItem(request, authenticatedUser.jwtToken, { productId: 1, quantity: 1 });

    // when
    const response = await clearCart(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(204);
    expect(await response.text()).toBe('');
    const cartResponse = await getCart(request, authenticatedUser.jwtToken);
    const cartBody = await cartResponse.json();
    expect(cartBody.totalItems).toBe(0);
  });

  test('should return unauthorized for clear cart request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.delete(`${API_BASE_URL}/api/cart`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
