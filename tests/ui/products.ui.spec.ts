import { test, expect } from '../../fixtures/auth.fixtures';
import { ProductsPage } from '../../pages/ProductsPage';
import { FRONTEND_URL } from '../../pages/constants';

test.describe('Products Page', () => {
  test('should display list of products with correct information', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.expectToBeOnProductsPage();
    
    // then
    await productsPage.expectPageElements();
    await productsPage.expectMinimumProductCount(1);
    await productsPage.expectProductVisible('Clean Code');
    await productsPage.expectProductDetails('Clean Code', {
      price: '$44.99',
      category: 'Books',
      description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin'
    });
  });

  test('should filter products by category', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.filterByCategory('Books');
    
    // then
    await productsPage.expectCategoryActive('Books');
    await productsPage.expectCategoryTitle('Books');
    await productsPage.expectProductVisible('Clean Code');
    await productsPage.expectProductDetails('Clean Code', { category: 'Books' });
  });

  test('should filter by Electronics category', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.filterByCategory('Electronics');
    
    // then
    await productsPage.expectCategoryActive('Electronics');
    await productsPage.expectCategoryTitle('Electronics');
    await productsPage.expectProductVisible('iPhone 13 Pro');
    await productsPage.expectProductDetails('iPhone 13 Pro', { category: 'Electronics' });
  });

  test('should filter by Gaming category', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.filterByCategory('Gaming');
    
    // then
    await productsPage.expectCategoryActive('Gaming');
    await productsPage.expectCategoryTitle('Gaming');
    await productsPage.expectProductVisible('PlayStation 5');
    await productsPage.expectProductDetails('PlayStation 5', { category: 'Gaming' });
  });

  test('should return to all products when All Products filter is selected', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    await productsPage.filterByCategory('Books');
    
    // when
    await productsPage.filterByCategory('All');
    
    // then
    await productsPage.expectCategoryActive('All');
    await productsPage.expectCategoryTitle('All');
    await productsPage.expectMinimumProductCount(5);
    await productsPage.expectProductVisible('Clean Code');
    await productsPage.expectProductVisible('iPhone 13 Pro');
    await productsPage.expectProductVisible('PlayStation 5');
  });

  test('should search products functionality', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.searchProducts('Clean Code');
    
    // then
    await productsPage.expectSearchValue('Clean Code');
    await productsPage.expectClearSearchButtonVisible();
    await productsPage.expectProductVisible('Clean Code');
    // Search might return multiple results containing "Clean Code"
    await productsPage.expectMinimumProductCount(1);
  });

  test('should search for iPhone products', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.searchProducts('iPhone');
    
    // then
    await productsPage.expectSearchValue('iPhone');
    await productsPage.expectProductVisible('iPhone 13 Pro');
  });

  test('should clear search functionality', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    await productsPage.searchProducts('Clean Code');
    await productsPage.expectMinimumProductCount(1);
    
    // when
    await productsPage.clearSearch();
    
    // then
    await productsPage.expectSearchValue('');
    await productsPage.expectMinimumProductCount(5);
  });

  test('should sort products by Name A-Z', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.sortProducts('Name (A-Z)');
    
    // then
    await productsPage.expectSortValue('Name (A-Z)');
    await productsPage.expectProductsSortedByName(true);
  });

  test('should sort products by Name Z-A', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.sortProducts('Name (Z-A)');
    
    // then
    await productsPage.expectSortValue('Name (Z-A)');
    await productsPage.expectProductsSortedByName(false);
  });

  test('should sort products by Price Low to High', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.sortProducts('Price (Low to High)');
    
    // then
    await productsPage.expectSortValue('Price (Low to High)');
    await productsPage.expectProductsSortedByPrice(true);
  });

  test('should sort products by Price High to Low', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.sortProducts('Price (High to Low)');
    
    // then
    await productsPage.expectSortValue('Price (High to Low)');
    await productsPage.expectProductsSortedByPrice(false);
  });

  test('should add products to cart with quantity controls', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.addProductToCart('Clean Code');
    
    // then
    await productsPage.expectAddToCartNotification();
    await productsPage.expectProductInCart('Clean Code', 1);
  });

  test('should increase product quantity and add to cart', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.updateProductQuantity('Clean Code', 'increase');
    await productsPage.addProductToCart('Clean Code');
    
    // then
    await productsPage.expectAddToCartNotification();
    await productsPage.expectProductInCart('Clean Code', 2);
  });

  test('should navigate to product details page', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.clickProduct('Clean Code');
    
    // then
    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(page.getByRole('heading', { name: 'Clean Code', level: 1 })).toBeVisible();
    await expect(page.getByText('$44.99')).toBeVisible();
    await expect(page.getByText('A Handbook of Agile Software Craftsmanship by Robert C. Martin')).toBeVisible();
    await expect(page.getByText('Books')).toBeVisible();
    await expect(page.getByRole('link', { name: '← Back to Products' })).toBeVisible();
  });

  test('should navigate back to products from product details', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    await productsPage.clickProduct('Clean Code');
    await expect(page).toHaveURL(/\/products\/\d+/);
    
    // when
    await page.getByRole('link', { name: '← Back to Products' }).click();
    
    // then
    await productsPage.expectToBeOnProductsPage();
  });

  test('should combine filtering and searching', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.filterByCategory('Books');
    await productsPage.searchProducts('Clean');
    
    // then
    await productsPage.expectCategoryActive('Books');
    await productsPage.expectSearchValue('Clean');
    await productsPage.expectProductVisible('Clean Code');
    await productsPage.expectMinimumProductCount(1);
  });

  test('should combine filtering and sorting', async ({ page, loggedInClient }) => {
    // given
    const productsPage = new ProductsPage(page);
    await page.goto(`${FRONTEND_URL}/products`);
    
    // when
    await productsPage.filterByCategory('Electronics');
    await productsPage.sortProducts('Price (Low to High)');
    
    // then
    await productsPage.expectCategoryActive('Electronics');
    await productsPage.expectSortValue('Price (Low to High)');
    await productsPage.expectProductVisible('iPhone 13 Pro');
  });
});
