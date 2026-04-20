import { expect, test } from '@playwright/test';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { TrafficClient } from '../../../httpclients/trafficClient';
import { asRecord, findTrafficEntryEventually, postJson } from '../../../helpers/trafficHelpers';
import { invalidSigninPayload, trafficSessionId } from '../../../helpers/trafficTestData';
import { SIGNIN_ENDPOINT } from '../../../httpclients/loginClient';
import type { TrafficLogEntryDto } from '../../../types/traffic';

const execFileAsync = promisify(execFile);

test.describe('traffic logs utility', () => {
  test('should render AI-friendly markdown with redacted sensitive fields', async ({ request }, testInfo) => {
    // given
    const trafficClient = new TrafficClient(request);
    const clientSessionId = trafficSessionId(testInfo.title);

    const response = await postJson(request, SIGNIN_ENDPOINT, invalidSigninPayload(), clientSessionId);
    expect(response.status()).toBe(422);

    await findTrafficEntryEventually(trafficClient, { clientSessionId, pathContains: 'signin', status: 422 }, entry => entry.path === SIGNIN_ENDPOINT);

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

    const response = await postJson(request, SIGNIN_ENDPOINT, invalidSigninPayload(), clientSessionId);
    expect(response.status()).toBe(422);

    const entry = await findTrafficEntryEventually(trafficClient, { clientSessionId, pathContains: 'signin', status: 422 }, logEntry => logEntry.path === SIGNIN_ENDPOINT);

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

