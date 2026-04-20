import { expect, test, type APIRequestContext } from '@playwright/test';
import { APP_BASE_URL } from '../../config/constants';
import { CLIENT_SESSION_HEADER, TrafficClient } from '../../httpclients/trafficClient';
import {
  invalidSigninPayload,
  invalidSignupPayload,
  trafficSessionId
} from '../../helpers/trafficTestData';
import type { PageDto, TrafficInfoDto, TrafficLogEntryDto, TrafficLogsQuery } from '../../types/traffic';

const SIGNIN_ENDPOINT = '/api/v1/users/signin';
const SIGNUP_ENDPOINT = '/api/v1/users/signup';
const MISSING_CORRELATION_ID = '00000000-0000-0000-0000-000000000000';

test.describe('/api/v1/traffic/logs API tests', () => {
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

  test('should return traffic log by correlation id - 200', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
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

  test('should return 404 for missing correlation id', async ({ request }) => {
    // given
    const trafficClient = new TrafficClient(request);

    // when
    const response = await trafficClient.getLog(MISSING_CORRELATION_ID);

    // then
    expect(response.status()).toBe(404);
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

async function postJson(
  request: APIRequestContext,
  endpoint: string,
  data: Record<string, string>,
  clientSessionId: string
) {
  return request.post(`${APP_BASE_URL}${endpoint}`, {
    data,
    headers: {
      'Content-Type': 'application/json',
      [CLIENT_SESSION_HEADER]: clientSessionId
    }
  });
}

async function findTrafficEntryEventually(
  trafficClient: TrafficClient,
  query: TrafficLogsQuery,
  predicate: (entry: TrafficLogEntryDto) => boolean = () => true
): Promise<TrafficLogEntryDto> {
  const timeoutMs = 5_000;
  const intervalMs = 250;
  const startedAt = Date.now();
  let lastResponse: PageDto<TrafficLogEntryDto> | undefined;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await trafficClient.getLogs({ page: 0, size: 10, ...query });
    expect(response.status()).toBe(200);

    const currentResponse: PageDto<TrafficLogEntryDto> = await response.json();
    lastResponse = currentResponse;
    const entry = currentResponse.content.find(predicate);

    if (entry) {
      return entry;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Traffic entry was not captured in time. Last response: ${JSON.stringify(lastResponse ?? null)}`);
}

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

function asRecord(value: unknown): Record<string, string> {
  expect(value).toEqual(expect.any(Object));

  return value as Record<string, string>;
}
