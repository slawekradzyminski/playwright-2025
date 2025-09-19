import { expect, Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { LoggedInPage } from './loggedInPage';

export class ProductsPage extends LoggedInPage {

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/products`);
  }

}
