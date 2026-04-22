import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import {
  expectOrderShape,
  expectOrdersPageShape,
  givenPendingOrderWithProduct,
  testShippingAddress
} from '../../../helpers/orderHelpers';
import { getSeededProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';
import { OrdersClient } from '../../../httpclients/ordersClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { OrdersPageDto } from '../../../types/order';

test.describe('GET /api/v1/orders API tests', () => {
  let cartClient: CartClient;
  let ordersClient: OrdersClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
    ordersClient = new OrdersClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should return current user orders page - 200', async ({ authenticatedApiUser }) => {
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
    const response = await ordersClient.getOrders({}, authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<OrdersPageDto>(response, 200);
    expectOrdersPageShape(responseBody);
    expect(responseBody.pageNumber).toBe(0);
    expect(responseBody.pageSize).toBe(10);
    expect(responseBody.totalElements).toBeGreaterThanOrEqual(1);

    const listedOrder = responseBody.content.find((currentOrder) => currentOrder.id === order.id);
    expect(listedOrder).toBeDefined();

    if (!listedOrder) {
      throw new Error(`Expected order ${order.id} in current user orders page`);
    }

    expectOrderShape(listedOrder, {
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

  test('should filter current user orders by status - 200', async ({ authenticatedApiUser }) => {
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
    const response = await ordersClient.getOrders({ status: 'PENDING' }, authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<OrdersPageDto>(response, 200);
    expectOrdersPageShape(responseBody);
    expect(responseBody.content.length).toBeGreaterThan(0);
    expect(responseBody.content.every((currentOrder) => currentOrder.status === 'PENDING')).toBe(true);
    expect(responseBody.content.some((currentOrder) => currentOrder.id === order.id)).toBe(true);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await ordersClient.getOrders();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await ordersClient.getOrders({}, INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});
