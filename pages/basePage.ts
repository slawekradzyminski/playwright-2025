import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { ToastComponent } from './components/toastComponent';
import { LoggedInHeader } from './components/loggedInHeader';

export class BasePage {
  readonly page: Page;
  readonly toast: ToastComponent;
  readonly header: LoggedInHeader;

  constructor(page: Page) {
    this.page = page;
    this.toast = new ToastComponent(page);
    this.header = new LoggedInHeader(page);
  }

  async goto(url: string) {
    await this.page.goto(`${FRONTEND_URL}/${url}`);
  }

  async expectOnPage(url: string) {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/${url}`);
  }

  async expectNotOnPage(url: string) {
    await expect(this.page).not.toHaveURL(`${FRONTEND_URL}/${url}`);
  }

  async expectSuccessToastMessage(message: string) {
    await this.toast.expectSuccessToastMessage(message);
  }

  async expectErrorToastMessage(message: string) {
    await this.toast.expectErrorToastMessage(message);
  }
}