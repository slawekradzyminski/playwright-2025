import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class QrCodePage extends BasePage {
  static readonly url = `${APP_BASE_URL}/qr`;

  readonly page: Page;
  readonly qrCodeTitle: Locator;
  readonly loggedInHeader: LoggedInHeaderComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.qrCodeTitle = page.getByTestId('qr-code-title');
    this.loggedInHeader = new LoggedInHeaderComponent(page);
  }
}
