import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { HomePage } from '../../pages/homePage';
import { randomClient } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/signupClient';
import { ProductsPage } from '../../pages/productsPage';

test.describe('Home UI tests', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page, request }) => {
    const user = randomClient();
    await attemptSignup(request, user);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user);
    homePage = new HomePage(page);
  });

  test('should successfully navigate to products page', async ({ page }) => {
    // given
    const productsPage = new ProductsPage(page);
    
    // when
    await homePage.clickViewProducts();

    // then
    await productsPage.expectToBeOnPage('/products');
  });


}); 