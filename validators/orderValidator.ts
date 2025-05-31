import { expect } from '@playwright/test';
import type { OrderDto, OrderItemDto, AddressDto, PageDtoOrderDto } from '../types/order';

export function validateAddressDto(address: any): asserts address is AddressDto {
  expect(typeof address.street).toBe('string');
  expect(typeof address.city).toBe('string');
  expect(typeof address.state).toBe('string');
  expect(typeof address.zipCode).toBe('string');
  expect(typeof address.country).toBe('string');
}

export function validateOrderItemDto(item: any): asserts item is OrderItemDto {
  expect(typeof item.id).toBe('number');
  expect(typeof item.productId).toBe('number');
  expect(typeof item.quantity).toBe('number');
  expect(typeof item.productName).toBe('string');
  expect(typeof item.unitPrice).toBe('number');
  expect(typeof item.totalPrice).toBe('number');
}

export function validateOrderDto(order: any): asserts order is OrderDto {
  expect(typeof order.id).toBe('number');
  expect(typeof order.username).toBe('string');
  expect(Array.isArray(order.items)).toBe(true);
  expect(typeof order.totalAmount).toBe('number');
  expect(typeof order.status).toBe('string');
  expect(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).toContain(order.status);
  expect(typeof order.createdAt).toBe('string');
  expect(typeof order.updatedAt).toBe('string');
  
  validateAddressDto(order.shippingAddress);
  order.items.forEach((item: any) => {
    validateOrderItemDto(item);
  });
}

export function validatePageDtoOrderDto(page: any): asserts page is PageDtoOrderDto {
  expect(Array.isArray(page.content)).toBe(true);
  expect(typeof page.pageNumber).toBe('number');
  expect(typeof page.pageSize).toBe('number');
  expect(typeof page.totalElements).toBe('number');
  expect(typeof page.totalPages).toBe('number');
  
  page.content.forEach((order: any) => {
    validateOrderDto(order);
  });
} 