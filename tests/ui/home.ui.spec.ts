import { test, expect } from '../../fixtures/auth.fixtures';
import { HomePage } from '../../pages/HomePage';
import { FRONTEND_URL } from '../../pages/constants';

test.describe('Home Page', () => {
  test('should display welcome message and user email', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    // User is already logged in via fixture
    
    // then
    await homePage.expectUserEmail(loggedInClient.user.email);
    await homePage.expectWelcomeMessage(loggedInClient.user.firstName);
  });

  test('should navigate to products via "View Products" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickViewProducts();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/products`);
  });

  test('should navigate to users via "Manage Users" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickManageUsers();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/users`);
  });

  test('should navigate to profile via "View Profile & Orders" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickViewProfile();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/profile`);
  });

  test('should navigate to traffic monitor via "Open Traffic Monitor" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickTrafficMonitor();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/traffic`);
  });

  test('should navigate to AI assistant via "Open AI Assistant" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickAiAssistant();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/llm`);
  });

  test('should navigate to QR generator via "Generate QR Codes" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickQrGenerator();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/qr`);
  });

  test('should navigate to email service via "Send Emails" button', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);
    
    // when
    await homePage.clickEmailService();
    
    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/email`);
  });
});
