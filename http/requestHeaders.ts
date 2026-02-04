export const JSON_HEADERS = {
  'Content-Type': 'application/json'
} as const;

export const getBearerAuthHeaders = (jwtToken: string) => ({
  Authorization: `Bearer ${jwtToken}`
});

export const getJsonAuthHeaders = (jwtToken: string) => ({
  ...JSON_HEADERS,
  ...getBearerAuthHeaders(jwtToken)
});
