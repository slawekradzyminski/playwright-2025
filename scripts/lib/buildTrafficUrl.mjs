const TRAFFIC_LOGS_ENDPOINT = '/api/v1/traffic/logs';

export function buildTrafficUrl(baseUrl, args) {
  const url = new URL(
    args.correlationId
      ? `${TRAFFIC_LOGS_ENDPOINT}/${encodeURIComponent(args.correlationId)}`
      : TRAFFIC_LOGS_ENDPOINT,
    baseUrl
  );

  if (args.correlationId) {
    return url;
  }

  const queryParams = {
    page: args.page,
    size: args.size,
    clientSessionId: args.clientSessionId,
    method: args.method,
    status: args.status,
    pathContains: args.pathContains,
    text: args.text,
    from: args.from,
    to: args.to
  };

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}
