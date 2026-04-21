import { test } from '../../fixtures/authenticatedUiUserFixture';
import { ProductDetailsPage } from '../../pages/productDetailsPage';
import { type ExpectedProductCard, ProductsPage } from '../../pages/productsPage';
import productsData from '../data/products.json';

const products: ExpectedProductCard[] = productsData;
const productNames = products.map((product) => product.name);
const electronicsProductNames = ['iPhone 13 Pro', 'Samsung Galaxy S21'];
const appleWatch = products[0];

test.describe('Products UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
  });

  test('should display product catalog for authenticated user', async ({ authenticatedUiUser }) => {
    // given
    const expectedUserName = `${authenticatedUiUser.userData.firstName} ${authenticatedUiUser.userData.lastName}`;

    // when
    await productsPage.open();

    // then
    await productsPage.assertThatUrlIs(ProductsPage.url);
    await productsPage.header.assertThatHeaderIsVisible(expectedUserName);
    await productsPage.header.assertThatCartIsEmpty();
    await productsPage.assertThatCatalogIsVisible(products);
  });

  test('should filter products by category', async () => {
    // given
    await productsPage.open();

    // when
    await productsPage.selectCategory('Electronics');

    // then
    await productsPage.assertThatListTitleIs('Electronics Products');
    await productsPage.assertThatProductNamesAreVisible(electronicsProductNames);
    await productsPage.assertThatOnlyCategoryIsVisible('Electronics');
  });

  test('should search products by name', async () => {
    // given
    await productsPage.open();

    // when
    await productsPage.searchFor('sony');

    // then
    await productsPage.assertThatProductNamesAreVisible(['Sony WH-1000XM4']);
  });

  test('should combine category filter and search', async () => {
    // given
    await productsPage.open();
    await productsPage.selectCategory('Electronics');

    // when
    await productsPage.searchFor('sony');

    // then
    await productsPage.assertThatListTitleIs('Electronics Products');
    await productsPage.assertThatNoProductsAreVisible();

    // when
    await productsPage.selectCategory('All Products');

    // then
    await productsPage.assertThatListTitleIs('All Products');
    await productsPage.assertThatSearchPhraseIs('sony');
    await productsPage.assertThatProductNamesAreVisible(['Sony WH-1000XM4']);
  });

  test('should sort products by price descending', async () => {
    // given
    await productsPage.open();

    // when
    await productsPage.sortBy('Price (High to Low)');

    // then
    await productsPage.assertThatProductNamesAreInOrder([
      'MacBook Pro 14',
      'iPhone 13 Pro',
      'Samsung Galaxy S21',
      'PlayStation 5',
      'Apple Watch Series 7',
      'Sony WH-1000XM4',
      'Ninja Foodi 9-in-1',
      'Clean Code'
    ]);
    await productsPage.assertThatProductPricesAreSortedDescending();
  });

  test('should change selected product quantity', async () => {
    // given
    await productsPage.open();

    // when
    await productsPage.increaseProductQuantity(appleWatch.name, 2);

    // then
    await productsPage.assertThatProductQuantityIs(appleWatch.name, 3);

    // when
    await productsPage.decreaseProductQuantity(appleWatch.name, 3);

    // then
    await productsPage.assertThatProductQuantityIs(appleWatch.name, 0);
    await productsPage.assertThatProductAddButtonIsDisabled(appleWatch.name);
  });

  test('should add product to cart from product card', async () => {
    // given
    await productsPage.open();
    await productsPage.increaseProductQuantity(appleWatch.name);

    // when
    await productsPage.addProductToCart(appleWatch.name);

    // then
    await productsPage.header.assertThatCartCountIs(2);
    await productsPage.assertThatProductIsInCart(appleWatch.name, 2);
  });

  test('should update existing cart quantity from product card', async () => {
    // given
    await productsPage.open();
    await productsPage.increaseProductQuantity(appleWatch.name);
    await productsPage.addProductToCart(appleWatch.name);
    await productsPage.header.assertThatCartCountIs(2);
    await productsPage.assertThatProductIsInCart(appleWatch.name, 2);

    // when
    await productsPage.increaseProductQuantity(appleWatch.name);
    await productsPage.addProductToCart(appleWatch.name);

    // then
    await productsPage.header.assertThatCartCountIs(3);
    await productsPage.assertThatProductIsInCart(appleWatch.name, 3);
  });

  test('should remove product from cart from product card', async () => {
    // given
    await productsPage.open();
    await productsPage.increaseProductQuantity(appleWatch.name);
    await productsPage.addProductToCart(appleWatch.name);
    await productsPage.header.assertThatCartCountIs(2);
    await productsPage.assertThatProductIsInCart(appleWatch.name, 2);

    // when
    await productsPage.removeProductFromCart(appleWatch.name);

    // then
    await productsPage.header.assertThatCartIsEmpty();
    await productsPage.assertThatProductIsNotInCart(appleWatch.name);
  });

  test('should navigate to product details when product card is clicked', async ({ page }) => {
    // given
    await productsPage.open();

    // when
    await productsPage.openProductDetails(appleWatch.name);

    // then
    const productDetailsPage = new ProductDetailsPage(page);
    await productDetailsPage.assertThatUrlIs(ProductDetailsPage.urlPattern);
    await productDetailsPage.assertThatProductDetailsAreVisible({
      ...appleWatch,
      stock: '60 in stock'
    });
  });

  test('should keep default name ordering on first load', async () => {
    // when
    await productsPage.open();

    // then
    await productsPage.assertThatProductNamesAreInOrder(productNames);
  });
});
