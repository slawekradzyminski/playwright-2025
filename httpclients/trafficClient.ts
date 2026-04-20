import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import type { TrafficLogsQuery } from '../types/traffic';

export const TRAFFIC_LOGS_ENDPOINT = '/api/v1/traffic/logs';
export const TRAFFIC_INFO_ENDPOINT = '/api/v1/traffic/info';
export const CLIENT_SESSION_HEADER = 'X-Client-Session-Id';

export class TrafficClient {
  constructor(private readonly request: APIRequestContext) {}

  async getLogs(query: TrafficLogsQuery = {}): Promise<APIResponse> {
    return this.request.get(this.buildUrl(TRAFFIC_LOGS_ENDPOINT, query));
  }

  async getLog(correlationId: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${TRAFFIC_LOGS_ENDPOINT}/${encodeURIComponent(correlationId)}`);
  }

  async getInfo(): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${TRAFFIC_INFO_ENDPOINT}`);
  }

  private buildUrl(endpoint: string, query: TrafficLogsQuery): string {
    const url = new URL(`${APP_BASE_URL}${endpoint}`);

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }
}
