import { expect, type Locator, type Page } from '@playwright/test';
import { USERS_ENDPOINT } from '../httpclients/usersClient';
import type { UserEditDto } from '../types/auth';
import { BasePage } from './basePage';

export class EditUserPage extends BasePage {
  static readonly urlPattern = /\/users\/[^/]+\/edit$/;

  private readonly pageContainer: Locator;
  private readonly title: Locator;
  private readonly username: Locator;
  private readonly emailInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly cancelButton: Locator;
  private readonly submitButton: Locator;
  private readonly deniedState: Locator;
  private readonly notFoundState: Locator;

  constructor(page: Page) {
    super(page);
    this.pageContainer = page.getByTestId('edit-user-page');
    this.title = page.getByTestId('edit-user-title');
    this.username = page.getByTestId('edit-user-username');
    this.emailInput = page.getByTestId('edit-user-email-input');
    this.firstNameInput = page.getByTestId('edit-user-firstname-input');
    this.lastNameInput = page.getByTestId('edit-user-lastname-input');
    this.cancelButton = page.getByTestId('edit-user-cancel-button');
    this.submitButton = page.getByTestId('edit-user-submit-button');
    this.deniedState = page.getByTestId('edit-user-denied');
    this.notFoundState = page.getByTestId('edit-user-not-found');
  }

  async open(username: string): Promise<void> {
    await this.page.goto(`/users/${username}/edit`);
  }

  async clearEmailAndSubmit(): Promise<void> {
    await this.emailInput.fill('');
    await this.submitButton.click();
  }

  async updateUser(username: string, user: UserEditDto): Promise<void> {
    await this.emailInput.fill(user.email);

    if (user.firstName !== undefined) {
      await this.firstNameInput.fill(user.firstName);
    }

    if (user.lastName !== undefined) {
      await this.lastNameInput.fill(user.lastName);
    }

    const responsePromise = this.page.waitForResponse(
      (response) => response.request().method() === 'PUT' && response.url().endsWith(`${USERS_ENDPOINT}/${username}`)
    );

    await this.submitButton.click();
    await responsePromise;
  }

  async assertThatAccessDeniedIsVisible(): Promise<void> {
    await expect(this.deniedState).toHaveText('Access denied');
  }

  async assertThatNotFoundIsVisible(): Promise<void> {
    await expect(this.notFoundState).toHaveText('User not found', { timeout: 15_000 });
  }

  async assertThatEditFormIsVisible(username: string): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText('Edit User');
    await expect(this.username).toHaveText(`Editing user: ${username}`);
    await expect(this.emailInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.cancelButton).toHaveText('Cancel');
    await expect(this.submitButton).toHaveText('Save Changes');
  }

  async assertThatUserValuesAreFilled(user: Pick<UserEditDto, 'email' | 'firstName' | 'lastName'>): Promise<void> {
    await expect(this.emailInput).toHaveValue(user.email);
    await expect(this.firstNameInput).toHaveValue(user.firstName ?? '');
    await expect(this.lastNameInput).toHaveValue(user.lastName ?? '');
  }

  async assertThatEmailFieldIsRequired(): Promise<void> {
    const validationMessage = await this.emailInput.evaluate((input) => (input as HTMLInputElement).validationMessage);

    expect(validationMessage).toMatch(/Please fill (in|out) this field\./);
  }
}
