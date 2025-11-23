import { test, expect } from '../../fixtures/uiAuthFixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import type { AuthenticatedUser } from '../../fixtures/helpers/authHelper';
import { getAllProducts } from '../../http/products/getAllProductsRequest';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import { generateRandomProduct } from '../../generators/productGenerator';
import { createProduct } from '../../http/products/createProductRequest';

test.describe('Products page UI tests', () => {
  let authenticatedUser: AuthenticatedUser;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page, authenticatedUiClientUser }) => {
    authenticatedUser = authenticatedUiClientUser;
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

  test('should search for products', async ({ request }) => {
    // given
    const suffix = Math.random().toString(36).substring(2, 15);
    const productData: ProductCreateDto = { ...generateRandomProduct(), name: `iPhone ${suffix}` };
    await createProduct(request, authenticatedUser.token, productData);
    
    const response = await getAllProducts(request, authenticatedUser.token);
    const products = await response.json();
    const numberOfProducts = products.filter((p: ProductDto) => p.name.toLowerCase().includes('iphone')).length;

    // when
    await productsPage.search('iPhone');

    // then
    await productsPage.expectProductCardCount(numberOfProducts);
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
    await productsPage.toast.expectToastWithText('Added to cart');
    await productsPage.toast.expectToastWithText(productName || '');
    await productsPage.header.expectCartCount(2);
    await productsPage.expectInCartText(firstProduct, 2);
    await productsPage.expectUpdateCartButton(firstProduct);
    await productsPage.expectRemoveFromCartButton(firstProduct);
  });

  test('should update product quantity in cart', async () => {
    // given
    const firstProduct = await productsPage.getProductCard(0);

    // when
    await productsPage.addToCart(firstProduct);
    await productsPage.header.expectCartCount(1);

    // when
    await productsPage.increaseQuantity(firstProduct);
    await productsPage.increaseQuantity(firstProduct);

    // when
    await productsPage.updateCart(firstProduct);
    await productsPage.toast.expectToastWithText('Cart updated');
    await productsPage.header.expectCartCount(3);
    await productsPage.expectInCartText(firstProduct, 3);
  });

  test('should remove product from cart', async () => {
    // given
    const firstProduct = await productsPage.getProductCard(0);
    const productName = await productsPage.getProductName(firstProduct);
    
    // when
    await productsPage.addToCart(firstProduct);

    // then
    await productsPage.header.expectCartCount(1);

    // when
    await productsPage.removeFromCart(firstProduct);

    // then
    await productsPage.toast.expectToastWithText('Removed from cart');
    await productsPage.toast.expectToastWithText(productName || '');
    await productsPage.header.expectCartEmpty();
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
