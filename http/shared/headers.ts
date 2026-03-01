export const jsonHeaders = {
  'Content-Type': 'application/json',
} as const;

export const authHeaders = (jwtToken: string): Record<string, string> => ({
  Authorization: `Bearer ${jwtToken}`,
});
