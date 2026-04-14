import { faker } from '@faker-js/faker';
import { test as clientAuthTest, expect, APP_BASE_URL } from '../../../fixtures/clientAuthFixture';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductDto } from '../../../types/product';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { withAdminProducts } from '../helpers/productFixtureHelper';

type ClientProductDetailFixtures = {
  testProduct: ProductDto;
  productDetailPage: ProductDetailPage;
};

export const test = clientAuthTest.extend<ClientProductDetailFixtures>({
  testProduct: async ({}, use) => {
    const suffix = faker.string.alphanumeric({ length: 8, casing: 'lower' });

    // name and price are fixed for predictable assertions; other fields from generator
    const input = {
      ...generateProduct(),
      name: `Detail Test Product ${suffix}`,
      price: 123.45,
      category: `TestUI-${suffix}`,
    };

    await withAdminProducts([input], async ([product]) => {
      await use(product);
    });
  },

  productDetailPage: async ({ page, authenticatedClientUser, testProduct }, use) => {
    // given — inject client auth tokens into localStorage
    await page.addInitScript(({ token, refreshToken }) => {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('refreshToken', refreshToken);
    }, {
      token: authenticatedClientUser.token,
      refreshToken: authenticatedClientUser.refreshToken,
    });

    const productDetailPage = new ProductDetailPage(page);

    // when — navigate directly to the product detail page
    await productDetailPage.goto(testProduct.id);

    await use(productDetailPage);
  },
});

export { expect, APP_BASE_URL };
