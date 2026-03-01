import type { Locator, Page } from '@playwright/test';

export class LoggedInHeaderComponent {
  readonly navigation: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly adminLink: Locator;
  readonly cartIconLink: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.navigation = page.getByTestId('navigation');
    this.homeLink = page.getByTestId('desktop-menu-home');
    this.productsLink = page.getByTestId('desktop-menu-products');
    this.sendEmailLink = page.getByTestId('desktop-menu-send-email');
    this.qrCodeLink = page.getByTestId('desktop-menu-qr-code');
    this.llmLink = page.getByTestId('desktop-menu-llm');
    this.trafficMonitorLink = page.getByTestId('desktop-menu-traffic-monitor');
    this.adminLink = page.getByTestId('desktop-menu-admin');
    this.cartIconLink = page.getByTestId('desktop-cart-icon');
    this.profileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
}
