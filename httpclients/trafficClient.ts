import type { APIResponse } from '@playwright/test';
import type { TrafficLogsQuery } from '../types/traffic';
import { BaseApiClient } from './baseApiClient';

export const TRAFFIC_LOGS_ENDPOINT = '/api/v1/traffic/logs';
export const TRAFFIC_INFO_ENDPOINT = '/api/v1/traffic/info';
export const CLIENT_SESSION_HEADER = 'X-Client-Session-Id';

export class TrafficClient extends BaseApiClient {
  async getLogs(query: TrafficLogsQuery = {}): Promise<APIResponse> {
    return this.get(this.buildUrl(TRAFFIC_LOGS_ENDPOINT, query));
  }

  async getLog(correlationId: string): Promise<APIResponse> {
    return this.get(`${TRAFFIC_LOGS_ENDPOINT}/${encodeURIComponent(correlationId)}`);
  }

  async getInfo(): Promise<APIResponse> {
    return this.get(TRAFFIC_INFO_ENDPOINT);
  }
}
