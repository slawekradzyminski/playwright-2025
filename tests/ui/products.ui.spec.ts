import { test, expect } from '../../fixtures/uiAuthFixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { getProducts } from '../../http/products/getProductsRequest';
import { getCart } from '../../http/cart/getCartRequest';
import { clearCart } from '../../http/cart/clearCartRequest';
import type { ProductCreateDto, ProductDto } from '../../types/products';
import type { CartDto } from '../../types/cart';
import { generateProduct } from '../../generators/productGenerator';
import { createProduct } from '../../http/products/createProductRequest';

test.describe('Products UI', () => {
  let productsPage: ProductsPage;
  let token: string;

  test.beforeEach(async ({ page, adminUiAuth, request }) => {
    token = adminUiAuth.token;
    productsPage = new ProductsPage(page);

    // clear cart before each test
    await clearCart(request, token);
    await page.goto(ProductsPage.URL);
  });

  test('should display products page with product grid', async () => {
    // then
    await expect(productsPage.page).toHaveURL(ProductsPage.URL);
    await expect(productsPage.pageTitle).toHaveText('Products');
    await expect(productsPage.categoriesTitle).toHaveText('Categories');
    await expect(productsPage.categoryList).toBeVisible();
    await expect(productsPage.productList).toBeVisible();
    await expect(productsPage.productItems.first()).toBeVisible();
  });

  test('should display products matching API data', async ({ request }) => {
    // given
    const response = await getProducts(request, token);
    const products: ProductDto[] = await response.json();

    // then
    await expect(productsPage.productItems).toHaveCount(products.length);
  });

  // There is a small risk that this test will be flaky if all products are in 'Electronics' category.
  // To make it stable create a new product with a different category first
  test('should filter products by category', async () => {
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

  test('should search products by name', async ({ request }) => {
    // given
    const response = await getProducts(request, token);
    const products: ProductDto[] = await response.json();
    const firstProductName = products[0].name;
    const firstProductCount = products.filter((product) => product.name.includes(firstProductName)).length;

    // when
    await productsPage.searchProducts(firstProductName);

    // then
    await expect(productsPage.productItems).toHaveCount(firstProductCount);
    for (const product of await productsPage.productItems.all()) {
      await expect(product).toContainText(firstProductName);
    }
  });

  test('should allow clearing the search', async ({ request }) => {
    // given - wait for products to load first
    await expect(productsPage.productItems.first()).toBeVisible();
    const response = await getProducts(request, token);
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

  test('should sort products by price low to high', async () => {
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

  test('should navigate to product details when clicking a product card', async ({ page }) => {
    // given
    const firstProduct = productsPage.productItems.first();
    const productName = await firstProduct.getByTestId('product-name').textContent();

    // when
    await firstProduct.click();

    // then
    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(productName!);
  });

  test('should add product to cart and show toast notification', async ({ request, page }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, token);
    const product: ProductDto = await createResponse.json();
    await page.reload();

    // when
    await productsPage.addProductToCart(product.name);

    // then - verify toast notification
    await expect(productsPage.toast.title).toHaveText('Added to cart');
    await expect(productsPage.toast.description).toContainText(`${product.name} added to your cart`);

    // then - verify cart badge in header
    await expect(productsPage.header.cartLink).toContainText('1');

    // then - verify cart via API
    const cartResponse = await getCart(request, token);
    const cart: CartDto = await cartResponse.json();
    expect(cart.totalItems).toBe(1);
  });

  test('should show "in cart" state after adding product', async ({ request, page }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, token);
    const product: ProductDto = await createResponse.json();
    await page.reload();

    // when
    await productsPage.addProductToCart(product.name);

    // then
    const productLocator = productsPage.getProductByName(product.name);
    await expect(productsPage.getProductInCartDisplay(productLocator)).toContainText('in cart');
    await expect(productsPage.getProductRemoveButton(productLocator)).toBeVisible();
  });

  test('should increase quantity before adding to cart', async ({ request, page }) => {
    // given        
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, token);
    const product: ProductDto = await createResponse.json();
    await page.reload();
    const productLocator = productsPage.getProductByName(product.name);

    // when
    await productsPage.getProductIncreaseButton(productLocator).click();
    await productsPage.getProductIncreaseButton(productLocator).click();
    await productsPage.getProductAddButton(productLocator).click();

    // then - verify toast shows correct quantity
    await expect(productsPage.toast.description).toContainText(`3 × ${product.name}`);

    // then - verify cart via API
    const cartResponse = await getCart(request, token);
    const cart: CartDto = await cartResponse.json();
    expect(cart.totalItems).toBe(3);
  });

  test('should remove product from cart', async ({ request, page }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, token);
    const product: ProductDto = await createResponse.json();
    await page.reload();
    const productLocator = productsPage.getProductByName(product.name);
    await productsPage.addProductToCart(product.name);
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
    const cartResponse = await getCart(request, token);
    const cart: CartDto = await cartResponse.json();
    expect(cart.totalItems).toBe(0);
  });

});
