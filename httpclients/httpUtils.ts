export const buildAuthHeaders = (token?: string): { Authorization: string } | undefined => {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};
