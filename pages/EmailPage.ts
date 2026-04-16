import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class EmailPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/email`;

  readonly page: Page;
  readonly emailTitle: Locator;
  readonly loggedInHeader: LoggedInHeaderComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.emailTitle = page.getByTestId('email-page-title');
    this.loggedInHeader = new LoggedInHeaderComponent(page);
  }
}
