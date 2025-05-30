export interface AddressDto {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItemDto {
  id: number;
  productId: number;
  quantity: number;
  productName: string;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  id: number;
  username: string;
  items: OrderItemDto[];
  totalAmount: number;
  status: string;
  shippingAddress: AddressDto;
  createdAt: string;
  updatedAt: string;
}

export interface PageDtoOrderDto {
  content: OrderDto[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
} 