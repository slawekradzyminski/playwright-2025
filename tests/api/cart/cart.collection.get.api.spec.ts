import { test, expect } from '../../../fixtures/apiAuthFixtures';
import { getCart, getCartWithoutAuth } from '../../../http/cart/cartCollectionGetClient';
import { clearCart } from '../../../http/cart/cartCollectionDeleteClient';
import { addItemToCart } from '../../../http/cart/cartItemsCollectionPostClient';
import { generateProductCreateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from '../products/productTestUtils';
import type { CartDto } from '../../../types/cart';

test.describe('/api/cart GET', () => {
  test('should retrieve current cart with client token - 200', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    await clearCart(request, authenticatedClient.token);
    const productPayload = generateProductCreateData();
    const product = await createProductViaApi(request, authenticatedAdmin.token, productPayload);
    await addItemToCart(request, authenticatedClient.token, {
      productId: product.id,
      quantity: 2,
    });

    // when
    const response = await getCart(request, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as CartDto;
    expect(responseBody.username).toBe(authenticatedClient.user.username);
    expect(responseBody.items.length).toBe(1);
    expect(responseBody.items[0].productId).toBe(product.id);
    expect(responseBody.items[0].quantity).toBe(2);
    expect(responseBody.totalItems).toBe(2);
    expect(responseBody.totalPrice).toBeCloseTo(productPayload.price * 2, 2);

    await clearCart(request, authenticatedClient.token);
    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    // given

    // when
    const response = await getCartWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});
