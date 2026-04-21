import { expect, type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  static readonly url = `${APP_BASE_URL}/`;

  private readonly welcomeTitle: Locator;
  private readonly userEmail: Locator;
  private readonly productsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.productsButton = page.getByTestId('home-products-button');
  }

  async assertThatHomePageIsVisible(): Promise<void> {
    await expect(this.welcomeTitle).toContainText('Welcome');
    await expect(this.userEmail).toHaveText('awesome@testing.com');
    await expect(this.productsButton).toBeVisible();
  }
}
