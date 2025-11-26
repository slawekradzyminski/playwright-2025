import type { APIRequestContext } from '@playwright/test';
import type { ProductCreateDto } from '../../../../types/products';
import type { AddressDto } from '../../../../types/orders';
import { placeOrder, type TestOrder, type CreateOrderOptions } from '../../../helpers';

export type { TestOrder, CreateOrderOptions };

export interface PlaceOrderOptions extends CreateOrderOptions {
  productOverrides?: Partial<ProductCreateDto>;
}

export const placeOrderForClient = async (
  request: APIRequestContext,
  adminToken: string,
  clientToken: string,
  options?: PlaceOrderOptions
): Promise<{ order: TestOrder['order']; address: AddressDto; product: TestOrder['product']['created'] }> => {
  const result = await placeOrder(request, adminToken, clientToken, options);
  return {
    order: result.order,
    address: result.address,
    product: result.product.created
  };
};
