import { expect, type APIRequestContext } from '@playwright/test';
import { generateProduct } from '../../../generators/productGenerator';
import { createProductRequest } from '../../../http/products/createProductRequest';
import { deleteProductRequest } from '../../../http/products/deleteProductRequest';
import { getAllProductsRequest } from '../../../http/products/getAllProductsRequest';
import type { ProductCreateDto, ProductDto } from '../../../types/product';

export interface SeededFilterProducts {
  uniqueToken: string;
  homeKitchenName: string;
  expectedSearchCount: number;
  expectedHomeKitchenCount: number;
}

const buildUniqueToken = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class ProductSeedSession {
  private readonly createdProductIds: number[] = [];

  constructor(
    private readonly request: APIRequestContext,
    private readonly adminJwtToken: string,
  ) {}

  async createProduct(overrides: Partial<ProductCreateDto> = {}): Promise<ProductDto> {
    const response = await createProductRequest(
      this.request,
      this.adminJwtToken,
      generateProduct(overrides),
    );
    expect(response.status()).toBe(201);
    const product = (await response.json()) as ProductDto;
    this.createdProductIds.push(product.id);
    return product;
  }

  async waitForProductsToBeQueryable(productIds: number[]): Promise<void> {
    await expect
      .poll(async () => {
        const response = await getAllProductsRequest(this.request, this.adminJwtToken);
        if (response.status() !== 200) {
          return false;
        }
        const products = (await response.json()) as ProductDto[];
        return productIds.every((id) => products.some((product) => product.id === id));
      })
      .toBe(true);
  }

  async createSearchAndCategoryDataset(): Promise<SeededFilterProducts> {
    const uniqueToken = buildUniqueToken('ui-filter');
    const homeKitchenProduct = await this.createProduct({
      name: `${uniqueToken}-home`,
      category: 'Home & Kitchen',
    });
    await this.createProduct({
      name: `${uniqueToken}-books`,
      category: 'Books',
    });

    return {
      uniqueToken,
      homeKitchenName: homeKitchenProduct.name,
      expectedSearchCount: 2,
      expectedHomeKitchenCount: 1,
    };
  }

  buildProductToken(prefix: string): string {
    return buildUniqueToken(prefix);
  }

  async cleanup(): Promise<void> {
    await Promise.allSettled(
      this.createdProductIds.map((id) => deleteProductRequest(this.request, this.adminJwtToken, id)),
    );
  }
}

export const withProductSeedSession = async <T>(
  request: APIRequestContext,
  adminJwtToken: string,
  run: (session: ProductSeedSession) => Promise<T>,
): Promise<T> => {
  const session = new ProductSeedSession(request, adminJwtToken);
  try {
    return await run(session);
  } finally {
    await session.cleanup();
  }
};
