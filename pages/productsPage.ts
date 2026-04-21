import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

export interface ExpectedProductCard {
  name: string;
  price: string;
  category: string;
  description: string;
}

export class ProductsPage extends BasePage {
  static readonly url = '/products';

  readonly header: LoggedInHeaderComponent;

  private readonly pageContainer: Locator;
  private readonly title: Locator;
  private readonly heroSummary: Locator;
  private readonly categoriesTitle: Locator;
  private readonly listTitle: Locator;
  private readonly searchInput: Locator;
  private readonly sortSelect: Locator;
  private readonly productCards: Locator;
  private readonly emptyProductsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('products-page');
    this.title = page.getByTestId('products-title');
    this.heroSummary = page.getByText('8 products across 7 categories');
    this.categoriesTitle = page.getByTestId('products-categories-title');
    this.listTitle = page.getByTestId('product-list-title');
    this.searchInput = page.getByTestId('product-search');
    this.sortSelect = page.getByTestId('product-sort');
    this.productCards = page.getByTestId('product-item');
    this.emptyProductsMessage = page.getByText(/No products/i);
  }

  async open(): Promise<void> {
    await this.page.goto(ProductsPage.url);
  }

  async selectCategory(category: string): Promise<void> {
    await this.page.getByTestId(`products-category-${this.categoryTestIdSuffix(category)}`).click();
  }

  async searchFor(searchPhrase: string): Promise<void> {
    await this.searchInput.fill(searchPhrase);
  }

  async sortBy(label: string): Promise<void> {
    await this.sortSelect.selectOption({ label });
  }

  async increaseProductQuantity(productName: string, times = 1): Promise<void> {
    const button = this.productCardByName(productName).getByTestId('product-increase-quantity');

    for (let click = 0; click < times; click++) {
      await button.click();
    }
  }

  async decreaseProductQuantity(productName: string, times = 1): Promise<void> {
    const button = this.productCardByName(productName).getByTestId('product-decrease-quantity');

    for (let click = 0; click < times; click++) {
      await button.click();
    }
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.productCardByName(productName).getByTestId('product-add-button').click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.productCardByName(productName).getByTestId('product-remove-button').click();
  }

  async openProductDetails(productName: string): Promise<void> {
    await this.productCardByName(productName).click();
  }

  async assertThatCatalogIsVisible(expectedProducts: ExpectedProductCard[]): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText('Products');
    await expect(this.heroSummary).toBeVisible();
    await expect(this.categoriesTitle).toHaveText('Categories');
    await expect(this.listTitle).toHaveText('All Products');
    await expect(this.searchInput).toBeVisible();
    await expect(this.sortSelect).toBeVisible();
    await expect(this.productCards).toHaveCount(expectedProducts.length);

    for (const product of expectedProducts) {
      await this.assertThatProductCardIsVisible(product);
    }
  }

  async assertThatProductCardIsVisible(expectedProduct: ExpectedProductCard): Promise<void> {
    const productCard = this.productCardByName(expectedProduct.name);

    await expect(productCard).toBeVisible();
    await expect(productCard.getByTestId('product-image')).toHaveAttribute('alt', expectedProduct.name);
    await expect(productCard.getByTestId('product-name')).toHaveText(expectedProduct.name);
    await expect(productCard.getByTestId('product-price')).toHaveText(expectedProduct.price);
    await expect(productCard.getByTestId('product-category')).toHaveText(expectedProduct.category);
    await expect(productCard.getByTestId('product-description')).toHaveText(expectedProduct.description);
    await expect(productCard.getByTestId('product-quantity-value')).toHaveText('1');
    await expect(productCard.getByTestId('product-decrease-quantity')).toBeVisible();
    await expect(productCard.getByTestId('product-increase-quantity')).toBeVisible();
    await expect(productCard.getByTestId('product-add-button')).toHaveText('Add to Cart');
  }

  async assertThatListTitleIs(title: string): Promise<void> {
    await expect(this.listTitle).toHaveText(title);
  }

  async assertThatProductNamesAreVisible(productNames: string[]): Promise<void> {
    await expect(this.productCards).toHaveCount(productNames.length);

    for (const productName of productNames) {
      await expect(this.productCardByName(productName)).toBeVisible();
    }
  }

  async assertThatOnlyCategoryIsVisible(category: string): Promise<void> {
    const categories = await this.productCards.getByTestId('product-category').allTextContents();

    expect(categories).not.toHaveLength(0);
    expect(categories.every((visibleCategory) => visibleCategory === category)).toBe(true);
  }

  async assertThatProductNamesAreInOrder(productNames: string[]): Promise<void> {
    await expect(this.productCards.getByTestId('product-name')).toHaveText(productNames);
  }

  async assertThatProductPricesAreSortedDescending(): Promise<void> {
    const prices = await this.productCards.getByTestId('product-price').allTextContents();
    const numericPrices = prices.map((price) => Number(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((first, second) => second - first);

    expect(numericPrices).toEqual(sortedPrices);
  }

  async assertThatNoProductsAreVisible(): Promise<void> {
    await expect(this.productCards).toHaveCount(0);
    await expect(this.emptyProductsMessage).toBeVisible();
  }

  async assertThatSearchPhraseIs(searchPhrase: string): Promise<void> {
    await expect(this.searchInput).toHaveValue(searchPhrase);
  }

  async assertThatProductQuantityIs(productName: string, quantity: number): Promise<void> {
    await expect(this.productCardByName(productName).getByTestId('product-quantity-value')).toHaveText(
      String(quantity)
    );
  }

  async assertThatProductAddButtonIsDisabled(productName: string): Promise<void> {
    await expect(this.productCardByName(productName).getByTestId('product-add-button')).toBeDisabled();
  }

  async assertThatProductIsInCart(productName: string, quantity: number): Promise<void> {
    const productCard = this.productCardByName(productName);

    await expect(productCard.getByTestId('product-card-cart-quantity')).toHaveText(`${quantity} in cart`);
    await expect(productCard.getByTestId('product-remove-button')).toHaveText('Remove');
    await expect(productCard.getByTestId('product-add-button')).toHaveText('Update Cart');
  }

  async assertThatProductIsNotInCart(productName: string): Promise<void> {
    const productCard = this.productCardByName(productName);

    await expect(productCard.getByTestId('product-card-cart-quantity')).toBeHidden();
    await expect(productCard.getByTestId('product-remove-button')).toBeHidden();
    await expect(productCard.getByTestId('product-add-button')).toHaveText('Add to Cart');
    await expect(productCard.getByTestId('product-quantity-value')).toHaveText('1');
  }

  private productCardByName(productName: string): Locator {
    return this.productCards.filter({
      has: this.page.getByTestId('product-name').filter({ hasText: productName })
    });
  }

  private categoryTestIdSuffix(category: string): string {
    if (category === 'All Products') {
      return 'all';
    }

    return category.toLowerCase().replaceAll(' ', '-');
  }
}
