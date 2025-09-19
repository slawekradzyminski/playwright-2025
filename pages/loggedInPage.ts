import { type Page } from '@playwright/test';
import { AbstractPage } from './abstractPage';
import { LoggedInHeader } from './components/loggedInHeader';
import { Toast } from './components/toast';

export abstract class LoggedInPage extends AbstractPage {
  readonly header: LoggedInHeader;
  readonly toast: Toast;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeader(page);
    this.toast = new Toast(page);
  }
}
