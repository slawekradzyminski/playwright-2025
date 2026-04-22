import { expect, type Locator, type Page } from '@playwright/test';
import { PRODUCTS_ENDPOINT } from '../../httpclients/productsClient';
import type { ProductCreateDto, ProductUpdateDto } from '../../types/product';
import { BasePage } from '../basePage';

export class AdminProductFormPage extends BasePage {
  static readonly newUrl = '/admin/products/new';
  static readonly editUrlPattern = /\/admin\/products\/edit\/\d+$/;

  private readonly pageContainer: Locator;
  private readonly title: Locator;
  private readonly nameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly priceInput: Locator;
  private readonly stockInput: Locator;
  private readonly categoryInput: Locator;
  private readonly imageInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageContainer = page.getByTestId('admin-product-form-page');
    this.title = page.getByTestId('admin-product-form-title');
    this.nameInput = page.getByTestId('product-name-input');
    this.descriptionInput = page.getByTestId('product-description-input');
    this.priceInput = page.getByTestId('product-price-input');
    this.stockInput = page.getByTestId('product-stock-input');
    this.categoryInput = page.getByTestId('product-category-input');
    this.imageInput = page.getByTestId('product-image-input');
    this.submitButton = page.getByTestId('product-submit-button');
  }

  async openNew(): Promise<void> {
    await this.page.goto(AdminProductFormPage.newUrl);
  }

  async openEdit(productId: number): Promise<void> {
    await this.page.goto(`/admin/products/edit/${productId}`);
  }

  async fillProductForm(product: ProductCreateDto | ProductUpdateDto): Promise<void> {
    if (product.name !== undefined) {
      await this.nameInput.fill(product.name);
    }

    if (product.description !== undefined) {
      await this.descriptionInput.fill(product.description);
    }

    if (product.price !== undefined) {
      await this.priceInput.fill(String(product.price));
    }

    if (product.stockQuantity !== undefined) {
      await this.stockInput.fill(String(product.stockQuantity));
    }

    if (product.category !== undefined) {
      await this.categoryInput.fill(product.category);
    }

    if (product.imageUrl !== undefined) {
      await this.imageInput.fill(product.imageUrl);
    }
  }

  async createProduct(product: ProductCreateDto): Promise<void> {
    await this.fillProductForm(product);

    const responsePromise = this.page.waitForResponse(
      (response) => response.request().method() === 'POST' && response.url().endsWith(PRODUCTS_ENDPOINT)
    );

    await this.submitButton.click();
    await responsePromise;
  }

  async updateProduct(productId: number, product: ProductUpdateDto): Promise<void> {
    await this.fillProductForm(product);

    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' && response.url().endsWith(`${PRODUCTS_ENDPOINT}/${productId}`)
    );

    await this.submitButton.click();
    await responsePromise;
  }

  async assertThatCreateFormIsVisible(): Promise<void> {
    await this.assertThatFormIsVisible('Add New Product', 'Create Product');
  }

  async assertThatEditFormIsVisible(): Promise<void> {
    await this.assertThatFormIsVisible('Edit Product', 'Update Product');
  }

  async assertThatProductValuesAreFilled(product: ProductCreateDto): Promise<void> {
    await expect(this.nameInput).toHaveValue(product.name);
    await expect(this.descriptionInput).toHaveValue(product.description);
    await expect(this.priceInput).toHaveValue(String(product.price));
    await expect(this.stockInput).toHaveValue(String(product.stockQuantity));
    await expect(this.categoryInput).toHaveValue(product.category);
    await expect(this.imageInput).toHaveValue(product.imageUrl ?? '');
  }

  private async assertThatFormIsVisible(title: string, submitText: string): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText(title);
    await expect(this.nameInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.priceInput).toBeVisible();
    await expect(this.stockInput).toBeVisible();
    await expect(this.categoryInput).toBeVisible();
    await expect(this.imageInput).toBeVisible();
    await expect(this.submitButton).toHaveText(submitText);
  }
}
