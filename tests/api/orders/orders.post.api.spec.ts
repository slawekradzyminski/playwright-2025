import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import {
  expectErrorMessage,
  expectInvalidToken,
  expectJsonResponse,
  expectUnauthorized
} from '../../../helpers/apiAssertions';
import { givenCartWithProduct } from '../../../helpers/cartHelpers';
import { expectOrderShape, testShippingAddress } from '../../../helpers/orderHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';
import { OrdersClient } from '../../../httpclients/ordersClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { CartDto, CartItemDto } from '../../../types/cart';
import type { OrderDto } from '../../../types/order';

test.describe('POST /api/v1/orders API tests', () => {
  let cartClient: CartClient;
  let ordersClient: OrdersClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    ordersClient = new OrdersClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should create order from populated cart - 201', async ({ authenticatedApiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedApiUser.token);
    const cartItem: CartItemDto = {
      productId: product.id,
      quantity: 2
    };
    await givenCartWithProduct(cartClient, authenticatedApiUser.token, cartItem);

    try {
      // when
      const response = await ordersClient.createOrder(testShippingAddress, authenticatedApiUser.token);

      // then
      const responseBody = await expectJsonResponse<OrderDto>(response, 201);
      expectOrderShape(responseBody, {
        username: authenticatedApiUser.userData.username,
        shippingAddress: testShippingAddress,
        item: {
          productId: product.id,
          productName: product.name,
          quantity: cartItem.quantity,
          unitPrice: product.price
        }
      });

      const cartResponse = await cartClient.getCart(authenticatedApiUser.token);
      const cart = await expectJsonResponse<CartDto>(cartResponse, 200);
      expect(cart.username).toBe(authenticatedApiUser.userData.username);
      expect(cart.items).toEqual([]);
      expect(cart.totalItems).toBe(0);
      expect(cart.totalPrice).toBe(0);
    } finally {
      await cartClient.clearCart(authenticatedApiUser.token);
    }
  });

  test('should return error when cart is empty - 400', async ({ authenticatedApiUser }) => {
    // given
    await cartClient.clearCart(authenticatedApiUser.token);

    // when
    const response = await ordersClient.createOrder(testShippingAddress, authenticatedApiUser.token);

    // then
    await expectErrorMessage(response, 400, 'Cart is empty');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await ordersClient.createOrder(testShippingAddress);

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await ordersClient.createOrder(testShippingAddress, INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});
