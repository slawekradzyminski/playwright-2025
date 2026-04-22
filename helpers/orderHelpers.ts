import { expect } from '@playwright/test';
import type { CartClient } from '../httpclients/cartClient';
import type { OrdersClient } from '../httpclients/ordersClient';
import type { AddressDto, OrderDto, OrderStatus, OrdersPageDto } from '../types/order';
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

interface ExpectedOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ExpectedOrder {
  username: string;
  shippingAddress: AddressDto;
  status?: OrderStatus;
  item?: ExpectedOrderItem;
}

export const expectOrderShape = (order: OrderDto, expected: ExpectedOrder): void => {
  expect(order.id).toEqual(expect.any(Number));
  expect(order.username).toBe(expected.username);
  expect(order.totalAmount).toEqual(expect.any(Number));
  expect(order.status).toBe(expected.status ?? 'PENDING');
  expect(order.shippingAddress).toEqual(expected.shippingAddress);
  expect(order.createdAt).toEqual(expect.any(String));
  expect(Number.isNaN(Date.parse(order.createdAt))).toBe(false);
  expect(order.updatedAt).toEqual(expect.any(String));
  expect(Number.isNaN(Date.parse(order.updatedAt))).toBe(false);
  expect(Array.isArray(order.items)).toBe(true);
  expect(order.items.length).toBeGreaterThan(0);

  if (!expected.item) {
    return;
  }

  const orderItem = order.items.find((item) => item.productId === expected.item?.productId);
  expect(orderItem).toBeDefined();
  expect(orderItem?.id).toEqual(expect.any(Number));
  expect(orderItem?.productId).toBe(expected.item.productId);
  expect(orderItem?.productName).toBe(expected.item.productName);
  expect(orderItem?.quantity).toBe(expected.item.quantity);
  expect(orderItem?.unitPrice).toBeCloseTo(expected.item.unitPrice, 2);
  expect(orderItem?.totalPrice).toBeCloseTo(expected.item.unitPrice * expected.item.quantity, 2);
  expect(order.totalAmount).toBeCloseTo(expected.item.unitPrice * expected.item.quantity, 2);
};

export const expectOrdersPageShape = (page: OrdersPageDto): void => {
  expect(Array.isArray(page.content)).toBe(true);
  expect(page.pageNumber).toEqual(expect.any(Number));
  expect(page.pageSize).toEqual(expect.any(Number));
  expect(page.totalElements).toEqual(expect.any(Number));
  expect(page.totalPages).toEqual(expect.any(Number));
};
