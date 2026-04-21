import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import {
  expectCartDoesNotContainProduct,
  givenCartWithProduct,
  MISSING_PRODUCT_ID
} from '../../../helpers/cartHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { CartDto, CartItemDto } from '../../../types/cart';

test.describe('DELETE /api/v1/cart/items/{productId} API tests', () => {
  let cartClient: CartClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should remove existing item from cart - 200', async ({ authenticatedUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUser.token);
    const cartItem: CartItemDto = {
      productId: product.id,
      quantity: 2
    };
    await givenCartWithProduct(cartClient, authenticatedUser.token, cartItem);

    // when
    const response = await cartClient.removeItem(product.id, authenticatedUser.token);

    // then
    const responseBody = await expectJsonResponse<CartDto>(response, 200);
    expectCartDoesNotContainProduct(responseBody, product.id, authenticatedUser.userData.username);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await cartClient.removeItem(1);

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await cartClient.removeItem(1, INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });

  test('should return not found when cart item does not exist - 404', async ({ authenticatedUser }) => {
    // given
    await cartClient.clearCart(authenticatedUser.token);

    // when
    const response = await cartClient.removeItem(MISSING_PRODUCT_ID, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Cart item not found');
  });
});
