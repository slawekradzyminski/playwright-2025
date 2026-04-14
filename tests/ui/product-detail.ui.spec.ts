import { test, expect, APP_BASE_URL } from './fixtures/clientProductDetailFixture';

const PRODUCTS_URL = `${APP_BASE_URL}/products`;

test.describe('Product detail page UI tests', () => {
  test('should display all product details on the detail page', async ({ productDetailPage, testProduct }) => {
    // then
    await productDetailPage.expectPageLoaded();
    await expect(productDetailPage.productName).toHaveText(testProduct.name);
    await expect(productDetailPage.productPrice).toHaveText(`$${testProduct.price.toFixed(2)}`);
    await expect(productDetailPage.productDescription).toHaveText(testProduct.description);
    await expect(productDetailPage.productCategory).toHaveText(testProduct.category);
    await expect(productDetailPage.productStock).toContainText(`${testProduct.stockQuantity}`);
  });

  test('should navigate back to products list via back link', async ({ page, productDetailPage }) => {
    // when
    await productDetailPage.backLink.click();

    // then
    await expect(page).toHaveURL(PRODUCTS_URL);
  });

  test('should add product to cart from detail page and increment cart badge', async ({ productDetailPage }) => {
    // when
    await productDetailPage.addToCartButton.click();

    // then
    await expect(productDetailPage.cartItemCount).toHaveText('1');
  });

  test('should switch to Remove/Update buttons after adding to cart', async ({ productDetailPage }) => {
    // when
    await productDetailPage.addToCartButton.click();

    // then — Remove/Update buttons appear (Add to Cart button text mutates to "Update Cart")
    await expect(productDetailPage.removeFromCartButton).toBeVisible();
    await expect(productDetailPage.updateCartButton).toBeVisible();
    await productDetailPage.expectInCartLabel(1);
  });

  test('should increase quantity and update cart', async ({ productDetailPage }) => {
    // given
    await productDetailPage.addToCartButton.click();
    // wait for the full cart state transition — both the Update button AND the quantity stabilising at 1
    await expect(productDetailPage.updateCartButton).toBeVisible();
    await expect(productDetailPage.quantityValue).toHaveText('1');

    // when
    await productDetailPage.increaseQuantity.click();

    // then
    await expect(productDetailPage.quantityValue).toHaveText('2');

    // when
    await productDetailPage.updateCartButton.click();

    // then
    await expect(productDetailPage.cartItemCount).toHaveText('2');
  });
});
