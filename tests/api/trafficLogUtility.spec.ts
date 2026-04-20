import { expect, test, type APIRequestContext } from '@playwright/test';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { APP_BASE_URL } from '../../config/constants';
import { CLIENT_SESSION_HEADER, TrafficClient } from '../../httpclients/trafficClient';
import { invalidSigninPayload, trafficSessionId } from '../../helpers/trafficTestData';
import type { PageDto, TrafficLogEntryDto } from '../../types/traffic';

const execFileAsync = promisify(execFile);
const SIGNIN_ENDPOINT = '/api/v1/users/signin';

test.describe('traffic logs utility', () => {
  test('should render AI-friendly markdown with redacted sensitive fields', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);

    const response = await postSigninFailure(request, clientSessionId);
    expect(response.status()).toBe(422);

    await findTrafficEntryEventually(trafficClient, clientSessionId);

    // when
    const { stdout } = await execFileAsync(
      'node',
      ['scripts/traffic-logs.mjs', '--session', clientSessionId, '--path', 'signin', '--status', '422'],
      { cwd: process.cwd() }
    );

    // then
    expect(stdout).toContain('# Traffic Logs');
    expect(stdout).toContain(`POST ${SIGNIN_ENDPOINT} -> 422`);
    expect(stdout).toContain('[REDACTED]');
    expect(stdout).toContain('Invalid username/password supplied');
    expect(stdout).not.toContain('wrongpassword');
    expect(stdout).not.toContain(clientSessionId);
  });

  test('should render redacted JSON for a correlation id', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);

    const response = await postSigninFailure(request, clientSessionId);
    expect(response.status()).toBe(422);

    const entry = await findTrafficEntryEventually(trafficClient, clientSessionId);

    // when
    const { stdout } = await execFileAsync(
      'node',
      ['scripts/traffic-logs.mjs', '--correlation-id', entry.correlationId, '--format', 'json'],
      { cwd: process.cwd() }
    );

    // then
    const output = JSON.parse(stdout) as TrafficLogEntryDto;
    expect(output.correlationId).toBe(entry.correlationId);
    expect(output.path).toBe(SIGNIN_ENDPOINT);
    expect(output.status).toBe(422);
    expect(asRecord(output.requestBody).password).toBe('[REDACTED]');
    expect(output.clientSessionId).toBe('[REDACTED]');
    expect(stdout).not.toContain('wrongpassword');
    expect(stdout).not.toContain(clientSessionId);
  });
});

async function postSigninFailure(request: APIRequestContext, clientSessionId: string) {
  return request.post(`${APP_BASE_URL}${SIGNIN_ENDPOINT}`, {
    data: invalidSigninPayload(),
    headers: {
      'Content-Type': 'application/json',
      [CLIENT_SESSION_HEADER]: clientSessionId
    }
  });
}

async function findTrafficEntryEventually(
  trafficClient: TrafficClient,
  clientSessionId: string
): Promise<TrafficLogEntryDto> {
  const timeoutMs = 5_000;
  const intervalMs = 250;
  const startedAt = Date.now();
  let lastResponse: PageDto<TrafficLogEntryDto> | undefined;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await trafficClient.getLogs({
      page: 0,
      size: 10,
      clientSessionId,
      pathContains: 'signin',
      status: 422
    });
    expect(response.status()).toBe(200);

    const currentResponse: PageDto<TrafficLogEntryDto> = await response.json();
    lastResponse = currentResponse;
    const entry = currentResponse.content.find(logEntry => logEntry.path === SIGNIN_ENDPOINT);

    if (entry) {
      return entry;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Traffic entry was not captured in time. Last response: ${JSON.stringify(lastResponse ?? null)}`);
}

function asRecord(value: unknown): Record<string, string> {
  expect(value).toEqual(expect.any(Object));

  return value as Record<string, string>;
}
