import type { Locator, Page } from '@playwright/test';

export class LoggedInHeader {
  readonly page: Page;
  readonly navigation: Locator;
  readonly menu: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrLink: Locator;
  readonly llmLink: Locator;
  readonly trafficLink: Locator;
  readonly adminLink: Locator;
  readonly cartLink: Locator;
  readonly userActions: Locator;
  readonly usernameLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByTestId('navigation');
    this.menu = page.getByTestId('desktop-menu');
    this.homeLink = page.getByTestId('desktop-menu-home');
    this.productsLink = page.getByTestId('desktop-menu-products');
    this.sendEmailLink = page.getByTestId('desktop-menu-send-email');
    this.qrLink = page.getByTestId('desktop-menu-qr-code');
    this.llmLink = page.getByTestId('desktop-menu-llm');
    this.trafficLink = page.getByTestId('desktop-menu-traffic-monitor');
    this.adminLink = page.getByTestId('desktop-menu-admin');
    this.cartLink = page.getByTestId('desktop-cart-icon');
    this.userActions = page.getByTestId('user-actions');
    this.usernameLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async clickLogout() {
    await this.logoutButton.click();
  }
}
