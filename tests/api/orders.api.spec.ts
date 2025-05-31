import { test, expect } from '../../fixtures/auth.fixture';
import type { PageDtoOrderDto } from '../../types/order';
import { OrderStatus } from '../../types/order';
import { validatePageDtoOrderDto } from '../../validators/orderValidator';
import { getOrders } from '../../http/getOrders';

test.describe('/api/orders API tests', () => {
  test('should successfully retrieve orders with valid authentication - 200', async ({ request, authToken }) => {
    // when
    const response = await getOrders(request, authToken);

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: PageDtoOrderDto = await response.json();
    validatePageDtoOrderDto(responseBody);
  });

  test('should successfully retrieve orders with pagination parameters - 200', async ({ request, authToken }) => {
    // when
    const response = await getOrders(request, authToken, { page: 0, size: 5 });

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: PageDtoOrderDto = await response.json();
    validatePageDtoOrderDto(responseBody);
    expect(responseBody.pageNumber).toBe(0);
    expect(responseBody.pageSize).toBe(5);
  });

  test('should successfully retrieve orders with status filter - 200', async ({ request, authToken }) => {
    // when
    const response = await getOrders(request, authToken, { status: OrderStatus.PENDING });

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: PageDtoOrderDto = await response.json();
    validatePageDtoOrderDto(responseBody);
  });

  test('should return unauthorized error without authentication token - 401', async ({ request }) => {
    // when
    const response = await getOrders(request, '');

    // then
    expect(response.status()).toBe(401);
  });
}); 