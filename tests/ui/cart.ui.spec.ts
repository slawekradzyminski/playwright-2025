import { test } from '../../fixtures/authenticatedUiUserFixture';
import { givenCartWithProduct } from '../../helpers/cartHelpers';
import { formatMoney, formatProductPrice, getSeededProduct } from '../../helpers/productHelpers';
import { CartClient } from '../../httpclients/cartClient';
import { ProductsClient } from '../../httpclients/productsClient';
import { CartPage, type ExpectedCartItem } from '../../pages/cartPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import type { ProductDto } from '../../types/product';

test.describe('Cart UI tests', () => {
  let cartClient: CartClient;
  let cartPage: CartPage;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ page, request }) => {
    cartClient = new CartClient(request);
    cartPage = new CartPage(page);
    productsClient = new ProductsClient(request);
  });

  test('should display empty cart', async ({ authenticatedUiUser }) => {
    // given
    await cartClient.clearCart(authenticatedUiUser.token);

    // when
    await cartPage.open();

    // then
    await cartPage.assertThatUrlIs(CartPage.url);
    await cartPage.assertThatEmptyCartIsVisible();
    await cartPage.header.assertThatCartIsEmpty();
  });

  test('should display populated cart', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    const quantity = 2;
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity });

    // when
    await cartPage.open();

    // then
    await cartPage.assertThatUrlIs(CartPage.url);
    await cartPage.assertThatCartItemIsVisible(expectedCartItem(product, quantity));
    await cartPage.header.assertThatCartCountIs(quantity);
  });

  test('should show retryable error state', async ({ page }) => {
    // given
    await page.route('**/*', async (route) => {
      const request = route.request();
      const requestPath = new URL(request.url()).pathname;

      if (request.method() !== 'GET' || requestPath !== '/api/v1/cart') {
        await route.fallback();
        return;
      }

      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Injected cart failure' })
      });
    });

    // when
    await cartPage.open();

    // then
    await cartPage.assertThatErrorStateIsVisible();

    // when
    await page.unroute('**/*');
    await cartPage.retryLoadingCart();

    // then
    await cartPage.assertThatEmptyCartIsVisible();
  });

  test('should update product quantity', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity: 2 });
    await cartPage.open();

    // when
    await cartPage.increaseItemQuantity(product.id);
    await cartPage.assertThatPendingQuantityIs(product.id, 3);
    await cartPage.updateItemQuantity(product.id);

    // then
    await cartPage.assertThatCartItemIsVisible(expectedCartItem(product, 3));
    await cartPage.header.assertThatCartCountIs(3);
  });

  test('should remove product from cart', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity: 2 });
    await cartPage.open();

    // when
    await cartPage.removeItem(product.id);

    // then
    await cartPage.assertThatEmptyCartIsVisible();
    await cartPage.header.assertThatCartIsEmpty();
  });

  test('should clear cart', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity: 2 });
    await cartPage.open();

    // when
    await cartPage.clearCart();

    // then
    await cartPage.assertThatEmptyCartIsVisible();
    await cartPage.header.assertThatCartIsEmpty();
  });

  test('should navigate to checkout from populated cart', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, { productId: product.id, quantity: 2 });
    await cartPage.open();

    // when
    await cartPage.proceedToCheckout();

    // then
    await cartPage.assertThatUrlIs(CheckoutPage.url);
  });
});

const expectedCartItem = (product: ProductDto, quantity: number): ExpectedCartItem => ({
  productId: product.id,
  name: product.name,
  unitPrice: formatProductPrice(product),
  quantity,
  totalPrice: formatMoney(product.price * quantity)
});
