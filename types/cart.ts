export type CartItemDto = {
  productId: number;
  quantity: number;
};

export type UpdateCartItemDto = {
  quantity: number;
};

export type CartDto = {
  username: string;
  items: CartItemDto[];
  totalPrice: number;
  totalItems: number;
};
