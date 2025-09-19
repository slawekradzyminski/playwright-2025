import { expect, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from './components/toast';

export abstract class AbstractPage {
  readonly page: Page;
  readonly toast: Toast;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
  }

  async expectToBeOnPage(path: string) {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}${path}`);
  }

  async expectNotToBeOnPage(path: string) {
    await expect(this.page).not.toHaveURL(`${FRONTEND_URL}${path}`);
  }

  async expectToBeOnLoginPage() {
    await this.expectToBeOnPage('/login');
  }

  async expectToNotBeOnLoginPage() {
    await this.expectNotToBeOnPage('/login');
  }

  async expectToBeOnRegisterPage() {
    await this.expectToBeOnPage('/register');
  }

  async expectToBeOnHomePage() {
    await this.expectToBeOnPage('/');
  }
}
