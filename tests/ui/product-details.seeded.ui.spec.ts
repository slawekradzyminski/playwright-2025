import { test, expect } from '../fixtures/ui-auth.fixture';
import { PRODUCTS_URL } from './constants/ui.urls.constants';
import { ProductDetailsPage } from './pages/product-details.page';
import { ProductsPage } from './pages/products.page';
import { withProductSeedSession } from './utils/product-data.util';
import { openSeededProductDetails } from './utils/product-details-scenario.util';

test.describe('Product Details Seeded UI tests', () => {
  let productsPage: ProductsPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    productsPage = new ProductsPage(authenticatedPage);
    productDetailsPage = new ProductDetailsPage(authenticatedPage);
    await productsPage.goto();
    await expect(authenticatedPage).toHaveURL(PRODUCTS_URL);
    await productsPage.openFirstProductCard();
    await expect(authenticatedPage).toHaveURL(/\/products\/\d+$/);
  });

  test('should add product to cart and reflect cart state in UI', async ({ request, adminAuth }) => {
    await withProductSeedSession(request, adminAuth.jwtToken, async (seedSession) => {
      // given
      const { createdProductName, initialCartCount } = await openSeededProductDetails(
        seedSession,
        'ui-details-cart',
        productsPage,
        productDetailsPage,
      );

      // when
      await productDetailsPage.addToCart();

      // then
      await productDetailsPage.expectAddedToCartToast(createdProductName, 1);
      await productDetailsPage.expectCartCount(initialCartCount + 1);
      await productDetailsPage.expectInCartQuantity(1);
      await productDetailsPage.expectUpdateMode();
      await expect(productDetailsPage.container).toBeVisible();
    });
  });

  test('should update cart quantity from product details page', async ({ request, adminAuth }) => {
    await withProductSeedSession(request, adminAuth.jwtToken, async (seedSession) => {
      // given
      const { createdProductName, initialCartCount } = await openSeededProductDetails(
        seedSession,
        'ui-details-update',
        productsPage,
        productDetailsPage,
      );
      await productDetailsPage.addToCart();
      await productDetailsPage.expectInCartQuantity(1);

      // when
      await productDetailsPage.setQuantity(3);
      await productDetailsPage.addToCart();

      // then
      await productDetailsPage.expectCartUpdatedToast(createdProductName, 3);
      await productDetailsPage.expectCartCount(initialCartCount + 3);
      await productDetailsPage.expectInCartQuantity(3);
      await productDetailsPage.expectUpdateMode();
      await expect(productDetailsPage.container).toBeVisible();
    });
  });
});
