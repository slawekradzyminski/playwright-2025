import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

export interface ExpectedProductDetails {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: string;
  imageVisible?: boolean;
  cartControlsVisible?: boolean;
}

export class ProductDetailsPage extends BasePage {
  static readonly urlPattern = /\/products\/\d+$/;

  readonly header: LoggedInHeaderComponent;

  private readonly pageContainer: Locator;
  private readonly backLink: Locator;
  private readonly image: Locator;
  private readonly title: Locator;
  private readonly price: Locator;
  private readonly descriptionTitle: Locator;
  private readonly description: Locator;
  private readonly categoryTitle: Locator;
  private readonly category: Locator;
  private readonly availabilityTitle: Locator;
  private readonly stock: Locator;
  private readonly quantityTitle: Locator;
  private readonly quantityValue: Locator;
  private readonly decreaseQuantityButton: Locator;
  private readonly increaseQuantityButton: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeFromCartButton: Locator;
  private readonly cartQuantity: Locator;
  private readonly noImageMessage: Locator;
  private readonly notFoundMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('product-details-page');
    this.backLink = page.getByTestId('product-back-link');
    this.image = page.getByTestId('product-image');
    this.title = page.getByTestId('product-title');
    this.price = page.getByTestId('product-price');
    this.descriptionTitle = page.getByTestId('product-description-title');
    this.description = page.getByTestId('product-description');
    this.categoryTitle = page.getByTestId('product-category-title');
    this.category = page.getByTestId('product-category');
    this.availabilityTitle = page.getByTestId('product-availability-title');
    this.stock = page.getByTestId('product-stock');
    this.quantityTitle = page.getByTestId('product-quantity-title');
    this.quantityValue = page.getByTestId('quantity-value');
    this.decreaseQuantityButton = page.getByTestId('decrease-quantity');
    this.increaseQuantityButton = page.getByTestId('increase-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeFromCartButton = page.getByTestId('remove-from-cart');
    this.cartQuantity = page.getByTestId('product-cart-quantity');
    this.noImageMessage = page.getByTestId('product-no-image');
    this.notFoundMessage = page.getByTestId('product-not-found');
  }

  async open(productId: number): Promise<void> {
    await this.page.goto(`/products/${productId}`);
  }

  async increaseQuantity(times = 1): Promise<void> {
    for (let click = 0; click < times; click++) {
      await this.increaseQuantityButton.click();
    }
  }

  async decreaseQuantity(times = 1): Promise<void> {
    for (let click = 0; click < times; click++) {
      await this.decreaseQuantityButton.click();
    }
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeFromCartButton.click();
  }

  async assertThatProductDetailsAreVisible(expectedProduct: ExpectedProductDetails): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.backLink).toContainText('Back to Products');
    if (expectedProduct.imageVisible === false) {
      await expect(this.noImageMessage).toHaveText('No image available');
    } else {
      await expect(this.image).toBeVisible();
      await expect(this.image).toHaveAttribute('alt', expectedProduct.name);
    }
    await expect(this.title).toHaveText(expectedProduct.name);
    await expect(this.price).toHaveText(expectedProduct.price);
    await expect(this.descriptionTitle).toHaveText('Description');
    await expect(this.description).toHaveText(expectedProduct.description);
    await expect(this.categoryTitle).toHaveText('Category');
    await expect(this.category).toHaveText(expectedProduct.category);
    await expect(this.availabilityTitle).toHaveText('Availability');
    await expect(this.stock).toHaveText(expectedProduct.stock);

    if (expectedProduct.cartControlsVisible === false) {
      await expect(this.quantityTitle).toBeHidden();
      await expect(this.addToCartButton).toBeDisabled();
      return;
    }

    await expect(this.quantityTitle).toHaveText('Quantity');
    await expect(this.decreaseQuantityButton).toBeVisible();
    await expect(this.quantityValue).toHaveText('1');
    await expect(this.increaseQuantityButton).toBeVisible();
    await expect(this.addToCartButton).toHaveText('Add to Cart');
  }

  async assertThatNoImageIsVisible(): Promise<void> {
    await expect(this.noImageMessage).toHaveText('No image available');
    await expect(this.image).toBeHidden();
  }

  async assertThatOutOfStockStateIsVisible(): Promise<void> {
    await expect(this.stock).toHaveText('Out of stock');
    await expect(this.quantityTitle).toBeHidden();
    await expect(this.addToCartButton).toBeDisabled();
  }

  async assertThatNotFoundIsVisible(): Promise<void> {
    await expect(this.notFoundMessage).toContainText('Error loading product details');
  }

  async assertThatQuantityIs(quantity: number): Promise<void> {
    await expect(this.quantityValue).toHaveText(String(quantity));
  }

  async assertThatProductIsInCart(quantity: number): Promise<void> {
    await expect(this.cartQuantity).toHaveText(`${quantity} in cart`);
    await expect(this.removeFromCartButton).toHaveText('Remove from Cart');
    await expect(this.addToCartButton).toHaveText('Update Cart');
    await this.header.assertThatCartCountIs(quantity);
  }

  async assertThatProductIsNotInCart(): Promise<void> {
    await expect(this.cartQuantity).toBeHidden();
    await expect(this.removeFromCartButton).toBeHidden();
    await expect(this.addToCartButton).toHaveText('Add to Cart');
    await expect(this.quantityValue).toHaveText('1');
    await this.header.assertThatCartIsEmpty();
  }
}
