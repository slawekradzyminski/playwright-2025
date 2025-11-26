import { test as uiAuthTest, expect } from './uiAuthFixture';
import type { ProductCreateDto } from '../types/products';
import type { CartDto } from '../types/cart';
import { createTestProduct, assertCartState, type TestProduct } from '../tests/helpers';
import { ProductsPage } from '../pages/ProductsPage';

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
