import { APIRequestContext, expect } from '@playwright/test';
import { addCartItem } from '../../../http/cartItemsClient';
import { clearCart } from '../../../http/cartClient';
import { createOrder } from '../../../http/ordersClient';
import type { AddressDto, OrderDto } from '../../../types/order';

export const shippingAddress: AddressDto = {
  street: '123 Main',
  city: 'NY',
  state: 'NY',
  zipCode: '10001',
  country: 'USA'
};

export const createPendingOrder = async (
  request: APIRequestContext,
  jwtToken: string
): Promise<OrderDto> => {
  await clearCart(request, jwtToken);
  await addCartItem(request, jwtToken, { productId: 1, quantity: 1 });
  const response = await createOrder(request, jwtToken, shippingAddress);
  expect(response.status()).toBe(201);
  return await response.json();
};
