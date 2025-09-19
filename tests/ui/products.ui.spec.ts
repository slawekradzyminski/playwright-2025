import { test, expect } from '../../fixtures/uiAuth';
import { ProductsPage } from '../../pages/productsPage';

test.describe('Products UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ uiAuth }) => {
    productsPage = new ProductsPage(uiAuth.page);
    await productsPage.goto();
  });

  test.describe('Products UI tests', () => {
    test('should display products list', async ({ uiAuth }) => {
      // then
      
      // wait 3 seconds
    });
  });

}); 