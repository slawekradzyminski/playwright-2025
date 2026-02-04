import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { addCartItem, updateCartItem } from '../../../../http/cartItemsClient';
import type { CartDto } from '../../../../types/cart';
import { test } from '../../../fixtures/auth.fixture';
import { getExistingProductId } from '../../helpers/productTestUtils';

test.describe('/api/cart/items/{productId} PUT API tests', () => {
  test('should update cart item quantity - 200', async ({ request, clientAuth }) => {
    // given
    const productId = await getExistingProductId(request, clientAuth.jwtToken);
    await addCartItem(request, clientAuth.jwtToken, { productId, quantity: 1 });

    // when
    const response = await updateCartItem(request, clientAuth.jwtToken, productId, { quantity: 2 });

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ productId, quantity: 2 })])
    );
  });

  test('should return validation error for negative quantity - 400', async ({
    request,
    clientAuth
  }) => {
    // given
    const productId = await getExistingProductId(request, clientAuth.jwtToken);
    await addCartItem(request, clientAuth.jwtToken, { productId, quantity: 1 });

    // when
    const response = await updateCartItem(request, clientAuth.jwtToken, productId, { quantity: -1 });

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
    clientAuth
  }) => {
    // given
    // when
    const response = await updateCartItem(request, clientAuth.jwtToken, 999999999, {
      quantity: 2
    });

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Cart item not found' });
  });
});
