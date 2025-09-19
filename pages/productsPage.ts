import { expect, Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { BasePage } from './basePage';

export class ProductsPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/products`);
  }

}
