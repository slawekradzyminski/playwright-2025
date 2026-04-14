import { test, expect, APP_BASE_URL } from './fixtures/clientProductsFixture';

const PRODUCTS_URL = `${APP_BASE_URL}/products`;

test.describe('Products page UI tests', () => {
  test('should load products page with title and category sidebar', async ({ productsPage }) => {
    // then
    await productsPage.expectPageLoaded();
    await expect(productsPage.page.getByTestId('products-categories-title')).toBeVisible();
    await expect(productsPage.categoryButton('All Products')).toBeVisible();
  });

  test('should display created test products in the list', async ({ productsPage, productTestData }) => {
    // given
    const { products, category } = productTestData;

    // when
    await productsPage.filterByCategory(category);

    // then
    await expect(productsPage.productItems).toHaveCount(products.length);
    for (const product of products) {
      await expect(productsPage.productItemByName(product.name)).toBeVisible();
    }
  });

  test('should filter products by category and update section heading', async ({ productsPage, productTestData }) => {
    // given
    const { category } = productTestData;

    // when
    await productsPage.filterByCategory(category);

    // then
    await productsPage.expectListTitle(category);
    await expect(productsPage.categoryButton(category)).toBeVisible();
    await expect(productsPage.productItems).toHaveCount(3);
  });

  test('should reset to all products when All Products is selected', async ({ productsPage, productTestData }) => {
    // given
    const { category } = productTestData;
    await productsPage.filterByCategory(category);
    await expect(productsPage.productItems).toHaveCount(3);

    // when
    await productsPage.categoryButton('All Products').click();

    // then
    await productsPage.expectListTitle('All Products');
    const count = await productsPage.productItems.count();
    expect(count).toBeGreaterThan(3);
  });

  test('should filter products by search query', async ({ productsPage, productTestData }) => {
    // given
    const { products } = productTestData;
    const targetProduct = products[0];

    // when
    await productsPage.search(targetProduct.name);

    // then
    await expect(productsPage.productItems).toHaveCount(1);
    await expect(productsPage.productItemByName(targetProduct.name)).toBeVisible();
  });

  test('should show all test products when searching by common suffix', async ({ productsPage, productTestData }) => {
    // given
    const { products, category } = productTestData;
    // extract the unique suffix shared by all test product names
    const suffix = products[0].name.split(' ').pop()!;

    // when
    await productsPage.filterByCategory(category);
    await productsPage.search(suffix);

    // then
    await expect(productsPage.productItems).toHaveCount(products.length);
  });

  test('should clear search with the inline clear button', async ({ productsPage, productTestData }) => {
    // given
    const { products, category } = productTestData;
    await productsPage.filterByCategory(category);
    await productsPage.search(products[0].name);
    await expect(productsPage.productItems).toHaveCount(1);

    // when
    await productsPage.clearSearchButton.click();

    // then
    await expect(productsPage.searchInput).toHaveValue('');
    await expect(productsPage.productItems).toHaveCount(3);
  });

  test('should show empty state when search has no results', async ({ productsPage }) => {
    // when
    await productsPage.search('xyznotexist99999');

    // then
    await expect(productsPage.noProductsMessage).toBeVisible();
    await expect(productsPage.resetSearchButton).toBeVisible();
    await expect(productsPage.productItems).toHaveCount(0);
  });

  test('should clear search via reset button in empty state', async ({ productsPage, productTestData }) => {
    // given
    const { category } = productTestData;
    await productsPage.filterByCategory(category);
    await productsPage.search('xyznotexist99999');
    await expect(productsPage.noProductsMessage).toBeVisible();

    // when
    await productsPage.resetSearchButton.click();

    // then
    await expect(productsPage.noProductsMessage).not.toBeVisible();
    await expect(productsPage.productItems).toHaveCount(3);
  });

  test('should sort products by name Z-A', async ({ productsPage, productTestData }) => {
    // given
    const { category } = productTestData;
    await productsPage.filterByCategory(category);

    // when
    await productsPage.sortBy('Name (Z-A)');

    // then — C > B > A alphabetically
    const names = await productsPage.getProductNames();
    expect(names[0]).toMatch(/^C Test /);
    expect(names[1]).toMatch(/^B Test /);
    expect(names[2]).toMatch(/^A Test /);
  });

  test('should sort products by price low to high', async ({ productsPage, productTestData }) => {
    // given
    const { category } = productTestData;
    await productsPage.filterByCategory(category);

    // when
    await productsPage.sortBy('Price (Low to High)');

    // then — A ($10) < C ($30) < B ($50)
    const prices = await productsPage.getProductPrices();
    expect(prices).toEqual(['$10.00', '$30.00', '$50.00']);
  });

  test('should sort products by price high to low', async ({ productsPage, productTestData }) => {
    // given
    const { category } = productTestData;
    await productsPage.filterByCategory(category);

    // when
    await productsPage.sortBy('Price (High to Low)');

    // then — B ($50) > C ($30) > A ($10)
    const prices = await productsPage.getProductPrices();
    expect(prices).toEqual(['$50.00', '$30.00', '$10.00']);
  });

  test('should add product to cart and increment cart badge', async ({ productsPage, productTestData }) => {
    // given
    const { products, category } = productTestData;
    await productsPage.filterByCategory(category);
    const productName = products[0].name;

    // when
    await productsPage.addToCartButton(productName).click();

    // then
    await expect(productsPage.cartItemCount).toHaveText('1');
  });

  test('should show in-cart controls after adding product to cart', async ({ productsPage, productTestData }) => {
    // given
    const { products, category } = productTestData;
    await productsPage.filterByCategory(category);
    const productName = products[0].name;

    // when
    await productsPage.addToCartButton(productName).click();

    // then — quantity indicator + Remove/Update buttons appear; Add to Cart button text changes
    await expect(productsPage.cartQuantityLabel(productName)).toBeVisible();
    await expect(productsPage.removeFromCartButton(productName)).toBeVisible();
    await expect(productsPage.updateCartButton(productName)).toBeVisible();
  });

  test('should navigate to product detail page on card click', async ({ page, productsPage, productTestData }) => {
    // given
    const { products, category } = productTestData;
    await productsPage.filterByCategory(category);
    const product = products[0];

    // when
    await productsPage.productItemByName(product.name).click();

    // then
    await expect(page).toHaveURL(`${PRODUCTS_URL}/${product.id}`);
  });
});
