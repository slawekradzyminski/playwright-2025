import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class TrafficPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/traffic`;

  readonly page: Page;
  readonly trafficTitle: Locator;
  readonly loggedInHeader: LoggedInHeaderComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.trafficTitle = page.getByTestId('traffic-title');
    this.loggedInHeader = new LoggedInHeaderComponent(page);
  }
}
