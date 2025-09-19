import { test, expect } from '../../fixtures/uiAuth';
import { HomePage } from '../../pages/homePage';
import { ProductsPage } from '../../pages/productsPage';

test.describe('Home UI tests', () => {

  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should successfully navigate to products page', async ({ uiAuth }) => {
    // given
    const { page } = uiAuth;
    const productsPage = new ProductsPage(page);
    
    // when
    await homePage.clickViewProducts();

    // then
    await productsPage.expectToBeOnPage('/products');
  });


}); 