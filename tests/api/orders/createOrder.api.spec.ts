import { test, expect } from '../../../fixtures/apiAuthFixture';
import { createOrder } from '../../../http/orders/createOrderRequest';
import { generateAddress } from '../../../generators/addressGenerator';
import { seedCartWithProduct, resetCart } from '../../helpers';
import type { AddressDto, OrderDto } from '../../../types/orders';

test.describe('POST /api/orders API tests', () => {
  test('client should create an order from cart - 201', async ({ request, adminAuth, clientAuth }) => {
    // given
    await seedCartWithProduct(request, adminAuth.token, clientAuth.token);
    const shippingAddress: AddressDto = generateAddress();

    // when
    const response = await createOrder(request, shippingAddress, clientAuth.token);

    // then
    expect(response.status()).toBe(201);
    const responseBody: OrderDto = await response.json();
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBe(clientAuth.userData.username);
    expect(responseBody.items.length).toBeGreaterThan(0);
    expect(responseBody.status).toBe('PENDING');
    expect(responseBody.totalAmount).toBeGreaterThan(0);
    expect(responseBody.shippingAddress.street).toBe(shippingAddress.street);
    expect(responseBody.shippingAddress.city).toBe(shippingAddress.city);
    expect(responseBody.shippingAddress.state).toBe(shippingAddress.state);
    expect(responseBody.shippingAddress.zipCode).toBe(shippingAddress.zipCode);
    expect(responseBody.shippingAddress.country).toBe(shippingAddress.country);
  });

  test('should return bad request when cart is empty - 400', async ({ request, clientAuth }) => {
    // given
    const shippingAddress: AddressDto = generateAddress();
    await resetCart(request, clientAuth.token);

    // when
    const response = await createOrder(request, shippingAddress, clientAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const shippingAddress: AddressDto = generateAddress();

    // when
    const response = await createOrder(request, shippingAddress);

    // then
    expect(response.status()).toBe(401);
  });
});
