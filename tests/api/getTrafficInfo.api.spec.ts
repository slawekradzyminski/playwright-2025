import { test, expect } from '../../fixtures/apiAuth';
import { attemptGetTrafficInfo } from '../../http/getTrafficInfoClient';
import type { TrafficInfoDto } from '../../types/traffic';

test.describe('/api/traffic/info API tests', () => {
  test('should return traffic info for authenticated user - 200', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;

    // when
    const response = await attemptGetTrafficInfo(request, token);

    // then
    expect(response.status()).toBe(200);
    const info: TrafficInfoDto = await response.json();
    expect(info.webSocketEndpoint).toBe('/ws-traffic');
    expect(info.topic).toBe('/topic/traffic');
    expect(info.description).toBe(
      'Connect to the WebSocket endpoint and subscribe to the topic to receive real-time HTTP traffic events'
    );
  });

  test('should require authentication - 401', async ({ request }) => {
    // given
    // no token provided

    // when
    const response = await attemptGetTrafficInfo(request);

    // then
    expect(response.status()).toBe(401);
  });
});
