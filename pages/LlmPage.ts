import { Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class LlmPage extends BasePage {
 static readonly url = `${APP_BASE_URL}/llm`;

 readonly page: Page;
 readonly llmTitle: Locator;
 readonly loggedInHeader: LoggedInHeaderComponent;

 constructor(page: Page) {
   super(page);
   this.page = page;
   this.llmTitle = page.getByTestId('llm-title');
   this.loggedInHeader = new LoggedInHeaderComponent(page);
 }

}
