import { test, expect } from '../../fixtures/productDetailsUiFixture';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { resetCart } from '../helpers';

test.describe('Product Details UI', () => {
  test.beforeEach(async ({ adminUiAuth, request }) => {
    // given - clear cart before each test
    await resetCart(request, adminUiAuth.token);
  });

  test('should display product details correctly', async ({ productDetailsPage, testProduct }) => {
    // when
    await productDetailsPage.goto(testProduct.created.id);

    // then
    await expect(productDetailsPage.page).toHaveURL(
      ProductDetailsPage.getProductUrl(testProduct.created.id)
    );
    await expect(productDetailsPage.productName).toHaveText(testProduct.created.name);
    await expect(productDetailsPage.productPrice).toContainText(
      testProduct.created.price.toFixed(2)
    );
    await expect(productDetailsPage.productCategory).toHaveText(testProduct.created.category);
    await expect(productDetailsPage.productStock).toContainText(
      `${testProduct.created.stockQuantity}`
    );
  });

  test('should display product description when available', async ({
    productDetailsPage,
    createProduct
  }) => {
    // given
    const productWithDescription = await createProduct({
      description: 'A detailed product description for testing purposes'
    });

    // when
    await productDetailsPage.goto(productWithDescription.created.id);

    // then
    await expect(productDetailsPage.productDescription).toHaveText(
      productWithDescription.data.description!
    );
  });

  test('should navigate back to products list', async ({
    page,
    productDetailsPage,
    testProduct
  }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);

    // when
    await productDetailsPage.navigateBackToProducts();

    // then
    await expect(page).toHaveURL(ProductsPage.URL);
  });

  test('should navigate to product details from products list', async ({
    page,
    testProduct,
    productDetailsPage
  }) => {
    // given
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await expect(productsPage.productItems.first()).toBeVisible();

    // when
    await productsPage.clickProduct(testProduct.created.name);

    // then
    await expect(page).toHaveURL(ProductDetailsPage.getProductUrl(testProduct.created.id));
    await expect(productDetailsPage.productName).toHaveText(testProduct.created.name);
  });

  test('should display initial quantity as 1', async ({ productDetailsPage, testProduct }) => {
    // when
    await productDetailsPage.goto(testProduct.created.id);

    // then
    await expect(productDetailsPage.quantityValue).toHaveText('1');
  });

  test('should increase and decrease quantity', async ({ productDetailsPage, testProduct }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);
    await expect(productDetailsPage.quantityValue).toHaveText('1');

    // when - increase quantity
    await productDetailsPage.increaseQuantity(2);

    // then
    await expect(productDetailsPage.quantityValue).toHaveText('3');

    // when - decrease quantity
    await productDetailsPage.decreaseQuantity();

    // then
    await expect(productDetailsPage.quantityValue).toHaveText('2');
  });

  test('should allow decreasing quantity to 0', async ({ productDetailsPage, testProduct }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);
    await expect(productDetailsPage.quantityValue).toHaveText('1');

    // when
    await productDetailsPage.decreaseQuantity();

    // then
    await expect(productDetailsPage.quantityValue).toHaveText('0');
  });
});

test.describe('Product Details UI - Cart Integration', () => {
  test.beforeEach(async ({ adminUiAuth, request }) => {
    await resetCart(request, adminUiAuth.token);
  });

  test('should add product to cart and show toast notification', async ({
    productDetailsPage,
    testProduct,
    verifyCart
  }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);

    // when
    await productDetailsPage.addToCart();

    // then - verify toast notification
    await expect(productDetailsPage.toast.title).toHaveText('Added to cart');
    await expect(productDetailsPage.toast.description).toContainText(
      `${testProduct.created.name} added to your cart`
    );

    // then - verify cart badge in header
    await expect(productDetailsPage.header.cartLink).toContainText('1');

    // then - verify cart via API
    await verifyCart(1);
  });

  test('should add multiple quantities to cart', async ({
    productDetailsPage,
    testProduct,
    verifyCart
  }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);

    // when
    await productDetailsPage.increaseQuantity(2);
    await productDetailsPage.addToCart();

    // then - verify toast shows correct quantity
    await expect(productDetailsPage.toast.description).toContainText(
      `3 × ${testProduct.created.name}`
    );

    // then - verify cart via API
    await verifyCart(3);
  });

  test('should update cart badge after adding product', async ({
    productDetailsPage,
    testProduct
  }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);
    await productDetailsPage.increaseQuantity(4);

    // when
    await productDetailsPage.addToCart();

    // then
    await expect(productDetailsPage.header.cartLink).toContainText('5');
  });

  test('should navigate to cart from header', async ({ page, productDetailsPage, testProduct }) => {
    // given
    await productDetailsPage.goto(testProduct.created.id);

    // when
    await productDetailsPage.header.cartLink.click();

    // then
    await expect(page).toHaveURL(/\/cart/);
  });
});

test.describe('Product Details UI - Edge Cases', () => {
  test('should handle non-existent product gracefully', async ({ page, productDetailsPage }) => {
    // when
    await productDetailsPage.goto(999999);

    // then - page should handle gracefully (not crash)
    await expect(page).not.toHaveURL(ProductDetailsPage.getProductUrl(999999));
  });

  test('should display product without image correctly', async ({
    productDetailsPage,
    createProduct
  }) => {
    // given
    const productWithoutImage = await createProduct({
      imageUrl: undefined
    });

    // when
    await productDetailsPage.goto(productWithoutImage.created.id);

    // then
    await expect(productDetailsPage.productName).toHaveText(productWithoutImage.created.name);
  });
});

