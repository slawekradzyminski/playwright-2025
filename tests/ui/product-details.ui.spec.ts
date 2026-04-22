import { test } from '../../fixtures/authenticatedUiUserFixture';
import { givenCartWithProduct } from '../../helpers/cartHelpers';
import { formatProductPrice, formatProductStock, getSeededProduct } from '../../helpers/productHelpers';
import { CartClient } from '../../httpclients/cartClient';
import { ProductsClient } from '../../httpclients/productsClient';
import { ProductDetailsPage } from '../../pages/productDetailsPage';
import type { ProductDto } from '../../types/product';

const missingProductId = 999999;
const noImageOutOfStockProduct: ProductDto = {
  id: 999998,
  name: 'No Image Out Of Stock Product',
  description: 'Product detail coverage for missing image and unavailable stock',
  price: 12.34,
  stockQuantity: 0,
  category: 'UI Tests',
  imageUrl: '',
  createdAt: '2026-04-22T00:00:00Z',
  updatedAt: '2026-04-22T00:00:00Z'
};

test.describe('Product details UI tests', () => {
  let cartClient: CartClient;
  let productDetailsPage: ProductDetailsPage;
  let productsClient: ProductsClient;

  test.beforeEach(async ({ page, request }) => {
    cartClient = new CartClient(request);
    productDetailsPage = new ProductDetailsPage(page);
    productsClient = new ProductsClient(request);
  });

  test('should display product details on direct route', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);

    // when
    await productDetailsPage.open(product.id);

    // then
    await productDetailsPage.assertThatUrlIs(ProductDetailsPage.urlPattern);
    await productDetailsPage.assertThatProductDetailsAreVisible(expectedDetails(product));
  });

  test('should show product without image and out-of-stock controls', async ({ page }) => {
    // given
    await page.route(`**/api/v1/products/${noImageOutOfStockProduct.id}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(noImageOutOfStockProduct)
      });
    });

    // when
    await productDetailsPage.open(noImageOutOfStockProduct.id);

    // then
    await productDetailsPage.assertThatProductDetailsAreVisible({
      ...expectedDetails(noImageOutOfStockProduct),
      imageVisible: false,
      cartControlsVisible: false
    });
    await productDetailsPage.assertThatNoImageIsVisible();
    await productDetailsPage.assertThatOutOfStockStateIsVisible();
  });

  test('should show not found state for missing product', async () => {
    // given

    // when
    await productDetailsPage.open(missingProductId);

    // then
    await productDetailsPage.assertThatNotFoundIsVisible();
  });

  test('should update existing cart quantity from product details', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, {
      productId: product.id,
      quantity: 2
    });
    await productDetailsPage.open(product.id);
    await productDetailsPage.assertThatProductIsInCart(2);

    // when
    await productDetailsPage.increaseQuantity();
    await productDetailsPage.addToCart();

    // then
    await productDetailsPage.assertThatProductIsInCart(3);
  });

  test('should remove product from cart from product details', async ({ authenticatedUiUser }) => {
    // given
    const product = await getSeededProduct(productsClient, authenticatedUiUser.token);
    await givenCartWithProduct(cartClient, authenticatedUiUser.token, {
      productId: product.id,
      quantity: 2
    });
    await productDetailsPage.open(product.id);
    await productDetailsPage.assertThatProductIsInCart(2);

    // when
    await productDetailsPage.removeFromCart();

    // then
    await productDetailsPage.assertThatProductIsNotInCart();
  });
});

const expectedDetails = (product: ProductDto) => ({
  name: product.name,
  price: formatProductPrice(product),
  category: product.category,
  description: product.description,
  stock: formatProductStock(product)
});
