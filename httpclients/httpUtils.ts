export const buildAuthHeaders = (token?: string): { Authorization: string } | undefined => {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const buildJsonHeaders = (token?: string): { 'Content-Type': string; Authorization?: string } => ({
  ...buildAuthHeaders(token),
  'Content-Type': 'application/json'
});
