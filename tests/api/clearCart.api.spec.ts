import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import type { CartItemDto, CartDto } from '../../types/cart';
import { createProduct } from '../../http/createProductRequest';
import { addCartItem } from '../../http/addCartItemRequest';
import { getCart } from '../../http/getCartRequest';
import { clearCart, clearCartWithoutAuth } from '../../http/clearCartRequest';
import { generateRandomProduct } from '../../generators/productGenerator';

test.describe('DELETE /api/cart API tests', () => {
  test('should clear cart for authenticated user - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
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
    const response = await clearCart(request, clientToken);
    
    // then
    expect(response.status()).toBe(200);
    const cartResponse = await getCart(request, clientToken);
    const cartBody: CartDto = await cartResponse.json();
    expect(cartBody.items.length).toBe(0);
    expect(cartBody.totalItems).toBe(0);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given

    // when
    const response = await clearCartWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });
});
