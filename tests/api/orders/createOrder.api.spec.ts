import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { OrderDto } from '../../../types/order';
import { createOrder, createOrderWithoutAuth } from '../../../http/orders/createOrderRequest';
import { generateRandomAddress } from '../../../generators/addressGenerator';
import { prepareCartWithProduct } from './orderTestHelper';

test.describe('POST /api/orders API tests', () => {
  test('should create order when cart has items - 201', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { product, shippingAddress } = await prepareCartWithProduct(request, adminToken, clientToken, 2);

    // when
    const response = await createOrder(request, clientToken, shippingAddress);

    // then
    expect(response.status()).toBe(201);
    const body: OrderDto = await response.json();
    expect(body.items.length).toBeGreaterThan(0);
    const orderedItem = body.items.find((item) => item.productId === product.id);
    expect(orderedItem).toBeTruthy();
    expect(orderedItem?.quantity).toBe(2);
    expect(body.status).toBe('PENDING');
  });

  test('should return bad request when cart is empty - 400', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const shippingAddress = generateRandomAddress();

    // when
    const response = await createOrder(request, token, shippingAddress);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const shippingAddress = generateRandomAddress();

    // when
    const response = await createOrderWithoutAuth(request, shippingAddress);

    // then
    expect(response.status()).toBe(401);
  });
});
