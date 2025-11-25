import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { createProduct } from '../../../http/createProductRequest';
import { addCartItem } from '../../../http/addCartItemRequest';
import { createOrder } from '../../../http/createOrderRequest';
import { clearCart } from '../../../http/clearCartRequest';
import { generateProduct } from '../../../generators/productGenerator';
import { generateAddress } from '../../../generators/addressGenerator';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import type { AddressDto, OrderDto } from '../../../types/orders';
import type { CartItemDto } from '../../../types/cart';

const buildCartItem = (productId: number, quantity: number): CartItemDto => ({
  productId,
  quantity
});

export interface CreateOrderOptions {
  quantity?: number;
  addressOverrides?: Partial<AddressDto>;
  productOverrides?: Partial<ProductCreateDto>;
}

export const placeOrderForClient = async (
  request: APIRequestContext,
  adminToken: string,
  clientToken: string,
  options?: CreateOrderOptions
): Promise<{ order: OrderDto; address: AddressDto; product: ProductDto }> => {
  await clearCart(request, clientToken);

  const productData: ProductCreateDto = generateProduct(options?.productOverrides);
  const createProductResponse = await createProduct(request, productData, adminToken);
  expect(createProductResponse.status()).toBe(201);
  const product: ProductDto = await createProductResponse.json();

  const addResponse = await addCartItem(request, buildCartItem(product.id, options?.quantity ?? 1), clientToken);
  expect(addResponse.status()).toBe(200);

  const address: AddressDto = generateAddress(options?.addressOverrides);
  const createOrderResponse = await createOrder(request, address, clientToken);
  expect(createOrderResponse.status()).toBe(201);
  const order: OrderDto = await createOrderResponse.json();

  return { order, address, product };
};
