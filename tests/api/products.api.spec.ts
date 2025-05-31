import { test, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
import type { ProductDto } from '../../types/product';
import { API_URL } from '../../config/constants';
import { validateProductDto } from '../../validators/productsValidator';

const SIGNIN_ENDPOINT = '/users/signin';
const PRODUCTS_ENDPOINT = '/api/products';

test.describe('/api/products API tests', () => {
  test('should successfully retrieve all products with valid authentication - 200', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    const loginResponse = await request.post(`${API_URL}${SIGNIN_ENDPOINT}`, {
      data: loginData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(loginResponse.status()).toBe(200);
    const loginResponseBody: LoginResponseDto = await loginResponse.json();
    const token = loginResponseBody.token;

    // when
    const response = await request.get(`${API_URL}${PRODUCTS_ENDPOINT}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: ProductDto[] = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
    responseBody.forEach(product => {
      validateProductDto(product);
    });
  });
}); 