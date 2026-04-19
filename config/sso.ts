export const SSO_CALLBACK_PATH = '/auth/sso/callback';
export const SSO_AUTHORITY = process.env.SSO_AUTHORITY ?? 'http://localhost:8082/realms/awesome-testing';
export const SSO_BACKEND_BASE_URL = process.env.SSO_BACKEND_BASE_URL ?? process.env.API_BASE_URL ?? process.env.APP_BASE_URL ?? 'http://localhost:8081';
export const SSO_CLIENT_ID = process.env.SSO_CLIENT_ID ?? 'awesome-testing-frontend';
export const SSO_USERNAME = process.env.SSO_USERNAME ?? 'sso-client';
export const SSO_PASSWORD = process.env.SSO_PASSWORD ?? 'SsoClient123!';
export const MOCK_SSO_ID_TOKEN = 'mock-sso-id-token';

export const GOOGLE_MOCK_AUTHORITY = process.env.GOOGLE_MOCK_AUTHORITY ?? 'http://localhost:8082/realms/google-mock';
export const GOOGLE_MOCK_USERNAME = process.env.GOOGLE_MOCK_USERNAME ?? 'google-user';
export const GOOGLE_MOCK_PASSWORD = process.env.GOOGLE_MOCK_PASSWORD ?? 'GoogleUser123!';

export const GITHUB_MOCK_AUTHORITY = process.env.GITHUB_MOCK_AUTHORITY ?? 'http://localhost:8082/realms/github-mock';
export const GITHUB_MOCK_USERNAME = process.env.GITHUB_MOCK_USERNAME ?? 'github-user';
export const GITHUB_MOCK_PASSWORD = process.env.GITHUB_MOCK_PASSWORD ?? 'GitHubUser123!';

export const MOCK_BROKER_CLIENT_ID = process.env.MOCK_BROKER_CLIENT_ID ?? 'keycloak-broker';
export const MOCK_BROKER_CLIENT_SECRET = process.env.MOCK_BROKER_CLIENT_SECRET ?? 'keycloak-broker-secret';
