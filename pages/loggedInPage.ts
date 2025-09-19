import { type Page } from '@playwright/test';
import { AbstractPage } from './abstractPage';
import { LoggedInHeader } from './components/loggedInHeader';

export abstract class LoggedInPage extends AbstractPage {
  readonly header: LoggedInHeader;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeader(page);
  }
}
