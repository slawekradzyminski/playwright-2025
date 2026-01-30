import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly continueShoppingLink: Locator;
  readonly cartSummaryHeading: Locator;
  readonly itemsCountLabel: Locator;
  readonly itemsCountValue: Locator;
  readonly totalLabel: Locator;
  readonly totalValue: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;
  readonly cartItemsHeading: Locator;
  readonly cartItemsTable: Locator;
  readonly emptyCartMessage: Locator;
  readonly browseProductsLink: Locator;
  readonly cartUrl: string;
  readonly productsUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.cartUrl = `${process.env.FRONTEND_URL}/cart`;
    this.productsUrl = `${process.env.FRONTEND_URL}/products`;
    this.pageHeading = page.getByRole('heading', { name: 'Your Cart', level: 1 });
    this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });
    this.cartSummaryHeading = page.getByRole('heading', { name: 'Cart Summary', level: 2 });
    this.itemsCountLabel = page.getByText('Items', { exact: true });
    this.itemsCountValue = page.getByTestId('cart-items-count');
    this.totalLabel = page.getByText('Total', { exact: true });
    this.totalValue = page.getByTestId('cart-total-value');
    this.checkoutButton = page.getByTestId('cart-checkout-button');
    this.clearCartButton = page.getByTestId('cart-clear-button');
    this.cartItemsHeading = page.getByRole('heading', { name: 'Cart Items', level: 2 });
    this.cartItemsTable = page.getByRole('table');
    this.emptyCartMessage = page.getByText('Your cart is empty');
    this.browseProductsLink = page.getByRole('link', { name: 'Browse Products' });
  }

  async goto() {
    await this.page.goto(this.cartUrl);
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async expectToBeOnCartPage() {
    await expect(this.page).toHaveURL(this.cartUrl);
  }

  async expectPageHeadingVisible() {
    await expect(this.pageHeading).toBeVisible();
  }

  async expectContinueShoppingLinkVisible() {
    await expect(this.continueShoppingLink).toBeVisible();
  }

  async expectEmptyCartState() {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.browseProductsLink).toBeVisible();
  }

  async expectCartWithItems() {
    await expect(this.cartSummaryHeading).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.clearCartButton).toBeVisible();
    await expect(this.cartItemsHeading).toBeVisible();
    await expect(this.cartItemsTable).toBeVisible();
  }

  async expectCartItemsCount(count: string | number) {
    await expect(this.itemsCountValue).toHaveText(String(count));
  }

  async expectCartTotal(total: string | RegExp) {
    await expect(this.totalValue).toHaveText(total);
  }

  async expectFirstCartItemVisible() {
    const firstRow = this.cartItemsTable.getByRole('row').nth(1);
    await expect(firstRow).toBeVisible();
  }

  async incrementFirstItemQuantity() {
    const firstRow = this.cartItemsTable.getByRole('row').nth(1);
    const increaseButton = firstRow.getByRole('button', { name: '+' });
    await increaseButton.click();
  }

  async decrementFirstItemQuantity() {
    const firstRow = this.cartItemsTable.getByRole('row').nth(1);
    const decreaseButton = firstRow.getByRole('button', { name: '-' });
    await decreaseButton.click();
  }

  async removeFirstItem() {
    const firstRow = this.cartItemsTable.getByRole('row').nth(1);
    const removeButton = firstRow.getByRole('button', { name: 'Remove' });
    await removeButton.click();
  }

  async clearCart() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.clearCartButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async clickContinueShopping() {
    await this.continueShoppingLink.click();
  }

  async clickBrowseProducts() {
    await this.browseProductsLink.click();
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(this.productsUrl);
  }
}
