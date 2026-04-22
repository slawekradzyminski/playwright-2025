import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

interface ExpectedUsersListEntry {
  fullName: string;
  email: string;
  username: string;
  role: string;
}

export class UsersPage extends BasePage {
  static readonly url = '/users';

  readonly header: LoggedInHeaderComponent;

  private readonly pageContainer: Locator;
  private readonly title: Locator;
  private readonly backButton: Locator;
  private readonly usersList: Locator;
  private readonly userItems: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('users-page');
    this.title = page.getByTestId('users-title');
    this.backButton = page.getByTestId('users-back-button');
    this.usersList = page.getByTestId('users-list');
    this.userItems = page.locator('[data-testid^="user-item-"]');
  }

  async open(): Promise<void> {
    await this.page.goto(UsersPage.url);
  }

  async clickEditForUser(username: string): Promise<void> {
    await this.getUserItem(username).getByRole('button', { name: 'Edit' }).click();
  }

  async assertThatUsersPageIsVisible(): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText('Users');
    await expect(this.backButton).toHaveText('Back to Home');
    await expect(this.usersList).toBeVisible();
    await expect(this.userItems.first()).toBeVisible();
  }

  async assertThatUserIsVisible(expectedUser: ExpectedUsersListEntry): Promise<void> {
    const userItem = this.getUserItem(expectedUser.username);

    await expect(userItem).toBeVisible();
    await expect(userItem).toContainText(expectedUser.fullName);
    await expect(userItem).toContainText(expectedUser.email);
    await expect(userItem).toContainText(`Username: ${expectedUser.username}`);
    await expect(userItem).toContainText(expectedUser.role);
  }

  async assertThatNoRowActionsAreVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
    await expect(this.page.getByRole('button', { name: 'Delete' })).toHaveCount(0);
  }

  async assertThatUserActionsAreVisible(username: string): Promise<void> {
    const userItem = this.getUserItem(username);

    await expect(userItem.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(userItem.getByRole('button', { name: 'Delete' })).toBeVisible();
  }

  private getUserItem(username: string): Locator {
    return this.userItems.filter({
      has: this.page.getByText(`Username: ${username}`, { exact: true })
    });
  }
}
