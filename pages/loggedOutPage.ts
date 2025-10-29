import { type Page } from '@playwright/test';
import { BasePage } from './basePage';

export abstract class LoggedOutPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

}