import { test as uiAuthTest, expect } from './uiAuthFixture';
import type { APIRequestContext, Page } from '@playwright/test';
import type { ProductCreateDto } from '../types/products';
import { createTestProduct, resetCart, assertCartState, type TestProduct } from '../tests/ui/helpers/productTestUtils';
import { ProductsPage } from '../pages/ProductsPage';
import type { CartDto } from '../types/cart';

interface ProductsUiFixtures {
  productsPage: ProductsPage;
  testProduct: TestProduct;
  createProduct: (overrides?: Partial<ProductCreateDto>) => Promise<TestProduct>;
  verifyCart: (expectedTotalItems: number) => Promise<CartDto>;
}

export const test = uiAuthTest.extend<ProductsUiFixtures>({
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  testProduct: async ({ request, adminUiAuth, page }, use) => {
    const product = await createTestProduct(request, adminUiAuth.token);
    await page.reload();
    await use(product);
  },

  createProduct: async ({ request, adminUiAuth, page }, use) => {
    const createdProducts: TestProduct[] = [];

    const factory = async (overrides?: Partial<ProductCreateDto>): Promise<TestProduct> => {
      const product = await createTestProduct(request, adminUiAuth.token, overrides);
      createdProducts.push(product);
      await page.reload();
      return product;
    };

    await use(factory);
  },

  verifyCart: async ({ request, adminUiAuth }, use) => {
    const verify = async (expectedTotalItems: number): Promise<CartDto> => {
      return assertCartState(request, adminUiAuth.token, expectedTotalItems);
    };
    await use(verify);
  }
});

export { expect };

export const setupProductsTest = async (
  request: APIRequestContext,
  token: string,
  page: Page
): Promise<{ productsPage: ProductsPage }> => {
  await resetCart(request, token);
  await page.goto(ProductsPage.URL);
  return { productsPage: new ProductsPage(page) };
};

