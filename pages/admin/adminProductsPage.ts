import { expect, type Locator, type Page } from '@playwright/test';
import { PRODUCTS_ENDPOINT } from '../../httpclients/productsClient';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import { BasePage } from '../basePage';
import { LoggedInHeaderComponent } from '../components/loggedInHeaderComponent';

export class AdminProductsPage extends BasePage {
  static readonly url = '/admin/products';

  readonly header: LoggedInHeaderComponent;

  private readonly pageContainer: Locator;
  private readonly title: Locator;
  private readonly addNewProductLink: Locator;
  private readonly productRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('admin-products-page');
    this.title = page.getByTestId('admin-product-list-title');
    this.addNewProductLink = page.getByTestId('admin-product-list-add-new');
    this.productRows = page.getByTestId(/^admin-product-row-/);
  }

  async open(): Promise<void> {
    await this.page.goto(AdminProductsPage.url);
  }

  async clickAddNewProduct(): Promise<void> {
    await this.addNewProductLink.click();
  }

  async clickEditProduct(productId: number): Promise<void> {
    await this.page.getByTestId(`admin-product-edit-${productId}`).click();
  }

  async deleteProduct(productId: number): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());

    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' && response.url().endsWith(`${PRODUCTS_ENDPOINT}/${productId}`)
    );

    await this.page.getByTestId(`admin-product-delete-${productId}`).click();
    await responsePromise;
  }

  async assertThatProductListIsVisible(): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText('Manage Products');
    await expect(this.addNewProductLink).toBeVisible();
    await expect(this.productRows.first()).toBeVisible();
  }

  async assertThatProductIsVisible(product: ProductDto | ProductCreateDto): Promise<void> {
    const productRow = this.productRowByName(product.name);

    await expect(productRow).toBeVisible();
    await expect(productRow).toContainText(product.name);
    await expect(productRow).toContainText(`$${product.price.toFixed(2)}`);
    await expect(productRow).toContainText(String(product.stockQuantity));
    await expect(productRow).toContainText(product.category);
  }

  async assertThatProductIsNotVisible(productName: string): Promise<void> {
    await expect(this.productRowByName(productName)).toBeHidden();
  }

  private productRowByName(productName: string): Locator {
    return this.productRows.filter({
      has: this.page.getByText(productName, { exact: true })
    });
  }
}
