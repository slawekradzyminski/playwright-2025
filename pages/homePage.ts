import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  static readonly url = '/';

  private readonly welcomeTitle: Locator;
  private readonly userEmail: Locator;
  private readonly productsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.productsButton = page.getByTestId('home-products-button');
  }

  async open(): Promise<void> {
    await this.page.goto(HomePage.url);
  }

  async assertThatHomePageIsVisible(
    expectedUserEmail = 'awesome@testing.com',
    expectedFirstName?: string
  ): Promise<void> {
    const expectedWelcomeText = expectedFirstName ? `Welcome, ${expectedFirstName}!` : 'Welcome';

    await expect(this.welcomeTitle).toContainText(expectedWelcomeText);
    await expect(this.userEmail).toHaveText(expectedUserEmail);
    await expect(this.productsButton).toBeVisible();
  }
}
