import { test } from '@playwright/test';
import { CartPage } from '../../pages/cartPage';

test.describe('Cart UI tests', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await cartPage.goto();
  });

  test('should display empty cart state when cart is empty', async () => {
    await cartPage.expectToBeOnCartPage();
    await cartPage.expectPageHeadingVisible();
    
    const hasItems = await cartPage.page.getByTestId('cart-clear-button').isVisible();
    if (hasItems) {
      await cartPage.clearCart();
      await cartPage.page.waitForTimeout(1000);
    }
    
    await cartPage.expectEmptyCartState();
    await cartPage.expectContinueShoppingLinkVisible();
  });

  test('should navigate to products page from empty cart', async () => {
    await cartPage.clickContinueShopping();
    await cartPage.expectToBeOnProductsPage();
  });

  test('should navigate to products page via browse products link', async () => {
    const hasItems = await cartPage.page.getByTestId('cart-clear-button').isVisible();
    if (hasItems) {
      await cartPage.clearCart();
      await cartPage.page.waitForTimeout(1000);
    }
    
    await cartPage.clickBrowseProducts();
    await cartPage.expectToBeOnProductsPage();
  });
});
