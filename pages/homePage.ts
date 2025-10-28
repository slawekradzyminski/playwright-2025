import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  readonly userEmail: Locator;
  constructor(page: Page) {
    super(page);
    this.userEmail = page.getByTestId('home-user-email');
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toHaveText(email);
  }
}