import { test, expect } from '../../../fixtures/apiAuthFixtures';
import { clearCart, clearCartWithoutAuth } from '../../../http/cart/cartCollectionDeleteClient';
import { getCart } from '../../../http/cart/cartCollectionGetClient';
import { addItemToCart } from '../../../http/cart/cartItemsCollectionPostClient';
import { generateProductCreateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from '../products/productTestUtils';
import type { CartDto } from '../../../types/cart';

test.describe('/api/cart DELETE', () => {
  test('should clear cart with client token - 200', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    await clearCart(request, authenticatedClient.token);
    const productPayload = generateProductCreateData();
    const product = await createProductViaApi(request, authenticatedAdmin.token, productPayload);
    await addItemToCart(request, authenticatedClient.token, {
      productId: product.id,
      quantity: 1,
    });

    // when
    const response = await clearCart(request, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const cartResponse = await getCart(request, authenticatedClient.token);
    const cartBody = (await cartResponse.json()) as CartDto;
    expect(cartBody.items.length).toBe(0);
    expect(cartBody.totalItems).toBe(0);
    expect(cartBody.totalPrice).toBeCloseTo(0, 2);

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    // given

    // when
    const response = await clearCartWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});
