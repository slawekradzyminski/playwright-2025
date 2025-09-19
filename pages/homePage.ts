import { expect, Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { BasePage } from './basePage';

export class HomePage extends BasePage {

  readonly userEmail: Locator;
  readonly viewProductsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.userEmail = page.getByTestId('home-user-email');
    this.viewProductsLink = page.getByTestId('home-products-button')
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/`);
  }

  async verifyUserEmail(email: string) {
    await expect(this.userEmail).toHaveText(email);
  }

  async clickViewProducts() {
    await this.viewProductsLink.click();
  }
}
