import { test, expect } from '../../fixtures/productsUiFixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { getProducts } from '../../http/products/getProductsRequest';
import { resetCart } from './helpers/productTestUtils';
import type { ProductDto } from '../../types/products';

test.describe('Products UI', () => {
  test.beforeEach(async ({ page, adminUiAuth, request }) => {
    // given - clear cart before each test
    await resetCart(request, adminUiAuth.token);
    await page.goto(ProductsPage.URL);
  });

  test('should display products page with product grid', async ({ productsPage }) => {
    // then
    await expect(productsPage.page).toHaveURL(ProductsPage.URL);
    await expect(productsPage.pageTitle).toHaveText('Products');
    await expect(productsPage.categoriesTitle).toHaveText('Categories');
    await expect(productsPage.categoryList).toBeVisible();
    await expect(productsPage.productList).toBeVisible();
    await expect(productsPage.productItems.first()).toBeVisible();
  });

  test('should display products matching API data', async ({ productsPage, request, adminUiAuth }) => {
    // given
    const response = await getProducts(request, adminUiAuth.token);
    const products: ProductDto[] = await response.json();

    // then
    await expect(productsPage.productItems).toHaveCount(products.length);
  });

  test('should filter products by category', async ({ productsPage }) => {
    // given
    await expect(productsPage.productItems.first()).toBeVisible();
    const initialCount = await productsPage.productItems.count();

    // when
    await productsPage.selectCategory('Electronics');

    // then
    await expect(productsPage.productListTitle).toHaveText('Electronics Products');
    const filteredCount = await productsPage.productItems.count();
    expect(filteredCount).toBeLessThan(initialCount);
  });

  test('should search products by name', async ({ productsPage, request, adminUiAuth }) => {
    // given
    const response = await getProducts(request, adminUiAuth.token);
    const products: ProductDto[] = await response.json();
    const firstProductName = products[0].name;
    const matchingProductsCount = products.filter((p) => p.name.includes(firstProductName)).length;

    // when
    await productsPage.searchProducts(firstProductName);

    // then
    await expect(productsPage.productItems).toHaveCount(matchingProductsCount);
    for (const product of await productsPage.productItems.all()) {
      await expect(product).toContainText(firstProductName);
    }
  });

  test('should allow clearing the search', async ({ productsPage, request, adminUiAuth }) => {
    // given
    await expect(productsPage.productItems.first()).toBeVisible();
    const response = await getProducts(request, adminUiAuth.token);
    const products: ProductDto[] = await response.json();
    const firstProductName = products[0].name;
    const productCountBeforeSearch = await productsPage.productItems.count();
    await productsPage.searchProducts(firstProductName);
    const productCountAfterSearch = await productsPage.productItems.count();
    expect(productCountAfterSearch).toBeLessThanOrEqual(productCountBeforeSearch);

    // when
    await productsPage.clearSearch();

    // then
    await expect(productsPage.productItems).toHaveCount(productCountBeforeSearch);
  });

  test('should sort products by price low to high', async ({ productsPage }) => {
    // when
    await productsPage.sortBy('Price (Low to High)');

    // then
    const firstProduct = productsPage.productItems.first();
    const lastProduct = productsPage.productItems.last();

    const firstProductPrice = await firstProduct.getByTestId('product-price').textContent();
    const lastProductPrice = await lastProduct.getByTestId('product-price').textContent();

    const firstPrice = parseFloat(firstProductPrice?.replace('$', '').replace(',', '') || '0');
    const lastPrice = parseFloat(lastProductPrice?.replace('$', '').replace(',', '') || '0');

    expect(firstPrice).toBeLessThanOrEqual(lastPrice);
  });

  test('should navigate to product details when clicking a product card', async ({ page, productsPage }) => {
    // given
    const firstProduct = productsPage.productItems.first();
    const productName = await firstProduct.getByTestId('product-name').textContent();

    // when
    await firstProduct.click();

    // then
    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(productName!);
  });
});

test.describe('Products UI - Cart Integration', () => {
  test.beforeEach(async ({ page, adminUiAuth, request }) => {
    await resetCart(request, adminUiAuth.token);
    await page.goto(ProductsPage.URL);
  });

  test('should add product to cart and show toast notification', async ({
    productsPage,
    testProduct,
    verifyCart
  }) => {
    // when
    await productsPage.addProductToCart(testProduct.created.name);

    // then - verify toast notification
    await expect(productsPage.toast.title).toHaveText('Added to cart');
    await expect(productsPage.toast.description).toContainText(
      `${testProduct.created.name} added to your cart`
    );

    // then - verify cart badge in header
    await expect(productsPage.header.cartLink).toContainText('1');

    // then - verify cart via API
    await verifyCart(1);
  });

  test('should show "in cart" state after adding product', async ({ productsPage, testProduct }) => {
    // when
    await productsPage.addProductToCart(testProduct.created.name);

    // then
    const productLocator = productsPage.getProductByName(testProduct.created.name);
    await expect(productsPage.getProductInCartDisplay(productLocator)).toContainText('in cart');
    await expect(productsPage.getProductRemoveButton(productLocator)).toBeVisible();
  });

  test('should increase quantity before adding to cart', async ({
    productsPage,
    testProduct,
    verifyCart
  }) => {
    // given
    const productLocator = productsPage.getProductByName(testProduct.created.name);

    // when
    await productsPage.getProductIncreaseButton(productLocator).click();
    await productsPage.getProductIncreaseButton(productLocator).click();
    await productsPage.getProductAddButton(productLocator).click();

    // then - verify toast shows correct quantity
    await expect(productsPage.toast.description).toContainText(`3 × ${testProduct.created.name}`);

    // then - verify cart via API
    await verifyCart(3);
  });

  test('should remove product from cart', async ({ page, productsPage, testProduct, verifyCart }) => {
    // given
    const productLocator = productsPage.getProductByName(testProduct.created.name);
    await productsPage.addProductToCart(testProduct.created.name);
    await expect(productsPage.getProductRemoveButton(productLocator)).toBeVisible();

    // when
    const removePromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart/items') && response.request().method() === 'DELETE'
    );
    await productsPage.getProductRemoveButton(productLocator).click();
    await removePromise;

    // then - wait for removal to complete
    await expect(productsPage.getProductAddButton(productLocator)).toBeVisible();

    // then - verify cart is empty via API
    await verifyCart(0);
  });
});
