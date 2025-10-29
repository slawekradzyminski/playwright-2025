import { AuthenticatedUIUser, test } from '../../fixtures/uiAuthFixture';
import { generateProductWithName } from '../../generators/productGenerator';
import { ProductsPage } from '../../pages/productsPage';
import { ProductDto } from '../../types/product';
import { createProductViaAPI, getAllProductsFromAPI, getProductsByCategory, searchProducts } from '../../utils/productUtil';

test.describe('Products Page UI Tests', () => {
  let productsPage: ProductsPage;
  let client: AuthenticatedUIUser;

  test.beforeEach(async ({ page, authenticatedUIAdmin }) => {
    client = authenticatedUIAdmin;
    productsPage = new ProductsPage(page);
    await productsPage.header.clickProducts();
    await productsPage.expectOnPage();
  });

  test.describe('Category Filtering', () => {
    test('should display all products by default', async ({ request }) => {
      // given
      const products = await getAllProductsFromAPI(request, client.token);
      const productCount = products.length;

      // then
      await productsPage.expectCategoryActive('all');
      await productsPage.expectProductListTitle('All Products');
      await productsPage.expectProductsCount(productCount);
    });

    test('should filter products when Electronics category is selected', async ({ request }) => {
      // given
      const electronicsProducts = await getProductsByCategory(request, client.token, 'Electronics');
      const electronicsCount = electronicsProducts.length;

      // when
      await productsPage.clickCategory('electronics');

      // then
      await productsPage.expectProductListTitle('Electronics Products');
      await productsPage.expectCategoryActive('electronics');
      await productsPage.expectAllProductsHaveCategory('Electronics');
      await productsPage.expectProductsCount(electronicsCount);
    });

    test('should reset filter when All Products is clicked', async ({ request }) => {
      // given
      const products = await getAllProductsFromAPI(request, client.token);
      const productCount = products.length;
      await productsPage.clickCategory('electronics');
      await productsPage.expectCategoryActive('electronics');

      // when
      await productsPage.clickAllProducts();

      // then
      await productsPage.expectProductListTitle('All Products');
      await productsPage.expectCategoryActive('all');
      await productsPage.expectProductsCount(productCount);
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter products when searching', async ({ request, page }) => {
      // given
      const productName = 'iPhone 14';
      let products = await getAllProductsFromAPI(request, client.token);
      if (!products.some((product: ProductDto) => product.name === productName)) {
        await createProductViaAPI(request, generateProductWithName(productName), client.token);
        await page.reload();
        await productsPage.expectOnPage();
      }
      const filteredCount = (await searchProducts(request, client.token, productName)).length;

      // when
      await productsPage.search(productName);

      // then
      await productsPage.expectMinimumProducts(1);
      await productsPage.expectProductsCount(filteredCount);
      await productsPage.expectClearSearchVisible();
    });

    test('should clear search when clear button is clicked', async () => {
      // given
      await productsPage.search('iPhone');
      await productsPage.expectClearSearchVisible();

      // when
      await productsPage.clickClearSearch();

      // then
      await productsPage.expectSearchValue('');
    });

    test('should show no results for non-existent product', async () => {
      // when
      await productsPage.search('nonexistentproduct123');

      // then
      await productsPage.expectProductCount(0);
    });
  });

  test.describe('Sort Functionality', () => {
    test('should sort products by name ascending', async () => {
      // when
      await productsPage.selectSort('name-asc');

      // then
      await productsPage.expectProductsSortedByName(true);
    });

    test('should sort products by price low to high', async () => {
      // when
      await productsPage.selectSort('price-asc');

      // then
      await productsPage.expectProductsSortedByPrice(true);
    });

    test('should sort products by price high to low', async () => {
      // when
      await productsPage.selectSort('price-desc');

      // then
      await productsPage.expectProductsSortedByPrice(false);
    });
  });

  test.describe('Quantity Controls', () => {
    test('should increase product quantity when plus button is clicked', async () => {
      // given
      await productsPage.expectProductQuantity(0, 1);

      // when
      await productsPage.clickIncreaseQuantity(0);

      // then
      await productsPage.expectProductQuantity(0, 2);
    });

    test('should decrease product quantity when minus button is clicked', async () => {
      // given
      await productsPage.clickIncreaseQuantity(0);
      await productsPage.expectProductQuantity(0, 2);

      // when
      await productsPage.clickDecreaseQuantity(0);

      // then
      await productsPage.expectProductQuantity(0, 1);
    });

    test('should allow decrease quantity to 0', async () => {
      // given
      await productsPage.expectProductQuantity(0, 1);

      // when
      await productsPage.clickDecreaseQuantity(0);

      // then
      await productsPage.expectProductQuantity(0, 0);
    });
  });

  test.describe('Add to Cart Functionality', () => {
    test('should add product to cart with default quantity', async () => {
      // when
      await productsPage.clickAddToCart(0);

      // then
      await productsPage.expectAddedToCartToast(/added to your cart/);
      await productsPage.expectCartBadge('1');
    });

    test('should add product to cart with custom quantity', async () => {
      // given
      const productName = await productsPage.getFirstProductName();

      // when
      await productsPage.clickIncreaseQuantity(0);
      await productsPage.clickIncreaseQuantity(0);
      await productsPage.expectProductQuantity(0, 3);
      await productsPage.clickAddToCart(0);

      // then
      await productsPage.expectAddedToCartToast(`3 × ${productName} added to your cart`);
      await productsPage.expectCartBadge('3');
    });

    test('should update cart badge when multiple products are added', async () => {
      // when
      await productsPage.clickIncreaseQuantity(0);
      await productsPage.clickAddToCart(0);
      await productsPage.clickAddToCart(1);

      // then
      await productsPage.expectCartBadge('3');
    });
  });

  test.describe('Combined Functionality', () => {
    test('should maintain search when sorting', async () => {
      // given
      await productsPage.search('iPhone');
      await productsPage.expectMinimumProducts(1);

      // when
      await productsPage.selectSort('price-asc');

      // then
      await productsPage.expectSearchValue('iPhone');
      await productsPage.expectProductsSortedByPrice(true);
    });

    test('should maintain search when category is selected', async () => {
      // given
      await productsPage.search('iPhone');
      await productsPage.expectSearchValue('iPhone');

      // when
      await productsPage.clickCategory('electronics');

      // then
      await productsPage.expectSearchValue('iPhone');
      await productsPage.expectCategoryActive('electronics');
    });
  });
});

