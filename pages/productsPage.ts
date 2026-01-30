import { expect, type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly searchInput: Locator;
  readonly categoriesHeading: Locator;
  readonly categoriesList: Locator;
  readonly categoryButtons: Locator;
  readonly productListHeading: Locator;
  readonly sortSelect: Locator;
  readonly sortOptions: Locator;
  readonly productItems: Locator;
  readonly productTitles: Locator;
  readonly addToCartButtons: Locator;
  readonly quantityControls: Locator;
  readonly productsUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.productsUrl = `${process.env.FRONTEND_URL}/products`;
    this.pageHeading = page.getByRole('heading', { name: 'Products', level: 1 });
    this.categoriesHeading = page.getByRole('heading', { name: 'Categories', level: 2 });
    this.categoriesList = page.getByRole('list').filter({ hasText: 'All Products' });
    this.categoryButtons = this.categoriesList.getByRole('button');
    this.productListHeading = page.getByTestId('product-list-title');
    this.searchInput = page.getByPlaceholder('Search products...');
    this.sortSelect = page.getByRole('combobox', { name: 'Sort by:' });
    this.sortOptions = this.sortSelect.locator('option');
    this.productItems = page.getByTestId('product-item');
    this.productTitles = page.getByRole('heading', { level: 3 });
    this.addToCartButtons = page.getByRole('button', { name: 'Add to Cart' });
    this.quantityControls = page.getByRole('button', { name: '-' }).locator('..');
  }

  async goto() {
    await this.page.goto(this.productsUrl);
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(this.productsUrl);
  }

  async expectFiltersVisible() {
    await expect(this.searchInput).toBeVisible();
    await expect(this.categoriesHeading).toBeVisible();
    await expect(this.categoryButtons.first()).toBeVisible();
    await expect(this.sortSelect).toBeVisible();
  }

  async expectPageHeadingVisible() {
    await expect(this.pageHeading).toBeVisible();
  }

  async expectProductListVisible() {
    await expect(this.productTitles.first()).toBeVisible();
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
  }

  async expectSearchValue(term: string) {
    await expect(this.searchInput).toHaveValue(term);
  }

  async selectCategory(name: string) {
    await this.categoriesList.getByRole('button', { name }).click();
  }

  async selectSortOption(label = 'Price (High to Low)') {
    const currentValue = await this.sortSelect.inputValue();
    await this.sortSelect.selectOption({ label });
    const nextValue = await this.sortSelect.inputValue();
    expect(nextValue).not.toBe(currentValue);
  }

  async incrementQuantityForFirstProduct() {
    await this.firstProductQuantityIncreaseButton().click();
  }

  async decrementQuantityForFirstProduct() {
    await this.firstProductQuantityDecreaseButton().click();
  }

  async addFirstProductToCart() {
    await this.firstProductAddToCartButton().click();
  }

  async openFirstProductDetails() {
    const firstItem = this.productItems.first();
    const itemTitle = firstItem.getByRole('heading', { level: 3 });
    await itemTitle.click();
  }

  async expectFirstProductQuantityValue(value: string) {
    await expect(this.firstProductQuantityDisplay()).toHaveText(value);
  }

  async expectProductListHeading(text: string | RegExp) {
    await expect(this.productListHeading).toHaveText(text);
  }

  private firstProductActions() {
    return this.addToCartButtons.first().locator('..');
  }

  private firstProductQuantityDisplay() {
    return this.quantityControls.first().getByText(/^\d+$/);
  }

  private firstProductQuantityIncreaseButton() {
    return this.quantityControls.first().getByRole('button', { name: '+' });
  }

  private firstProductQuantityDecreaseButton() {
    return this.quantityControls.first().getByRole('button', { name: '-' });
  }

  private firstProductAddToCartButton() {
    return this.addToCartButtons.first();
  }
}
