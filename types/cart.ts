export interface CartItemDto {
  productId: number;
  quantity: number;
}

export interface CartDto {
  username: string;
  items: CartItemDto[];
  totalPrice: number;
  totalItems: number;
} 