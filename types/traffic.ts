export type { PageDto } from './page';

export interface TrafficLogEntryDto {
  correlationId: string;
  timestamp: string;
  clientSessionId: string | null;
  method: string;
  path: string;
  queryString: string | null;
  status: number;
  durationMs: number;
  requestHeaders: Record<string, string[]> | null;
  requestContentType: string | null;
  requestBody: unknown;
  requestBodyTruncated: boolean;
  requestBodyOriginalLength: number;
  requestBodyStoredLength: number;
  responseHeaders: Record<string, string[]> | null;
  responseContentType: string | null;
  responseBody: unknown;
  responseBodyTruncated: boolean;
  responseBodyOriginalLength: number;
  responseBodyStoredLength: number;
}

export interface TrafficInfoDto {
  webSocketEndpoint: string;
  topic: string;
  description: string;
}

export interface TrafficLogsQuery {
  page?: number;
  size?: number;
  clientSessionId?: string;
  method?: string;
  status?: number | string;
  pathContains?: string;
  text?: string;
  from?: string;
  to?: string;
}
