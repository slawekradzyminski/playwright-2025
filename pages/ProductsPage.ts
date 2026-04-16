import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class ProductsPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/products`;

  readonly page: Page;
  readonly productsTitle: Locator;
  readonly loggedInHeader: LoggedInHeaderComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.productsTitle = page.getByTestId('products-title');
    this.loggedInHeader = new LoggedInHeaderComponent(page);
  }
}
