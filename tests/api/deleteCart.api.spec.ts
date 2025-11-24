import { test, expect } from '../../fixtures/apiAuthFixture';
import { createProduct } from '../../http/createProductRequest';
import { addCartItem } from '../../http/addCartItemRequest';
import { clearCart } from '../../http/clearCartRequest';
import { getCart } from '../../http/getCartRequest';
import { generateProduct } from '../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../types/products';
import { INVALID_TOKEN } from '../../config/constants';
import type { CartDto } from '../../types/cart';

test.describe('DELETE /api/cart API tests', () => {
  test('client should clear cart - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();
    const addResponse = await addCartItem(request, { productId: createdProduct.id, quantity: 2 }, clientAuth.token);
    expect(addResponse.status()).toBe(200);

    // when
    const response = await clearCart(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const getResponse = await getCart(request, clientAuth.token);
    const cart: CartDto = await getResponse.json();
    expect(cart.items.length).toBe(0);
    expect(cart.totalItems).toBe(0);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await clearCart(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await clearCart(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});
