import { test, expect } from '../../../fixtures/apiAuthFixtures';
import {
  addItemToCart,
  addItemToCartWithoutAuth,
} from '../../../http/cart/cartItemsCollectionPostClient';
import { clearCart } from '../../../http/cart/cartCollectionDeleteClient';
import { generateProductCreateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from '../products/productTestUtils';
import type { CartDto } from '../../../types/cart';

test.describe('/api/cart/items POST', () => {
  test('should add item to cart with client token - 200', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    await clearCart(request, authenticatedClient.token);
    const productPayload = generateProductCreateData();
    const product = await createProductViaApi(request, authenticatedAdmin.token, productPayload);

    // when
    const response = await addItemToCart(request, authenticatedClient.token, {
      productId: product.id,
      quantity: 3,
    });

    // then
    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as CartDto;
    expect(responseBody.username).toBe(authenticatedClient.user.username);
    expect(responseBody.items.length).toBe(1);
    expect(responseBody.items[0].productId).toBe(product.id);
    expect(responseBody.items[0].quantity).toBe(3);
    expect(responseBody.totalItems).toBe(3);
    expect(responseBody.totalPrice).toBeCloseTo(productPayload.price * 3, 2);

    await clearCart(request, authenticatedClient.token);
    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return bad request for quantity below minimum - 400', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    await clearCart(request, authenticatedClient.token);
    const productPayload = generateProductCreateData();
    const product = await createProductViaApi(request, authenticatedAdmin.token, productPayload);

    // when
    const response = await addItemToCart(request, authenticatedClient.token, {
      productId: product.id,
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
    const response = await addItemToCartWithoutAuth(request, {
      productId: 1,
      quantity: 1,
    });

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return product not found when product is missing - 404', async ({ request, authenticatedClient }) => {
    // given

    // when
    const response = await addItemToCart(request, authenticatedClient.token, {
      productId: 999999,
      quantity: 1,
    });

    // then
    expect(response.status()).toBe(404);
  });
});
