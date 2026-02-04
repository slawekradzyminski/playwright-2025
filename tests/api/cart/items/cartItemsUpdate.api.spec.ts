import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { addCartItem, updateCartItem } from '../../../../http/cartItemsClient';
import type { CartDto } from '../../../../types/cart';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/api/cart/items/{productId} PUT API tests', () => {
  test('should update cart item quantity - 200', async ({ request, authenticatedUser }) => {
    // given
    await addCartItem(request, authenticatedUser.jwtToken, { productId: 1, quantity: 1 });

    // when
    const response = await updateCartItem(request, authenticatedUser.jwtToken, 1, { quantity: 2 });

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ productId: 1, quantity: 2 })])
    );
  });

  test('should return validation error for negative quantity - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    await addCartItem(request, authenticatedUser.jwtToken, { productId: 1, quantity: 1 });

    // when
    const response = await updateCartItem(request, authenticatedUser.jwtToken, 1, { quantity: -1 });

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ quantity: 'Quantity cannot be negative' });
  });

  test('should return unauthorized for update cart item without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.put(`${API_BASE_URL}/api/cart/items/1`, {
      data: { quantity: 2 }
    });

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
    const response = await updateCartItem(request, authenticatedUser.jwtToken, 999999999, {
      quantity: 2
    });

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Cart item not found' });
  });
});
