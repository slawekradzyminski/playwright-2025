import { type Page } from '@playwright/test';
import { LoggedInHeader } from './components/loggedInHeader';
import { BasePage } from './basePage';

export abstract class LoggedInPage extends BasePage {
  readonly header: LoggedInHeader;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeader(page);
  }

}