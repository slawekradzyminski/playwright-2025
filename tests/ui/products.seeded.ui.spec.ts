import { test, expect } from '../fixtures/ui-auth.fixture';
import { PRODUCTS_URL } from './constants/ui.urls.constants';
import { PRODUCTS_UI_TEXT } from './constants/products.ui.constants';
import { ProductsPage } from './pages/products.page';
import { withProductSeedSession } from './utils/product-data.util';

test.describe('Products Catalog Seeded UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    productsPage = new ProductsPage(authenticatedPage);
    await productsPage.goto();
    await expect(authenticatedPage).toHaveURL(PRODUCTS_URL);
    await expect(productsPage.title).toHaveText(PRODUCTS_UI_TEXT.pageTitle);
  });

  test('should filter products by search and category', async ({ request, adminAuth }) => {
    await withProductSeedSession(request, adminAuth.jwtToken, async (seedSession) => {
      // given
      const dataset = await seedSession.createSearchAndCategoryDataset();
      await productsPage.goto();

      // when
      await productsPage.search(dataset.uniqueToken);

      // then
      await expect(productsPage.productItems).toHaveCount(dataset.expectedSearchCount);

      // when
      await productsPage.selectHomeKitchenCategory();

      // then
      await expect(productsPage.productListTitle).toHaveText(PRODUCTS_UI_TEXT.homeKitchenProductsTitle);
      await expect(productsPage.productItems).toHaveCount(dataset.expectedHomeKitchenCount);
      await expect(productsPage.productNames.first()).toHaveText(dataset.homeKitchenName);
      await expect(productsPage.productCategories).toHaveText(['Home & Kitchen']);
    });
  });

  test('should add product to cart from catalog and update cart indicators', async ({
    request,
    adminAuth,
  }) => {
    await withProductSeedSession(request, adminAuth.jwtToken, async (seedSession) => {
      // given
      const uniqueToken = seedSession.buildProductToken('ui-catalog-cart');
      const createdProduct = await seedSession.createProduct({
        name: `${uniqueToken}-product`,
        category: 'Books',
      });
      const initialCartCount = await productsPage.getCartCount();
      await seedSession.waitForProductsToBeQueryable([createdProduct.id]);
      await productsPage.goto();
      await productsPage.selectAllProductsCategory();
      await productsPage.search(uniqueToken);
      await expect(productsPage.productItems).toHaveCount(1);

      // when
      await productsPage.setFirstProductQuantity(2);
      await productsPage.addFirstProductToCart();

      // then
      await expect(productsPage.toast.getTitle(PRODUCTS_UI_TEXT.addedToCartTitle)).toBeVisible();
      await productsPage.expectCartCount(initialCartCount + 2);
      await productsPage.expectFirstProductInCartQuantity(2);
      await productsPage.expectFirstProductActionLabel(PRODUCTS_UI_TEXT.updateCartButtonLabel);
    });
  });
});
