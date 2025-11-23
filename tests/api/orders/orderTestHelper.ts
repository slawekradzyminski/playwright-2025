import { APIRequestContext } from '@playwright/test';
import type { CartItemDto } from '../../../types/cart';
import type { AddressDto, OrderDto } from '../../../types/order';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { generateRandomProduct } from '../../../generators/productGenerator';
import { generateRandomAddress } from '../../../generators/addressGenerator';
import { createProduct } from '../../../http/products/createProductRequest';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { createOrder } from '../../../http/orders/createOrderRequest';

interface CartSetupResult {
  product: ProductDto;
  cartItem: CartItemDto;
  shippingAddress: AddressDto;
}

export interface OrderSetupResult {
  product: ProductDto;
  order: OrderDto;
  shippingAddress: AddressDto;
}

export const prepareCartWithProduct = async (
  request: APIRequestContext,
  adminToken: string,
  clientToken: string,
  quantity: number = 1
): Promise<CartSetupResult> => {
  const productPayload: ProductCreateDto = generateRandomProduct();
  const productResponse = await createProduct(request, adminToken, productPayload);

  if (productResponse.status() !== 201) {
    throw new Error(`Failed to create product. Status: ${productResponse.status()}`);
  }

  const product: ProductDto = await productResponse.json();

  const cartItem: CartItemDto = {
    productId: product.id,
    quantity,
  };

  const cartResponse = await addCartItem(request, clientToken, cartItem);

  if (cartResponse.status() !== 200) {
    throw new Error(`Failed to add product to cart. Status: ${cartResponse.status()}`);
  }

  const shippingAddress = generateRandomAddress();

  return {
    product,
    cartItem,
    shippingAddress,
  };
};

export const createOrderForClient = async (
  request: APIRequestContext,
  adminToken: string,
  clientToken: string,
  quantity: number = 1
): Promise<OrderSetupResult> => {
  const { product, shippingAddress } = await prepareCartWithProduct(request, adminToken, clientToken, quantity);
  const orderResponse = await createOrder(request, clientToken, shippingAddress);

  if (orderResponse.status() !== 201) {
    throw new Error(`Failed to create order. Status: ${orderResponse.status()}`);
  }

  const order: OrderDto = await orderResponse.json();

  return {
    product,
    order,
    shippingAddress,
  };
};
