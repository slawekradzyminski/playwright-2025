import { expect, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
