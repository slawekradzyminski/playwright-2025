import { type APIRequestContext, expect } from '@playwright/test';
import { CLIENT_SESSION_HEADER, type TrafficClient } from '../httpclients/trafficClient';
import type { PageDto, TrafficLogEntryDto, TrafficLogsQuery } from '../types/traffic';

export async function postJson(
  request: APIRequestContext,
  endpoint: string,
  data: Record<string, string>,
  clientSessionId: string
) {
  return request.post(endpoint, {
    data,
    headers: {
      'Content-Type': 'application/json',
      [CLIENT_SESSION_HEADER]: clientSessionId
    }
  });
}

export async function findTrafficEntryEventually(
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

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Traffic entry was not captured in time. Last response: ${JSON.stringify(lastResponse ?? null)}`);
}

export function asRecord(value: unknown): Record<string, string> {
  expect(value).toEqual(expect.any(Object));

  return value as Record<string, string>;
}
