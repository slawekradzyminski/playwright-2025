export const PRODUCTS_UI_TEXT = {
  pageTitle: 'Products',
  categoriesTitle: 'Categories',
  homeKitchenProductsTitle: 'Home & Kitchen Products',
  addedToCartTitle: 'Added to cart',
  cartUpdatedTitle: 'Cart updated',
  updateCartButtonLabel: 'Update Cart',
} as const;

export const buildAddedToCartMessage = (quantity: number, productName: string): string =>
  `${quantity} × ${productName} added to your cart`;

export const buildCartUpdatedMessage = (productName: string, quantity: number): string =>
  `${productName} quantity set to ${quantity}`;

export const buildInCartText = (quantity: number): string => `${quantity} in cart`;
