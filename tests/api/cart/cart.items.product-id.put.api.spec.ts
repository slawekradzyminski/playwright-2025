import { CartClient } from '../../../httpclients/cartClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import type { CartDto, CartItemDto, UpdateCartItemDto } from '../../../types/cart';
import { expectCartContainsItem, givenCartWithProduct, MISSING_PRODUCT_ID } from '../../../helpers/cartHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';

test.describe('PUT /api/v1/cart/items/{productId} API tests', () => {
  let cartClient: CartClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should update cart item quantity - 200', async ({ authenticatedUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUser.token);
    const initialCartItem: CartItemDto = {
      productId: product.id,
      quantity: 1
    };
    await givenCartWithProduct(cartClient, authenticatedUser.token, initialCartItem);

    const updateCartItem: UpdateCartItemDto = {
      quantity: 3
    };

    // when
    const response = await cartClient.updateItem(product.id, updateCartItem, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: CartDto = await response.json();
    expectCartContainsItem(
      responseBody,
      { productId: product.id, quantity: updateCartItem.quantity },
      authenticatedUser.userData.username
    );

    await cartClient.clearCart(authenticatedUser.token);
  });

  test('should return validation error when quantity is negative - 400', async ({ authenticatedUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUser.token);
    const initialCartItem: CartItemDto = {
      productId: product.id,
      quantity: 1
    };
    await givenCartWithProduct(cartClient, authenticatedUser.token, initialCartItem);

    const updateCartItem: UpdateCartItemDto = {
      quantity: -1
    };

    // when
    const response = await cartClient.updateItem(product.id, updateCartItem, authenticatedUser.token);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.quantity).toBe('Quantity cannot be negative');

    await cartClient.clearCart(authenticatedUser.token);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given
    const updateCartItem: UpdateCartItemDto = {
      quantity: 1
    };

    // when
    const response = await cartClient.updateItem(1, updateCartItem);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given
    const updateCartItem: UpdateCartItemDto = {
      quantity: 1
    };

    // when
    const response = await cartClient.updateItem(1, updateCartItem, 'invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });

  test('should return not found when cart item does not exist - 404', async ({ authenticatedUser }) => {
    // given
    await cartClient.clearCart(authenticatedUser.token);
    const updateCartItem: UpdateCartItemDto = {
      quantity: 1
    };

    // when
    const response = await cartClient.updateItem(MISSING_PRODUCT_ID, updateCartItem, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Cart item not found');
  });
});
