import { test, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
import type { ProductDto } from '../../types/product';
import { validateProductDto } from '../../validators/productsValidator';
import { getProducts } from '../../http/getProducts';
import { postSignIn } from '../../http/postSignIn';

test.describe('/api/products API tests', () => {
  test('should successfully retrieve all products with valid authentication - 200', async ({ request }) => {
    // given
    const loginData: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    const loginResponse = await postSignIn(request, loginData);

    expect(loginResponse.status()).toBe(200);
    const loginResponseBody: LoginResponseDto = await loginResponse.json();
    const token = loginResponseBody.token;

    // when
    const response = await getProducts(request, token);

    // then
    expect(response.status()).toBe(200);
    
    const responseBody: ProductDto[] = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
    responseBody.forEach(product => {
      validateProductDto(product);
    });
  });
}); 