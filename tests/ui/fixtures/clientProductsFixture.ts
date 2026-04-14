import { faker } from '@faker-js/faker';
import { test as clientAuthTest, expect, APP_BASE_URL } from '../../../fixtures/clientAuthFixture';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductDto } from '../../../types/product';
import { ProductsPage } from '../pages/ProductsPage';
import { withAdminProducts } from '../helpers/productFixtureHelper';

export type ProductTestData = {
  products: ProductDto[];
  category: string;
};

type ClientProductsFixtures = {
  productTestData: ProductTestData;
  productsPage: ProductsPage;
};

export const test = clientAuthTest.extend<ClientProductsFixtures>({
  productTestData: async ({}, use) => {
    const suffix = faker.string.alphanumeric({ length: 8, casing: 'lower' });
    const category = `TestUI-${suffix}`;

    // name and price are fixed for predictable sort/search assertions;
    // all other fields come from the shared generator
    const inputs = [
      { ...generateProduct(), name: `A Test ${suffix}`, price: 10.00, category },
      { ...generateProduct(), name: `B Test ${suffix}`, price: 50.00, category },
      { ...generateProduct(), name: `C Test ${suffix}`, price: 30.00, category },
    ];

    await withAdminProducts(inputs, async (products) => {
      await use({ products, category });
    });
  },

  productsPage: async ({ page, authenticatedClientUser, productTestData: _ }, use) => {
    // productTestData declared as dependency to ensure products exist before navigation

    // given — inject client auth tokens into localStorage
    await page.addInitScript(({ token, refreshToken }) => {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('refreshToken', refreshToken);
    }, {
      token: authenticatedClientUser.token,
      refreshToken: authenticatedClientUser.refreshToken,
    });

    const productsPage = new ProductsPage(page);

    // when
    await productsPage.goto();

    await use(productsPage);
  },
});

export { expect, APP_BASE_URL };
