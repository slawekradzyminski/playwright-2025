import type { Locator, Page } from '@playwright/test';
import { LoggedInHeaderComponent } from '../components/logged-in-header.component';

export class HomePage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly userEmail: Locator;
  readonly header: LoggedInHeaderComponent;
  readonly productsButton: Locator;
  readonly profileButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId('logout-button');
    this.userEmail = page.getByTestId('home-user-email');
    this.header = new LoggedInHeaderComponent(page);
    this.productsButton = page.getByTestId('home-products-button');
    this.profileButton = page.getByTestId('home-profile-button');
  }
}
