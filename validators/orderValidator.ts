import { expect } from '@playwright/test';
import type { PageDtoOrderDto, OrderDto, OrderItemDto, AddressDto } from '../types/orders';

export const validateOrdersPage = (ordersPage: PageDtoOrderDto) => {
  expect(ordersPage).toMatchObject({
    content: expect.any(Array),
    pageNumber: expect.any(Number),
    pageSize: expect.any(Number),
    totalElements: expect.any(Number),
    totalPages: expect.any(Number),
  });
  
  expect(ordersPage.pageNumber).toBeGreaterThanOrEqual(0);
  expect(ordersPage.pageSize).toBeGreaterThan(0);
  expect(ordersPage.totalElements).toBeGreaterThanOrEqual(0);
  expect(ordersPage.totalPages).toBeGreaterThanOrEqual(0);
  
  ordersPage.content.forEach((order: OrderDto, index) => {
    validateSingleOrder(order, index);
  });
};

export const validateSingleOrder = (order: OrderDto, index?: number) => {
  const orderLabel = index !== undefined ? `Order at index ${index}` : 'Order';
  
  expect(order, orderLabel).toMatchObject({
    id: expect.any(Number),
    username: expect.any(String),
    items: expect.any(Array),
    totalAmount: expect.any(Number),
    status: expect.any(String),
    shippingAddress: expect.any(Object),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
  
  expect(order.id).toBeGreaterThan(0);
  expect(order.username.length).toBeGreaterThan(0);
  expect(order.totalAmount).toBeGreaterThan(0);
  expect(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).toContain(order.status);
  
  validateAddress(order.shippingAddress);
  
  order.items.forEach((item: OrderItemDto, itemIndex) => {
    validateOrderItem(item, itemIndex);
  });
};

const validateAddress = (address: AddressDto) => {
  expect(address).toMatchObject({
    street: expect.any(String),
    city: expect.any(String),
    state: expect.any(String),
    zipCode: expect.any(String),
    country: expect.any(String),
  });
  
  expect(address.street.length).toBeGreaterThan(0);
  expect(address.city.length).toBeGreaterThan(0);
  expect(address.state.length).toBeGreaterThan(0);
  expect(address.zipCode.length).toBeGreaterThan(0);
  expect(address.country.length).toBeGreaterThan(0);
};

const validateOrderItem = (item: OrderItemDto, index: number) => {
  expect(item, `Order item at index ${index}`).toMatchObject({
    id: expect.any(Number),
    productId: expect.any(Number),
    quantity: expect.any(Number),
    productName: expect.any(String),
    unitPrice: expect.any(Number),
    totalPrice: expect.any(Number),
  });
  
  expect(item.id).toBeGreaterThan(0);
  expect(item.productId).toBeGreaterThan(0);
  expect(item.quantity).toBeGreaterThan(0);
  expect(item.productName.length).toBeGreaterThan(0);
  expect(item.unitPrice).toBeGreaterThan(0);
  expect(item.totalPrice).toBeGreaterThan(0);
}; 