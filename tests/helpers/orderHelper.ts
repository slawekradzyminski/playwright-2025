import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { createOrder } from '../../http/orders/createOrderRequest';
import { generateAddress } from '../../generators/addressGenerator';
import { createTestProduct, type TestProduct } from './productHelper';
import { addToCart, resetCart } from './cartHelper';
import type { AddressDto, OrderDto } from '../../types/orders';
import type { ProductDto } from '../../types/products';

export interface PlacedOrder {
  order: OrderDto;
  address: AddressDto;
  product: ProductDto;
}

export interface CreateOrderOptions {
  quantity?: number;
  addressOverrides?: Partial<AddressDto>;
}

export const seedCartWithProduct = async (
  request: APIRequestContext,
  adminToken: string,
  clientToken: string,
  quantity = 1
): Promise<TestProduct> => {
  const product = await createTestProduct(request, adminToken);
  await addToCart(request, product.created.id, clientToken, quantity);
  return product;
};

export const placeOrderForClient = async (
  request: APIRequestContext,
  adminToken: string,
  clientToken: string,
  options?: CreateOrderOptions
): Promise<PlacedOrder> => {
  await resetCart(request, clientToken);

  const testProduct = await seedCartWithProduct(
    request,
    adminToken,
    clientToken,
    options?.quantity ?? 1
  );

  const address = generateAddress(options?.addressOverrides);
  const response = await createOrder(request, address, clientToken);
  expect(response.status()).toBe(201);
  const order: OrderDto = await response.json();

  return { order, address, product: testProduct.created };
};
