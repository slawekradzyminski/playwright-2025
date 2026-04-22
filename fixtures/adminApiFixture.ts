import { test as base } from '@playwright/test';
import { ADMIN_PASSWORD } from '../config/constants';
import { randomAdminProduct } from '../generators/productGenerator';
import { AdminProductCleanup } from '../helpers/adminProductCleanup';
import { expectJsonResponse } from '../helpers/apiAssertions';
import { type AuthenticatedUser, createAuthenticatedUser } from '../helpers/authenticationHelpers';
import { LoginClient } from '../httpclients/loginClient';
import { ProductsClient } from '../httpclients/productsClient';
import type { LoginResponseDto } from '../types/auth';
import type { ProductCreateDto, ProductDto } from '../types/product';

interface AdminApiFixture {
  adminApiUser: LoginResponseDto;
  clientApiUser: AuthenticatedUser;
  adminProductsClient: ProductsClient;
  adminProductCleanup: AdminProductCleanup;
  createAdminProduct: (productData?: ProductCreateDto) => Promise<ProductDto>;
  trackAdminProduct: (product: Pick<ProductDto, 'id' | 'name'>) => void;
  trackAdminProductId: (productId: number) => void;
  trackAdminProductName: (productName: string) => void;
}

export const test = base.extend<AdminApiFixture>({
  adminApiUser: async ({ request }, use) => {
    const loginClient = new LoginClient(request);
    const loginResponse = await loginClient.signin({
      username: 'admin',
      password: ADMIN_PASSWORD
    });
    const adminApiUser = await expectJsonResponse<LoginResponseDto>(loginResponse, 200);

    await use(adminApiUser);
  },

  clientApiUser: async ({ request }, use) => {
    await use(await createAuthenticatedUser(request));
  },

  adminProductsClient: async ({ request }, use) => {
    await use(new ProductsClient(request));
  },

  adminProductCleanup: async ({ adminApiUser, adminProductsClient }, use) => {
    const cleanup = new AdminProductCleanup(adminProductsClient, adminApiUser.token);

    await use(cleanup);
    await cleanup.cleanup();
  },

  createAdminProduct: async ({ adminApiUser, adminProductsClient, adminProductCleanup }, use) => {
    await use(async (productData = randomAdminProduct()) => {
      adminProductCleanup.trackProductName(productData.name);

      const createResponse = await adminProductsClient.createProduct(productData, adminApiUser.token);
      const createdProduct = await expectJsonResponse<ProductDto>(createResponse, 201);
      adminProductCleanup.trackProduct(createdProduct);

      return createdProduct;
    });
  },

  trackAdminProduct: async ({ adminProductCleanup }, use) => {
    await use((product) => adminProductCleanup.trackProduct(product));
  },

  trackAdminProductId: async ({ adminProductCleanup }, use) => {
    await use((productId) => adminProductCleanup.trackProductId(productId));
  },

  trackAdminProductName: async ({ adminProductCleanup }, use) => {
    await use((productName) => adminProductCleanup.trackProductName(productName));
  }
});

export { expect } from '@playwright/test';
