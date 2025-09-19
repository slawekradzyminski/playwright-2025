import { expect, type Page, type Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';

export class Toast {
  readonly page: Page;
  readonly toastViewport: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toastViewport = page.getByTestId('toast-viewport');
  }

  async verifySuccessMessage(expectedMessage: string) {
    await expect(this.toastViewport).toContainText(expectedMessage);
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.toastViewport).toContainText(expectedMessage);
  }

  async waitForToastToAppear() {
    await expect(this.toastViewport.locator('[role="status"]')).toBeVisible();
  }

  async waitForToastToDisappear() {
    await expect(this.toastViewport.locator('[role="status"]')).not.toBeVisible();
  }
}

export abstract class BasePage {
  readonly page: Page;
  private toast: Toast;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
  }

  getToast(): Toast {
    return this.toast;
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
