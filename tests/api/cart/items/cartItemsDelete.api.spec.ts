import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { addCartItem, deleteCartItem } from '../../../../http/cartItemsClient';
import type { CartDto } from '../../../../types/cart';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/api/cart/items/{productId} DELETE API tests', () => {
  test('should remove item from cart - 200', async ({ request, authenticatedUser }) => {
    // given
    await addCartItem(request, authenticatedUser.jwtToken, { productId: 1, quantity: 1 });

    // when
    const response = await deleteCartItem(request, authenticatedUser.jwtToken, 1);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.items).toEqual([]);
    expect(responseBody.totalItems).toBe(0);
  });

  test('should return unauthorized for delete cart item without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.delete(`${API_BASE_URL}/api/cart/items/1`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for cart item that does not exist - 404', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await deleteCartItem(request, authenticatedUser.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Cart item not found' });
  });
});
