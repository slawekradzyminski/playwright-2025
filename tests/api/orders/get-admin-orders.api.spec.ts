import { test, expect } from '../fixtures/adminAuthFixture';
import { OrderClient } from '../../../httpclients/orderClient';
import type { OrderDto, PageDto } from '../../../types/order';
import { registerAndLogin } from '../../../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('GET /api/v1/orders/admin', () => {
  let client: OrderClient;

  test.beforeEach(async ({ request }) => {
    client = new OrderClient(request, APP_BASE_URL);
  });

  test('should return all orders for admin - 200', async ({ adminRequest }) => {
    // given

    // when
    const response = await adminRequest.get('/api/v1/orders/admin', {
      params: {
        page: 0,
        size: 10
      }
    });

    // then
    expect(response.status()).toBe(200);
    const body: PageDto<OrderDto> = await response.json();
    expect(Array.isArray(body.content)).toBe(true);
    expect(body.pageNumber).toEqual(expect.any(Number));
    expect(body.pageSize).toEqual(expect.any(Number));
    expect(body.totalElements).toEqual(expect.any(Number));
    expect(body.totalPages).toEqual(expect.any(Number));
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getAdminOrders(undefined, { page: 0, size: 10 });

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return forbidden for regular client - 403', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);

    // when
    const response = await client.getAdminOrders(token, { page: 0, size: 10 });

    // then
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.message).toBe('Access denied');
  });
});
