import { test, expect } from '../../fixtures/uiAuthFixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';

test.describe('Products page UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page, authenticatedUiClientUser }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test('should display products with default settings', async () => {
    // then
    await productsPage.expectToBeOnProductsPage();
    await productsPage.expectPageHeading('Products');
    await productsPage.expectProductsHeading('All Products');
    await productsPage.expectSortOption('name-asc');
    await productsPage.expectMinimumProductCards(5);

    const firstProduct = await productsPage.getProductCard(0);
    await productsPage.expectProductHasElements(firstProduct);
    await productsPage.expectAddToCartButton(firstProduct);
  });

  test('should filter products by category', async () => {
    // when
    await productsPage.clickCategory('electronics');

    // then
    await productsPage.expectProductsHeading('Electronics Products');
    await productsPage.expectAllProductsHaveCategory('Electronics');

    // when
    await productsPage.clickCategory('all');

    // then
    await productsPage.expectProductsHeading('All Products');
    await productsPage.expectMinimumProductCards(5);
  });

  test('should search for products', async () => {
    // when
    await productsPage.search('iPhone');

    // then
    await productsPage.expectMinimumProductCards(1);
    const firstProduct = await productsPage.getProductCard(0);
    const productName = await productsPage.getProductName(firstProduct);
    expect(productName).toContain('iPhone');

    // when
    await productsPage.clearSearch();

    // then
    await productsPage.expectMinimumProductCards(5);
  });

  test('should sort products by price', async () => {
    // when
    await productsPage.selectSort('price-asc');

    // then
    await productsPage.expectProductsSortedByPriceAscending();

    // when
    await productsPage.selectSort('price-desc');

    // then
    await productsPage.expectProductsSortedByPriceDescending();
  });

  test('should add product to cart', async () => {
    // given
    const firstProduct = await productsPage.getProductCard(0);
    const productName = await productsPage.getProductName(firstProduct);
    
    // when
    await productsPage.increaseQuantity(firstProduct);
    await productsPage.addToCart(firstProduct);

    // then
    await productsPage.expectToastMessage('Added to cart');
    await productsPage.expectToastMessage(productName || '');
    await productsPage.expectCartCount(2);
    await productsPage.expectInCartText(firstProduct, 2);
    await productsPage.expectUpdateCartButton(firstProduct);
    await productsPage.expectRemoveFromCartButton(firstProduct);
  });

  test('should update product quantity in cart', async () => {
    // given
    const firstProduct = await productsPage.getProductCard(0);

    // when
    await productsPage.addToCart(firstProduct);
    await productsPage.expectCartCount(1);

    // when
    await productsPage.increaseQuantity(firstProduct);
    await productsPage.increaseQuantity(firstProduct);

    // when
    await productsPage.updateCart(firstProduct);
    await productsPage.expectToastMessage('Cart updated');
    await productsPage.expectCartCount(3);
    await productsPage.expectInCartText(firstProduct, 3);
  });

  test('should remove product from cart', async () => {
    // given
    const firstProduct = await productsPage.getProductCard(0);
    const productName = await productsPage.getProductName(firstProduct);
    
    // when
    await productsPage.addToCart(firstProduct);

    // then
    await productsPage.expectCartCount(1);

    // when
    await productsPage.removeFromCart(firstProduct);

    // then
    await productsPage.expectToastMessage('Removed from cart');
    await productsPage.expectToastMessage(productName || '');
    await productsPage.expectCartEmpty();
    await productsPage.expectAddToCartButton(firstProduct);
  });

  test('should navigate to product detail page', async ({ page }) => {
    // given  
    const productDetailPage = new ProductDetailPage(page);
    const firstProduct = await productsPage.getProductCard(0);
    const productName = await productsPage.getProductName(firstProduct);

    // when
    await productsPage.clickProductCard(firstProduct);

    // then
    await productDetailPage.expectToBeOnProductDetailPage();
    await productDetailPage.expectProductName(productName || '');
    await productDetailPage.expectProductDetailsVisible();

    // when
    await productDetailPage.clickBackToProducts();

    // then
    await productsPage.expectToBeOnProductsPage();
  });
});
