import { expect, test } from '@playwright/test';
import { TrafficClient } from '../../../httpclients/trafficClient';
import { asRecord, findTrafficEntryEventually, postJson } from '../../../helpers/trafficHelpers';
import {
  invalidSigninPayload,
  invalidSignupPayload,
  trafficSessionId
} from '../../../helpers/trafficTestData';
import { SIGNIN_ENDPOINT } from '../../../httpclients/loginClient';
import { SIGNUP_ENDPOINT } from '../../../httpclients/signupClient';
import type { PageDto, TrafficLogEntryDto } from '../../../types/traffic';

test.describe('GET /api/v1/traffic/logs', () => {
  test('should return paginated traffic logs - 200', async ({ request }) => {
    // given
    const trafficClient = new TrafficClient(request);

    // when
    const response = await trafficClient.getLogs({ page: 0, size: 5 });

    // then
    expect(response.status()).toBe(200);

    const responseBody: PageDto<TrafficLogEntryDto> = await response.json();
    expectTrafficPageShape(responseBody);

    if (responseBody.content.length > 0) {
      expectTrafficLogEntryShape(responseBody.content[0]);
    }
  });

  test('should record and filter logs by client session id - 200', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);
    const payload = invalidSigninPayload();

    // when
    const signinResponse = await postJson(request, SIGNIN_ENDPOINT, payload, clientSessionId);

    // then
    expect(signinResponse.status()).toBe(422);

    const entry = await findTrafficEntryEventually(trafficClient, {
      clientSessionId,
      pathContains: 'signin',
      status: 422
    });

    expect(entry.clientSessionId).toBe(clientSessionId);
    expect(entry.method).toBe('POST');
    expect(entry.path).toBe(SIGNIN_ENDPOINT);
    expect(entry.status).toBe(422);
    expect(asRecord(entry.responseBody).message).toBe('Invalid username/password supplied');
  });

  test('should support method status path and text filters - 200', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);
    const username = `wronguser-${Date.now()}`;
    const payload = invalidSigninPayload(username);

    const signinResponse = await postJson(request, SIGNIN_ENDPOINT, payload, clientSessionId);
    expect(signinResponse.status()).toBe(422);

    // when
    const entry = await findTrafficEntryEventually(trafficClient, {
      clientSessionId,
      method: 'POST',
      status: 422,
      pathContains: 'signin',
      text: username
    });

    // then
    expect(entry.clientSessionId).toBe(clientSessionId);
    expect(entry.method).toBe('POST');
    expect(entry.path).toBe(SIGNIN_ENDPOINT);
    expect(entry.status).toBe(422);
    expect(asRecord(entry.requestBody).username).toBe(username);
  });

  test('should paginate filtered traffic logs newest first - 200', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);

    const signupResponse = await postJson(request, SIGNUP_ENDPOINT, invalidSignupPayload(), clientSessionId);
    expect(signupResponse.status()).toBe(400);

    const signinResponse = await postJson(request, SIGNIN_ENDPOINT, invalidSigninPayload(), clientSessionId);
    expect(signinResponse.status()).toBe(422);

    await findTrafficEntryEventually(trafficClient, {
      clientSessionId,
      pathContains: 'signin',
      status: 422
    });

    // when
    const firstPageResponse = await trafficClient.getLogs({ page: 0, size: 1, clientSessionId });
    const secondPageResponse = await trafficClient.getLogs({ page: 1, size: 1, clientSessionId });

    // then
    expect(firstPageResponse.status()).toBe(200);
    expect(secondPageResponse.status()).toBe(200);

    const firstPage: PageDto<TrafficLogEntryDto> = await firstPageResponse.json();
    const secondPage: PageDto<TrafficLogEntryDto> = await secondPageResponse.json();

    expect(firstPage.pageNumber).toBe(0);
    expect(firstPage.pageSize).toBe(1);
    expect(firstPage.totalElements).toBe(2);
    expect(firstPage.totalPages).toBe(2);
    expect(firstPage.content).toHaveLength(1);

    expect(secondPage.pageNumber).toBe(1);
    expect(secondPage.pageSize).toBe(1);
    expect(secondPage.totalElements).toBe(2);
    expect(secondPage.totalPages).toBe(2);
    expect(secondPage.content).toHaveLength(1);

    expect(firstPage.content[0].path).toBe(SIGNIN_ENDPOINT);
    expect(secondPage.content[0].path).toBe(SIGNUP_ENDPOINT);
    expect(Date.parse(firstPage.content[0].timestamp)).toBeGreaterThanOrEqual(
      Date.parse(secondPage.content[0].timestamp)
    );
  });

  test('should filter logs by time window - 200', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);
    const from = new Date(Date.now() - 1_000).toISOString();

    const signinResponse = await postJson(request, SIGNIN_ENDPOINT, invalidSigninPayload(), clientSessionId);
    expect(signinResponse.status()).toBe(422);

    const to = new Date(Date.now() + 1_000).toISOString();

    // when
    const entry = await findTrafficEntryEventually(trafficClient, {
      clientSessionId,
      from,
      to
    });

    // then
    const entryTime = Date.parse(entry.timestamp);
    expect(entryTime).toBeGreaterThanOrEqual(Date.parse(from));
    expect(entryTime).toBeLessThanOrEqual(Date.parse(to));
  });

  test('should return validation errors for invalid query params', async ({ request }) => {
    // given
    const trafficClient = new TrafficClient(request);

    // when
    const invalidPageResponse = await trafficClient.getLogs({ page: -1, size: 5 });
    const invalidStatusResponse = await trafficClient.getLogs({ status: 'abc' });
    const invalidDateResponse = await trafficClient.getLogs({ from: 'not-a-date' });

    // then
    expect(invalidPageResponse.status()).toBe(400);
    expect(await invalidPageResponse.json()).toEqual({
      error: 'Page index must not be less than zero'
    });

    expect(invalidStatusResponse.status()).toBe(400);
    expect(asRecord(await invalidStatusResponse.json()).error).toContain('abc');

    expect(invalidDateResponse.status()).toBe(400);
    expect(asRecord(await invalidDateResponse.json()).error).toBe('Invalid instant format: not-a-date');
  });
});

function expectTrafficPageShape(page: PageDto<TrafficLogEntryDto>): void {
  expect(Array.isArray(page.content)).toBe(true);
  expect(page.pageNumber).toEqual(expect.any(Number));
  expect(page.pageSize).toEqual(expect.any(Number));
  expect(page.totalElements).toEqual(expect.any(Number));
  expect(page.totalPages).toEqual(expect.any(Number));
}

function expectTrafficLogEntryShape(entry: TrafficLogEntryDto): void {
  expect(entry.correlationId).toEqual(expect.any(String));
  expect(entry.timestamp).toEqual(expect.any(String));
  expect(Number.isNaN(Date.parse(entry.timestamp))).toBe(false);
  expect(entry.method).toEqual(expect.any(String));
  expect(entry.path).toEqual(expect.any(String));
  expect(entry.status).toEqual(expect.any(Number));
  expect(entry.durationMs).toEqual(expect.any(Number));
  expect(typeof entry.requestBodyTruncated).toBe('boolean');
  expect(typeof entry.responseBodyTruncated).toBe('boolean');
}
