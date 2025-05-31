import { test, expect } from '../../fixtures/auth.fixture';
import type { CartDto, CartItemDto, UpdateCartItemDto } from '../../types/cart';
import type { ProductDto } from '../../types/product';
import { validateCartDto } from '../../validators/cartValidator';
import { getCart } from '../../http/getCart';
import { postCartItem } from '../../http/postCartItem';
import { putCartItem } from '../../http/putCartItem';
import { deleteCartItem } from '../../http/deleteCartItem';
import { deleteCart } from '../../http/deleteCart';
import { getProducts } from '../../http/getProducts';

test.describe('/api/cart API tests', () => {
  let testProductId: number;

  test.beforeEach(async ({ request, authToken }) => {
    // given - get a product to use in tests
    const productsResponse = await getProducts(request, authToken);
    const products: ProductDto[] = await productsResponse.json();
    testProductId = products[0].id;

    // clear cart before each test
    await deleteCart(request, authToken);
  });

  test.describe('GET /api/cart', () => {
    test('should successfully retrieve cart with valid authentication - 200', async ({ request, authToken }) => {
      // when
      const response = await getCart(request, authToken);

      // then
      expect(response.status()).toBe(200);
      
      const responseBody: CartDto = await response.json();
      validateCartDto(responseBody);
    });

    test('should return unauthorized error without authentication token - 401', async ({ request }) => {
      // when
      const response = await getCart(request, '');

      // then
      expect(response.status()).toBe(401);
    });
  });

  test.describe('POST /api/cart/items', () => {
    test('should successfully add item to cart - 200', async ({ request, authToken }) => {
      // given
      const cartItem: CartItemDto = {
        productId: testProductId,
        quantity: 2
      };

      // when
      const response = await postCartItem(request, authToken, cartItem);

      // then
      expect(response.status()).toBe(200);
      
      const responseBody: CartDto = await response.json();
      validateCartDto(responseBody);
      expect(responseBody.items).toHaveLength(1);
      expect(responseBody.items[0].productId).toBe(testProductId);
      expect(responseBody.items[0].quantity).toBe(2);
      expect(responseBody.totalItems).toBe(2);
    });

    test('should return bad request for invalid product data - 400', async ({ request, authToken }) => {
      // given
      const invalidCartItem = {
        productId: "invalid",
        quantity: -1
      };

      // when
      const response = await postCartItem(request, authToken, invalidCartItem as any);

      // then
      expect(response.status()).toBe(400);
    });

    test('should return unauthorized error without authentication token - 401', async ({ request }) => {
      // given
      const cartItem: CartItemDto = {
        productId: testProductId,
        quantity: 1
      };

      // when
      const response = await postCartItem(request, '', cartItem);

      // then
      expect(response.status()).toBe(401);
    });

    test('should return not found for non-existent product - 404', async ({ request, authToken }) => {
      // given
      const cartItem: CartItemDto = {
        productId: 999999,
        quantity: 1
      };

      // when
      const response = await postCartItem(request, authToken, cartItem);

      // then
      expect(response.status()).toBe(404);
    });
  });

  test.describe('PUT /api/cart/items/{productId}', () => {
    test.beforeEach(async ({ request, authToken }) => {
      // given - add item to cart first
      const cartItem: CartItemDto = {
        productId: testProductId,
        quantity: 1
      };
      await postCartItem(request, authToken, cartItem);
    });

    test('should successfully update cart item quantity - 200', async ({ request, authToken }) => {
      // given
      const updateData: UpdateCartItemDto = {
        quantity: 5
      };

      // when
      const response = await putCartItem(request, authToken, testProductId, updateData);

      // then
      expect(response.status()).toBe(200);
      
      const responseBody: CartDto = await response.json();
      validateCartDto(responseBody);
      expect(responseBody.items[0].quantity).toBe(5);
      expect(responseBody.totalItems).toBe(5);
    });

    test('should return bad request for invalid quantity - 400', async ({ request, authToken }) => {
      // given
      const invalidUpdateData = {
        quantity: -1
      };

      // when
      const response = await putCartItem(request, authToken, testProductId, invalidUpdateData);

      // then
      expect(response.status()).toBe(400);
    });

    test('should return unauthorized error without authentication token - 401', async ({ request }) => {
      // given
      const updateData: UpdateCartItemDto = {
        quantity: 3
      };

      // when
      const response = await putCartItem(request, '', testProductId, updateData);

      // then
      expect(response.status()).toBe(401);
    });

    test('should return not found for item not in cart - 404', async ({ request, authToken }) => {
      // given
      const updateData: UpdateCartItemDto = {
        quantity: 3
      };
      const nonExistentProductId = 999999;

      // when
      const response = await putCartItem(request, authToken, nonExistentProductId, updateData);

      // then
      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /api/cart/items/{productId}', () => {
    test.beforeEach(async ({ request, authToken }) => {
      // given - add item to cart first
      const cartItem: CartItemDto = {
        productId: testProductId,
        quantity: 2
      };
      await postCartItem(request, authToken, cartItem);
    });

    test('should successfully remove item from cart - 200', async ({ request, authToken }) => {
      // when
      const response = await deleteCartItem(request, authToken, testProductId);

      // then
      expect(response.status()).toBe(200);
      
      const responseBody: CartDto = await response.json();
      validateCartDto(responseBody);
      expect(responseBody.items).toHaveLength(0);
      expect(responseBody.totalItems).toBe(0);
    });

    test('should return unauthorized error without authentication token - 401', async ({ request }) => {
      // when
      const response = await deleteCartItem(request, '', testProductId);

      // then
      expect(response.status()).toBe(401);
    });

    test('should return not found for item not in cart - 404', async ({ request, authToken }) => {
      // given
      const nonExistentProductId = 999999;

      // when
      const response = await deleteCartItem(request, authToken, nonExistentProductId);

      // then
      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /api/cart', () => {
    test.beforeEach(async ({ request, authToken }) => {
      // given - add items to cart first
      const cartItem1: CartItemDto = {
        productId: testProductId,
        quantity: 2
      };
      await postCartItem(request, authToken, cartItem1);
    });

    test('should successfully clear cart - 200', async ({ request, authToken }) => {
      // when
      const response = await deleteCart(request, authToken);

      // then
      expect(response.status()).toBe(200);
      
      // verify cart is empty
      const cartResponse = await getCart(request, authToken);
      const cartBody: CartDto = await cartResponse.json();
      expect(cartBody.items).toHaveLength(0);
      expect(cartBody.totalItems).toBe(0);
    });

    test('should return unauthorized error without authentication token - 401', async ({ request }) => {
      // when
      const response = await deleteCart(request, '');

      // then
      expect(response.status()).toBe(401);
    });
  });
}); 