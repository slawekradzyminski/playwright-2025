import { expect } from '@playwright/test';
import type { CartClient } from '../httpclients/cartClient';
import type { OrdersClient } from '../httpclients/ordersClient';
import type { AddressDto, OrderDto } from '../types/order';
import { expectJsonResponse } from './apiAssertions';

export const testShippingAddress: AddressDto = {
  street: 'Main Street 1',
  city: 'Warsaw',
  state: 'Mazowieckie',
  zipCode: '00-001',
  country: 'Poland'
};

export const createOrderFromCart = async (
  ordersClient: OrdersClient,
  token: string,
  shippingAddress: AddressDto = testShippingAddress
): Promise<OrderDto> => {
  const createOrderResponse = await ordersClient.createOrder(shippingAddress, token);

  return expectJsonResponse<OrderDto>(createOrderResponse, 201);
};

export const givenPendingOrderWithProduct = async (
  cartClient: CartClient,
  ordersClient: OrdersClient,
  token: string,
  productId: number,
  quantity: number
): Promise<OrderDto> => {
  const clearResponse = await cartClient.clearCart(token);
  expect(clearResponse.status()).toBe(204);

  const addResponse = await cartClient.addItem({ productId, quantity }, token);
  expect(addResponse.status()).toBe(200);

  return createOrderFromCart(ordersClient, token);
};
