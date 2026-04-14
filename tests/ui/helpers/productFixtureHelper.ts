import { request as playwrightRequest } from '@playwright/test';
import { loginUserForTokens } from '../../../helpers/authHelper';
import { ProductClient } from '../../../httpclients/productClient';
import type { ProductCreateDto, ProductDto } from '../../../types/product';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

/**
 * Creates products via the admin API, yields them to the callback, then deletes them on exit.
 * Mirrors the Playwright fixture `use()` pattern so it fits naturally inside fixture bodies.
 */
export async function withAdminProducts(
  inputs: ProductCreateDto[],
  use: (products: ProductDto[]) => Promise<void>
): Promise<void> {
  const adminContext = await playwrightRequest.newContext({ baseURL: APP_BASE_URL });
  const { token: adminToken } = await loginUserForTokens(
    adminContext,
    { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
    ''
  );
  const productClient = new ProductClient(adminContext, APP_BASE_URL);

  const products: ProductDto[] = [];
  for (const input of inputs) {
    const response = await productClient.createProduct(input, adminToken);
    products.push(await response.json());
  }

  await use(products);

  for (const product of products) {
    await productClient.deleteProduct(product.id, adminToken);
  }
  await adminContext.dispose();
}
