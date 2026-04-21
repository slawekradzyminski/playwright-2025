import { expect, test } from '@playwright/test';
import { findTrafficEntryEventually, postJson } from '../../../helpers/trafficHelpers';
import { invalidSigninPayload, trafficSessionId } from '../../../helpers/trafficTestData';
import { SIGNIN_ENDPOINT } from '../../../httpclients/loginClient';
import { TrafficClient } from '../../../httpclients/trafficClient';
import type { TrafficLogEntryDto } from '../../../types/traffic';

const MISSING_CORRELATION_ID = '00000000-0000-0000-0000-000000000000';

test.describe('GET /api/v1/traffic/logs/{correlationId}', () => {
  let trafficClient: TrafficClient;

  test.beforeEach(async ({ request }) => {
    trafficClient = new TrafficClient(request);
  });

  test('should return traffic log by correlation id - 200', async ({ request }, testInfo) => {
    // given
    const clientSessionId = trafficSessionId(testInfo.title);

    const signinResponse = await postJson(request, SIGNIN_ENDPOINT, invalidSigninPayload(), clientSessionId);
    expect(signinResponse.status()).toBe(422);

    const listEntry = await findTrafficEntryEventually(trafficClient, {
      clientSessionId,
      pathContains: 'signin'
    });

    // when
    const detailResponse = await trafficClient.getLog(listEntry.correlationId);

    // then
    expect(detailResponse.status()).toBe(200);

    const detailEntry: TrafficLogEntryDto = await detailResponse.json();
    expect(detailEntry.correlationId).toBe(listEntry.correlationId);
    expect(detailEntry.clientSessionId).toBe(clientSessionId);
    expect(detailEntry.path).toBe(SIGNIN_ENDPOINT);
    expect(detailEntry.status).toBe(422);
  });

  test('should return 404 for missing correlation id', async () => {
    // given

    // when
    const response = await trafficClient.getLog(MISSING_CORRELATION_ID);

    // then
    expect(response.status()).toBe(404);
  });
});
