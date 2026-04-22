import { test } from '../../fixtures/authenticatedUiUserFixture';
import { givenPendingOrderWithProduct } from '../../helpers/orderHelpers';
import { getSeededProduct } from '../../helpers/productHelpers';
import { CartClient } from '../../httpclients/cartClient';
import { OrdersClient } from '../../httpclients/ordersClient';
import { ProductsClient } from '../../httpclients/productsClient';
import { OrderDetailsPage } from '../../pages/orderDetailsPage';

const missingOrderId = 999999;

test.describe('Order details UI tests', () => {
  let cartClient: CartClient;
  let orderDetailsPage: OrderDetailsPage;
  let ordersClient: OrdersClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ page, request }) => {
    cartClient = new CartClient(request);
    orderDetailsPage = new OrderDetailsPage(page);
    ordersClient = new OrdersClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should show not found state for missing order', async () => {
    // given

    // when
    await orderDetailsPage.open(missingOrderId);

    // then
    await orderDetailsPage.assertThatNotFoundIsVisible();
  });

  test('should display pending order details', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    const order = await givenPendingOrderWithProduct(
      cartClient,
      ordersClient,
      authenticatedUiUser.token,
      product.id,
      2
    );

    // when
    await orderDetailsPage.open(order.id);

    // then
    await orderDetailsPage.assertThatUrlIs(OrderDetailsPage.urlPattern);
    await orderDetailsPage.assertThatOrderIsVisible(order);
  });

  test('should cancel pending order', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    const order = await givenPendingOrderWithProduct(
      cartClient,
      ordersClient,
      authenticatedUiUser.token,
      product.id,
      2
    );
    await orderDetailsPage.open(order.id);
    await orderDetailsPage.assertThatStatusIs('PENDING');

    // when
    await orderDetailsPage.cancelOrder();

    // then
    await orderDetailsPage.assertThatStatusIs('CANCELLED');
    await orderDetailsPage.assertThatCancelButtonIsHidden();
  });
});
