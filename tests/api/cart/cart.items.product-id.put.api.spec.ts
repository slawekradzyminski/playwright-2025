import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { expectCartContainsItem, givenCartWithProduct, MISSING_PRODUCT_ID } from '../../../helpers/cartHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { CartDto, CartItemDto, UpdateCartItemDto } from '../../../types/cart';

test.describe('PUT /api/v1/cart/items/{productId} API tests', () => {
  let cartClient: CartClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should update cart item quantity - 200', async ({ authenticatedApiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedApiUser.token);
    const initialCartItem: CartItemDto = {
      productId: product.id,
      quantity: 1
    };
    await givenCartWithProduct(cartClient, authenticatedApiUser.token, initialCartItem);

    const updateCartItem: UpdateCartItemDto = {
      quantity: 3
    };

    try {
      // when
      const response = await cartClient.updateItem(product.id, updateCartItem, authenticatedApiUser.token);

      // then
      const responseBody = await expectJsonResponse<CartDto>(response, 200);
      expectCartContainsItem(
        responseBody,
        { productId: product.id, quantity: updateCartItem.quantity },
        authenticatedApiUser.userData.username
      );
    } finally {
      await cartClient.clearCart(authenticatedApiUser.token);
    }
  });

  test('should return validation error when quantity is negative - 400', async ({ authenticatedApiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedApiUser.token);
    const initialCartItem: CartItemDto = {
      productId: product.id,
      quantity: 1
    };
    await givenCartWithProduct(cartClient, authenticatedApiUser.token, initialCartItem);

    const updateCartItem: UpdateCartItemDto = {
      quantity: -1
    };

    try {
      // when
      const response = await cartClient.updateItem(product.id, updateCartItem, authenticatedApiUser.token);

      // then
      const responseBody = await expectJsonResponse<{ quantity: string }>(response, 400);
      expect(responseBody.quantity).toBe('Quantity cannot be negative');
    } finally {
      await cartClient.clearCart(authenticatedApiUser.token);
    }
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given
    const updateCartItem: UpdateCartItemDto = {
      quantity: 1
    };

    // when
    const response = await cartClient.updateItem(1, updateCartItem);

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given
    const updateCartItem: UpdateCartItemDto = {
      quantity: 1
    };

    // when
    const response = await cartClient.updateItem(1, updateCartItem, INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });

  test('should return not found when cart item does not exist - 404', async ({ authenticatedApiUser }) => {
    // given
    await cartClient.clearCart(authenticatedApiUser.token);
    const updateCartItem: UpdateCartItemDto = {
      quantity: 1
    };

    // when
    const response = await cartClient.updateItem(MISSING_PRODUCT_ID, updateCartItem, authenticatedApiUser.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Cart item not found');
  });
});
