import { expect, type Locator, type Page } from '@playwright/test';

export class UsersPage {
  readonly page: Page;
  readonly usersTitle: Locator;
  readonly backButton: Locator;
  readonly usersList: Locator;
  readonly usersUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.usersUrl = `${process.env.FRONTEND_URL}/users`;
    this.usersTitle = page.getByTestId('users-title');
    this.backButton = page.getByTestId('users-back-button');
    this.usersList = page.getByTestId('users-list');
  }

  async goto() {
    await this.page.goto(this.usersUrl);
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  getUserItem(index: number): Locator {
    return this.page.getByTestId(`user-item-${index}`);
  }

  getUserName(index: number): Locator {
    return this.page.getByTestId(`user-name-${index}`);
  }

  getUserEmail(index: number): Locator {
    return this.page.getByTestId(`user-email-${index}`);
  }

  getUserUsername(index: number): Locator {
    return this.page.getByTestId(`user-username-${index}`);
  }

  getUserRoles(index: number): Locator {
    return this.page.getByTestId(`user-roles-${index}`);
  }

  getUserEditButton(index: number): Locator {
    return this.page.getByTestId(`user-edit-${index}`);
  }

  getUserDeleteButton(index: number): Locator {
    return this.page.getByTestId(`user-delete-${index}`);
  }

  async clickEditButton(index: number) {
    await this.getUserEditButton(index).click();
  }

  async clickDeleteButton(index: number) {
    await this.getUserDeleteButton(index).click();
  }

  async expectToBeOnUsersPage() {
    await expect(this.page).toHaveURL(this.usersUrl);
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/`);
  }

  async expectToBeOnEditUserPage(username: string) {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/users/${username}/edit`);
  }

  async expectTitleVisible() {
    await expect(this.usersTitle).toBeVisible();
    await expect(this.usersTitle).toHaveText('Users');
  }

  async expectBackButtonVisible() {
    await expect(this.backButton).toBeVisible();
    await expect(this.backButton).toHaveText('Back to Home');
  }

  async expectUsersListVisible() {
    await expect(this.usersList).toBeVisible();
  }

  async expectUserItemVisible(index: number) {
    await expect(this.getUserItem(index)).toBeVisible();
  }

  async expectUserName(index: number, name: string) {
    await expect(this.getUserName(index)).toBeVisible();
    await expect(this.getUserName(index)).toHaveText(name);
  }

  async expectUserEmail(index: number, email: string) {
    await expect(this.getUserEmail(index)).toBeVisible();
    await expect(this.getUserEmail(index)).toHaveText(email);
  }

  async expectUserUsername(index: number, username: string) {
    await expect(this.getUserUsername(index)).toBeVisible();
    await expect(this.getUserUsername(index)).toContainText(username);
  }

  async expectUserRoles(index: number, role: string) {
    await expect(this.getUserRoles(index)).toBeVisible();
    await expect(this.getUserRoles(index)).toContainText(role);
  }

  async expectEditButtonVisible(index: number) {
    await expect(this.getUserEditButton(index)).toBeVisible();
  }

  async expectDeleteButtonVisible(index: number) {
    await expect(this.getUserDeleteButton(index)).toBeVisible();
  }

  async expectMinimumUsersCount(minCount: number) {
    const userItems = this.page.getByTestId(/^user-item-\d+$/);
    const count = await userItems.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }
}
