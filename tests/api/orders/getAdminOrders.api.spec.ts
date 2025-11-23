import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { PageDtoOrderDto } from '../../../types/order';
import { getAdminOrders, getAdminOrdersWithoutAuth } from '../../../http/orders/getAdminOrdersRequest';
import { createOrderForClient } from './orderTestHelper';

test.describe('GET /api/orders/admin API tests', () => {
  test('should retrieve all orders as admin - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const { order } = await createOrderForClient(request, adminToken, clientToken);

    // when
    const firstPageResponse = await getAdminOrders(request, adminToken, { size: 20 });
    expect(firstPageResponse.status()).toBe(200);
    const firstPage: PageDtoOrderDto = await firstPageResponse.json();
    let retrievedOrder = firstPage.content.find(({ username }) => username === order.username);

    if (!retrievedOrder && firstPage.totalPages > 1) {
      const lastPageIndex = firstPage.totalPages - 1;
      const lastPageResponse = await getAdminOrders(request, adminToken, { page: lastPageIndex, size: 20 });
      expect(lastPageResponse.status()).toBe(200);
      const lastPage: PageDtoOrderDto = await lastPageResponse.json();
      retrievedOrder = lastPage.content.find(({ username }) => username === order.username);
    }

    // then
    expect(retrievedOrder).toBeTruthy();
  });

  test('should return forbidden error when client requests admin orders - 403', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    await createOrderForClient(request, adminToken, clientToken);

    // when
    const response = await getAdminOrders(request, clientToken);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given / when
    const response = await getAdminOrdersWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });
});
