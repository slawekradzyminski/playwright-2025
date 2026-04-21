import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
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

  test('should remove existing item from cart - 200', async ({ authenticatedApiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedApiUser.token);
    const cartItem: CartItemDto = {
      productId: product.id,
      quantity: 2
    };
    await givenCartWithProduct(cartClient, authenticatedApiUser.token, cartItem);

    // when
    const response = await cartClient.removeItem(product.id, authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<CartDto>(response, 200);
    expectCartDoesNotContainProduct(responseBody, product.id, authenticatedApiUser.userData.username);
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

  test('should return not found when cart item does not exist - 404', async ({ authenticatedApiUser }) => {
    // given
    await cartClient.clearCart(authenticatedApiUser.token);

    // when
    const response = await cartClient.removeItem(MISSING_PRODUCT_ID, authenticatedApiUser.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Cart item not found');
  });
});
