import { test } from '../../../fixtures/authenticatedApiUserFixture';
import {
  expectErrorMessage,
  expectInvalidToken,
  expectJsonResponse,
  expectUnauthorized
} from '../../../helpers/apiAssertions';
import { expectOrderShape, givenPendingOrderWithProduct, testShippingAddress } from '../../../helpers/orderHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';
import { OrdersClient } from '../../../httpclients/ordersClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { OrderDto } from '../../../types/order';

const missingOrderId = 999999;

test.describe('GET /api/v1/orders/{id} API tests', () => {
  let cartClient: CartClient;
  let ordersClient: OrdersClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    ordersClient = new OrdersClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should return own order by id - 200', async ({ authenticatedApiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedApiUser.token);
    const order = await givenPendingOrderWithProduct(
      cartClient,
      ordersClient,
      authenticatedApiUser.token,
      product.id,
      2
    );

    // when
    const response = await ordersClient.getOrderById(order.id, authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<OrderDto>(response, 200);
    expectOrderShape(responseBody, {
      username: authenticatedApiUser.userData.username,
      shippingAddress: testShippingAddress,
      item: {
        productId: product.id,
        productName: product.name,
        quantity: 2,
        unitPrice: product.price
      }
    });
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await ordersClient.getOrderById(1);

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await ordersClient.getOrderById(1, INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });

  test('should return not found when order does not exist - 404', async ({ authenticatedApiUser }) => {
    // given

    // when
    const response = await ordersClient.getOrderById(missingOrderId, authenticatedApiUser.token);

    // then
    await expectErrorMessage(response, 404, 'Order not found');
  });
});
