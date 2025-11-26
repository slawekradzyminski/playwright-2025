import { test, expect } from '../../../fixtures/apiAuthFixture';
import { createQrCode } from '../../../http/qr/createQrCodeRequest';
import type { CreateQrDto } from '../../../types/qr';
import { INVALID_TOKEN } from '../../../config/constants';
import { faker } from '@faker-js/faker';

test.describe('POST /qr/create API tests', () => {
  test('should successfully create QR code with valid URL - 200', async ({ request, clientAuth }) => {
    // given
    const qrData: CreateQrDto = {
      text: faker.internet.url()
    };

    // when
    const response = await createQrCode(request, qrData, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const body = await response.body();
    expect(body.length).toBeGreaterThan(0);
  });

  test('should successfully create QR code with text content - 200', async ({ request, clientAuth }) => {
    // given
    const qrData: CreateQrDto = {
      text: faker.lorem.sentence()
    };

    // when
    const response = await createQrCode(request, qrData, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const body = await response.body();
    expect(body.length).toBeGreaterThan(0);
  });

  test('should successfully create QR code with admin token - 200', async ({ request, adminAuth }) => {
    // given
    const qrData: CreateQrDto = {
      text: faker.internet.url()
    };

    // when
    const response = await createQrCode(request, qrData, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('should return validation error for empty text - 400', async ({ request, clientAuth }) => {
    // given
    const qrData: CreateQrDto = {
      text: ''
    };

    // when
    const response = await createQrCode(request, qrData, clientAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // given
    const qrData: CreateQrDto = {
      text: faker.internet.url()
    };

    // when
    const response = await createQrCode(request, qrData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given
    const qrData: CreateQrDto = {
      text: faker.internet.url()
    };

    // when
    const response = await createQrCode(request, qrData, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});
