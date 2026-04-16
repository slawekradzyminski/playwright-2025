import { Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';


export class HomePage extends BasePage {
 static readonly url = `${APP_BASE_URL}`;

 readonly page: Page;
 readonly welcomeMessage: Locator;

 constructor(page: Page) {
   super(page);
   this.page = page;
   this.welcomeMessage = page.getByTestId('home-welcome-title');
 }

}
