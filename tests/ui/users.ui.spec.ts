import { test } from '@playwright/test';
import { UsersPage } from '../../pages/usersPage';

test.describe('Users UI tests', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('should display users page title and back button', async () => {
    await usersPage.expectToBeOnUsersPage();
    await usersPage.expectTitleVisible();
    await usersPage.expectBackButtonVisible();
  });

  test('should display users list with multiple users', async () => {
    await usersPage.expectToBeOnUsersPage();
    await usersPage.expectUsersListVisible();
    await usersPage.expectMinimumUsersCount(5);
  });

  test('should display edit and delete buttons for each user', async () => {
    await usersPage.expectEditButtonVisible(1);
    await usersPage.expectDeleteButtonVisible(1);
    await usersPage.expectEditButtonVisible(2);
    await usersPage.expectDeleteButtonVisible(2);
    await usersPage.expectEditButtonVisible(3);
    await usersPage.expectDeleteButtonVisible(3);
  });

  test('should navigate back to home when back button is clicked', async () => {
    await usersPage.expectBackButtonVisible();
    await usersPage.clickBackButton();
    await usersPage.expectToBeOnHomePage();
  });

  test('should navigate to edit user page when edit button is clicked', async () => {
    await usersPage.expectEditButtonVisible(1);
    await usersPage.clickEditButton(1);
    await usersPage.expectToBeOnEditUserPage('admin');
  });
});
