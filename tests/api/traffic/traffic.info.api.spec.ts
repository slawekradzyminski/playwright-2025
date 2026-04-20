import { expect, test } from '@playwright/test';
import { TrafficClient } from '../../../httpclients/trafficClient';
import type { TrafficInfoDto } from '../../../types/traffic';

test.describe('GET /api/v1/traffic/info', () => {
  test('should return traffic monitoring info - 200', async ({ request }) => {
    // given
    const trafficClient = new TrafficClient(request);

    // when
    const response = await trafficClient.getInfo();

    // then
    expect(response.status()).toBe(200);

    const responseBody: TrafficInfoDto = await response.json();
    expect(responseBody.webSocketEndpoint).toBe('/api/v1/ws-traffic');
    expect(responseBody.topic).toBe('/topic/traffic');
    expect(responseBody.description).toContain('WebSocket');
  });
});
