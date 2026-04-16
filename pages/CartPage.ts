import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class CartPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/cart`;

  readonly page: Page;
  readonly cartTitle: Locator;
  readonly loggedInHeader: LoggedInHeaderComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.cartTitle = page.getByTestId('cart-title');
    this.loggedInHeader = new LoggedInHeaderComponent(page);
  }
}
