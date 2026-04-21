import { CartClient } from '../../../httpclients/cartClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import type { CartDto, CartItemDto } from '../../../types/cart';
import { expectCartContainsItem, MISSING_PRODUCT_ID } from '../../../helpers/cartHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';

test.describe('POST /api/v1/cart/items API tests', () => {
  let cartClient: CartClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should add existing product to cart - 200', async ({ authenticatedUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUser.token);
    await cartClient.clearCart(authenticatedUser.token);
    const cartItem: CartItemDto = {
      productId: product.id,
      quantity: 2
    };

    // when
    const response = await cartClient.addItem(cartItem, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: CartDto = await response.json();
    expectCartContainsItem(responseBody, cartItem, authenticatedUser.userData.username);

    await cartClient.clearCart(authenticatedUser.token);
  });

  test('should return validation error when quantity is zero - 400', async ({ authenticatedUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUser.token);
    const cartItem: CartItemDto = {
      productId: product.id,
      quantity: 0
    };

    // when
    const response = await cartClient.addItem(cartItem, authenticatedUser.token);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.quantity).toBe('must be greater than or equal to 1');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given
    const cartItem: CartItemDto = {
      productId: 1,
      quantity: 1
    };

    // when
    const response = await cartClient.addItem(cartItem);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given
    const cartItem: CartItemDto = {
      productId: 1,
      quantity: 1
    };

    // when
    const response = await cartClient.addItem(cartItem, 'invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });

  test('should return not found when product does not exist - 404', async ({ authenticatedUser }) => {
    // given
    const cartItem: CartItemDto = {
      productId: MISSING_PRODUCT_ID,
      quantity: 1
    };

    // when
    const response = await cartClient.addItem(cartItem, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Product not found');
  });
});
