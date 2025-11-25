import { test, expect } from '../../fixtures/apiAuthFixture';
import { updateOrderStatus } from '../../http/updateOrderStatusRequest';
import { placeOrderForClient } from './helpers/orderTestUtils';

test.describe('PUT /api/orders/{id}/status API tests', () => {
  test('admin should update order status - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await updateOrderStatus(request, order.id, 'PAID', adminAuth.token);

    // then
    expect(response.status()).toBe(200);
  });

  test('should return bad request for invalid status value - 400', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await updateOrderStatus(request, order.id, 'INVALID_STATUS' as any, adminAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized when token is missing - 401', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await updateOrderStatus(request, order.id, 'PAID');

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden for client token - 403', async ({ request, adminAuth, clientAuth }) => {
    // given
    const { order } = await placeOrderForClient(request, adminAuth.token, clientAuth.token);

    // when
    const response = await updateOrderStatus(request, order.id, 'PAID', clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for missing order - 404', async ({ request, adminAuth }) => {
    // when
    const response = await updateOrderStatus(request, 999999, 'PAID', adminAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});
