import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { clearCart } from '../../../http/cartClient';
import { createOrder } from '../../../http/ordersClient';
import { test } from '../../fixtures/auth.fixture';
import { createPendingOrder, shippingAddress } from '../helpers/orderTestUtils';

test.describe('/api/orders POST API tests', () => {
  test('should create order from cart - 201', async ({ request, clientAuth }) => {
    // given
    await clearCart(request, clientAuth.jwtToken);

    // when
    const responseBody = await createPendingOrder(request, clientAuth.jwtToken);

    // then
    expect(responseBody.status).toBe('PENDING');
    expect(responseBody.shippingAddress.street).toBe(shippingAddress.street);
  });

  test('should return error for empty cart - 400', async ({ request, clientAuth }) => {
    // given
    await clearCart(request, clientAuth.jwtToken);

    // when
    const response = await createOrder(request, clientAuth.jwtToken, shippingAddress);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Cart is empty' });
  });

  test('should return unauthorized for create order without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/api/orders`, { data: shippingAddress });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
