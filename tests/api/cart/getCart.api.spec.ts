import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import type { CartDto, CartItemDto } from '../../../types/cart';
import { createProduct } from '../../../http/products/createProductRequest';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { getCart, getCartWithoutAuth } from '../../../http/cart/getCartRequest';
import { generateRandomProduct } from '../../../generators/productGenerator';

test.describe('GET /api/cart API tests', () => {
  test('should retrieve cart for authenticated user - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const cartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 2
    };
    await addCartItem(request, clientToken, cartItem);

    // when
    const response = await getCart(request, clientToken);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.username).toBeDefined();
    const item = responseBody.items.find(cartItem => cartItem.productId === createdProduct.id);
    expect(item).toBeTruthy();
    expect(item?.quantity).toBe(cartItem.quantity);
    expect(responseBody.totalItems).toBeGreaterThanOrEqual(cartItem.quantity);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    
    // when
    const response = await getCartWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });
});
