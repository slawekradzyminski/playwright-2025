import { test, expect } from '../../fixtures/apiAuth';
import { attemptCreateQrCode } from '../../http/createQrCodeClient';
import type { CreateQrDto } from '../../types/qr';

const LOWER_PNG_SIZE_THRESHOLD = 50;

test.describe('/qr/create API tests', () => {
  test('should generate QR PNG for valid input - 200', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;
    const body: CreateQrDto = { text: 'https://example.com' };

    // when
    const response = await attemptCreateQrCode(request, body, token);

    // then
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('image/png');

    const bytes = await response.body();
    expect(bytes.byteLength).toBeGreaterThan(LOWER_PNG_SIZE_THRESHOLD);

    // PNG magic number 89 50 4E 47 0D 0A 1A 0A (RFC 2083 / W3C PNG spec).
    const expected = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const signature = Array.from(bytes.subarray(0, 8));
    expect(signature).toEqual(expected);
  });

  test('should return validation error for missing text - 400', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;
    const invalidBody = {} as unknown as CreateQrDto;

    // when
    const response = await attemptCreateQrCode(request, invalidBody, token);

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.text).toBe('Text is required');
  });

  test('should reject unauthenticated request - 401', async ({ request }) => {
    // given
    const body: CreateQrDto = { text: 'hello' };

    // when
    const response = await attemptCreateQrCode(request, body);

    // then
    expect(response.status()).toBe(401);
  });
});
