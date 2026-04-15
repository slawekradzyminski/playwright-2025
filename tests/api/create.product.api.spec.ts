import { APIResponse } from '@playwright/test';
import { test, expect } from '../../fixtures/apiAuthFixture';
import { generateProduct } from '../../generators/productGenerator';
import { loginClient } from '../../httpclients/loginClient';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/constants';
import { productsClient } from '../../httpclients/productsClient';
import { CreateProductRequest, ProductResponse } from '../../types/products';

test.describe('/api/v1/products API tests', () => {
    test('should successfully generate new product - 200', async ({ request }) => {
        // given
        const product = generateProduct();
        const adminLoginResponse = await loginClient.postLogin(request, {
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD
        });
        const { token } = await adminLoginResponse.json();

        // when
        const response = await productsClient.createProduct(request, product, token);

        // then
        expect(response.status()).toBe(201);
        await assertProductResponse(response, product);
    });

    test('should return unauthorized error when no token provided - 401', async ({ request }) => {
        // when
        const response = await productsClient.createProduct(request, generateProduct());

        // then
        expect(response.status()).toBe(401);
    });

    test('should return unauthorized error if fake token provided - 401', async ({ request }) => {
        // when
        const response = await productsClient.createProduct(request, generateProduct(), 'fakeToken');

        // then
        expect(response.status()).toBe(401);
    });

    test('should forbid client to create a product - 403', async ({ request, auth }) => {
        // given
        const { token } = auth;

        // when
        const response = await productsClient.createProduct(request, generateProduct(), token);

        // then
        expect(response.status()).toBe(403);
    });
});

const assertProductResponse = async (response: APIResponse, product: CreateProductRequest) => {
    const responseBody: ProductResponse = await response.json();
    expect(responseBody).toMatchObject({
        id: expect.any(Number),
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.category,
        imageUrl: product.imageUrl,
    });

    const createdAt = new Date(responseBody.createdAt);
    const updatedAt = new Date(responseBody.updatedAt);

    expect(createdAt.getTime()).toBeLessThanOrEqual(updatedAt.getTime());
}   