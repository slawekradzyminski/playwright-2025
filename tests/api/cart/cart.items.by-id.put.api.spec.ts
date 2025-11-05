import { test, expect } from '../../../fixtures/apiAuthFixtures';
import {
  updateCartItem,
  updateCartItemWithoutAuth,
} from '../../../http/cart/cartItemsByIdPutClient';
import { addItemToCart } from '../../../http/cart/cartItemsCollectionPostClient';
import { clearCart } from '../../../http/cart/cartCollectionDeleteClient';
import { generateProductCreateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from '../products/productTestUtils';
import type { CartDto } from '../../../types/cart';

test.describe('/api/cart/items/{productId} PUT', () => {
  test('should update item quantity with client token - 200', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    await clearCart(request, authenticatedClient.token);
    const productPayload = generateProductCreateData();
    const product = await createProductViaApi(request, authenticatedAdmin.token, productPayload);
    await addItemToCart(request, authenticatedClient.token, {
      productId: product.id,
      quantity: 1,
    });

    // when
    const response = await updateCartItem(request, authenticatedClient.token, product.id, {
      quantity: 4,
    });

    // then
    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as CartDto;
    expect(responseBody.items.length).toBe(1);
    expect(responseBody.items[0].quantity).toBe(4);
    expect(responseBody.totalItems).toBe(4);
    expect(responseBody.totalPrice).toBeCloseTo(productPayload.price * 4, 2);

    await clearCart(request, authenticatedClient.token);
    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return bad request for quantity below minimum - 400', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    await clearCart(request, authenticatedClient.token);
    const productPayload = generateProductCreateData();
    const product = await createProductViaApi(request, authenticatedAdmin.token, productPayload);
    await addItemToCart(request, authenticatedClient.token, {
      productId: product.id,
      quantity: 1,
    });

    // when
    const response = await updateCartItem(request, authenticatedClient.token, product.id, {
      quantity: 0,
    });

    // then
    expect(response.status()).toBe(400);

    await clearCart(request, authenticatedClient.token);
    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    // given

    // when
    const response = await updateCartItemWithoutAuth(request, 1, {
      quantity: 2,
    });

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return cart item not found when item is missing - 404', async ({ request, authenticatedClient }) => {
    // given
    await clearCart(request, authenticatedClient.token);

    // when
    const response = await updateCartItem(request, authenticatedClient.token, 999999, {
      quantity: 2,
    });

    // then
    expect(response.status()).toBe(404);
  });
});
