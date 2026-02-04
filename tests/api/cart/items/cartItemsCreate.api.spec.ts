import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { addCartItem } from '../../../../http/cartItemsClient';
import type { CartDto } from '../../../../types/cart';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/api/cart/items POST API tests', () => {
  test('should add item to cart - 200', async ({ request, authenticatedUser }) => {
    // given
    // when
    const response = await addCartItem(request, authenticatedUser.jwtToken, {
      productId: 1,
      quantity: 1
    });

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ productId: 1, quantity: 1 })])
    );
  });

  test('should return validation error for invalid quantity - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await addCartItem(request, authenticatedUser.jwtToken, {
      productId: 1,
      quantity: 0
    });

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      quantity: 'must be greater than or equal to 1'
    });
  });

  test('should return unauthorized for add cart item without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/api/cart/items`, {
      data: { productId: 1, quantity: 1 }
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for product that does not exist - 404', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await addCartItem(request, authenticatedUser.jwtToken, {
      productId: 999999999,
      quantity: 1
    });

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Product not found' });
  });
});
