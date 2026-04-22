import { test } from '../../fixtures/authenticatedUiUserFixture';
import { expectJsonResponse } from '../../helpers/apiAssertions';
import { givenCartWithProduct } from '../../helpers/cartHelpers';
import { testShippingAddress } from '../../helpers/orderHelpers';
import { formatMoney, formatProductPrice, getSeededProduct } from '../../helpers/productHelpers';
import { CartClient } from '../../httpclients/cartClient';
import { OrdersClient } from '../../httpclients/ordersClient';
import { ProductsClient } from '../../httpclients/productsClient';
import { CartPage } from '../../pages/cartPage';
import { CheckoutPage, type ExpectedCheckoutItem } from '../../pages/checkoutPage';
import { OrderDetailsPage } from '../../pages/orderDetailsPage';
import type { OrderDto } from '../../types/order';
import type { ProductDto } from '../../types/product';

test.describe('Checkout UI tests', () => {
  let cartClient: CartClient;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let ordersClient: OrdersClient;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ page, request }) => {
    cartClient = new CartClient(request);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    ordersClient = new OrdersClient(request);
    productsClient = new ProductsClient(request);
  });

  test('should redirect to cart when checkout is opened with empty cart', async ({ authenticatedUiUser }) => {
    // given
    await cartClient.clearCart(authenticatedUiUser.token);

    // when
    await checkoutPage.open();

    // then
    await checkoutPage.assertThatUrlIs(CartPage.url);
    await cartPage.assertThatEmptyCartIsVisible();
  });

  test('should show validation messages when shipping fields are empty', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity: 2 });
    await checkoutPage.open();
    await checkoutPage.assertThatCheckoutIsVisible(expectedCheckoutItem(product, 2));

    // when
    await checkoutPage.submitEmptyForm();

    // then
    await checkoutPage.assertThatRequiredValidationMessagesAreVisible();
  });

  test('should place order from checkout', async ({ authenticatedUiUser, page }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity: 2 });
    await checkoutPage.open();
    await checkoutPage.assertThatCheckoutIsVisible(expectedCheckoutItem(product, 2));

    // when
    await checkoutPage.placeOrder(testShippingAddress);

    // then
    const orderDetailsPage = new OrderDetailsPage(page);
    await orderDetailsPage.assertThatUrlIs(OrderDetailsPage.urlPattern);
    const orderId = Number(new URL(page.url()).pathname.split('/').at(-1));
    const orderResponse = await ordersClient.getOrderById(orderId, authenticatedUiUser.token);
    const order = await expectJsonResponse<OrderDto>(orderResponse, 200);
    await orderDetailsPage.assertThatOrderIsVisible(order);
  });
});

const expectedCheckoutItem = (product: ProductDto, quantity: number): ExpectedCheckoutItem => ({
  productId: product.id,
  name: product.name,
  unitPrice: formatProductPrice(product),
  quantity,
  totalPrice: formatMoney(product.price * quantity)
});
