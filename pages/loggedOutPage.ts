import { type Page } from '@playwright/test';
import { AbstractPage } from './abstractPage';
import { LoggedOutHeader } from './components/loggedOutHeader';

export abstract class LoggedOutPage extends AbstractPage {
  readonly header: LoggedOutHeader;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedOutHeader(page);
  }
}
