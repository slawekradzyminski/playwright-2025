import { expect, type Locator, type Page } from '@playwright/test';

export class LoggedInHeaderComponent {
  private readonly navigation: Locator;
  private readonly productsLink: Locator;
  private readonly cartLink: Locator;
  private readonly cartItemCount: Locator;
  private readonly profileLink: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.navigation = page.getByTestId('navigation');
    this.productsLink = page.getByTestId('desktop-menu-products');
    this.cartLink = page.getByTestId('desktop-cart-icon');
    this.cartItemCount = page.getByTestId('cart-item-count');
    this.profileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async assertThatHeaderIsVisible(expectedUserName: string): Promise<void> {
    await expect(this.navigation).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await expect(this.profileLink).toHaveText(expectedUserName);
    await expect(this.logoutButton).toBeVisible();
  }

  async assertThatCartCountIs(count: number): Promise<void> {
    await expect(this.cartItemCount).toHaveText(String(count));
  }

  async assertThatCartIsEmpty(): Promise<void> {
    await expect(this.cartItemCount).toBeHidden();
  }
}
