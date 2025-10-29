import { type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { LoggedOutHeader } from '../components/loggedOutHeader';

export abstract class LoggedOutPage extends BasePage {
  readonly header: LoggedOutHeader;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedOutHeader(page);
  }

}