import { expect } from '@playwright/test';
import type { ProductDetailsPage } from '../pages/product-details.page';
import type { ProductsPage } from '../pages/products.page';
import type { ProductSeedSession } from './product-data.util';

export interface OpenSeededProductDetailsResult {
  createdProductName: string;
  initialCartCount: number;
}

export const openSeededProductDetails = async (
  seedSession: ProductSeedSession,
  tokenPrefix: string,
  productsPage: ProductsPage,
  productDetailsPage: ProductDetailsPage,
): Promise<OpenSeededProductDetailsResult> => {
  const uniqueToken = seedSession.buildProductToken(tokenPrefix);
  const createdProduct = await seedSession.createProduct({
    name: `${uniqueToken}-product`,
    category: 'Books',
  });
  await seedSession.waitForProductsToBeQueryable([createdProduct.id]);

  await productsPage.goto();
  await productsPage.search(uniqueToken);
  await expect(productsPage.productItems).toHaveCount(1);
  await productsPage.openFirstProductCard();
  await expect(productDetailsPage.title).toHaveText(createdProduct.name);

  return {
    createdProductName: createdProduct.name,
    initialCartCount: await productDetailsPage.getCartCount(),
  };
};
