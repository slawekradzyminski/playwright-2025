import type { ProductsClient } from '../httpclients/productsClient';
import type { ProductDto } from '../types/product';

const ACCEPTED_DELETE_STATUSES = new Set([204, 404]);

export class AdminProductCleanup {
  private readonly productIds = new Set<number>();
  private readonly productNames = new Set<string>();

  constructor(
    private readonly productsClient: ProductsClient,
    private readonly adminToken: string
  ) {}

  trackProduct(product: Pick<ProductDto, 'id' | 'name'>): void {
    this.trackProductId(product.id);
    this.trackProductName(product.name);
  }

  trackProductId(productId: number): void {
    this.productIds.add(productId);
  }

  trackProductName(productName: string): void {
    this.productNames.add(productName);
  }

  async cleanup(): Promise<void> {
    const failures: string[] = [];

    for (const productId of this.productIds) {
      await this.deleteProduct(productId, failures);
    }

    await this.deleteProductsByName(failures);

    if (failures.length > 0) {
      throw new Error(`Admin product cleanup failed:\n${failures.join('\n')}`);
    }
  }

  private async deleteProductsByName(failures: string[]): Promise<void> {
    if (this.productNames.size === 0) {
      return;
    }

    const productsResponse = await this.productsClient.getProducts(this.adminToken);

    if (productsResponse.status() !== 200) {
      failures.push(`GET products returned ${productsResponse.status()} while resolving names`);
      return;
    }

    const products = (await productsResponse.json()) as ProductDto[];
    const productsToDelete = products.filter((product) => this.productNames.has(product.name));

    for (const product of productsToDelete) {
      await this.deleteProduct(product.id, failures);
    }
  }

  private async deleteProduct(productId: number, failures: string[]): Promise<void> {
    const deleteResponse = await this.productsClient.deleteProduct(productId, this.adminToken);

    if (!ACCEPTED_DELETE_STATUSES.has(deleteResponse.status())) {
      failures.push(`DELETE product ${productId} returned ${deleteResponse.status()}`);
    }
  }
}
