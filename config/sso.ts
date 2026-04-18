export const SSO_CALLBACK_PATH = '/auth/sso/callback';
export const SSO_AUTHORITY = process.env.SSO_AUTHORITY ?? 'http://localhost:8082/realms/awesome-testing';
export const SSO_BACKEND_BASE_URL = process.env.SSO_BACKEND_BASE_URL ?? process.env.API_BASE_URL ?? process.env.APP_BASE_URL ?? 'http://localhost:8081';
export const SSO_CLIENT_ID = process.env.SSO_CLIENT_ID ?? 'awesome-testing-frontend';
export const SSO_USERNAME = process.env.SSO_USERNAME ?? 'sso-client';
export const SSO_PASSWORD = process.env.SSO_PASSWORD ?? 'SsoClient123!';
export const MOCK_SSO_ID_TOKEN = 'mock-sso-id-token';
