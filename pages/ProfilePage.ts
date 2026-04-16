import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class ProfilePage extends BasePage {
  static readonly url = `${APP_BASE_URL}/profile`;

  readonly page: Page;
  readonly profileTitle: Locator;
  readonly loggedInHeader: LoggedInHeaderComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.profileTitle = page.getByTestId('profile-title');
    this.loggedInHeader = new LoggedInHeaderComponent(page);
  }
}
