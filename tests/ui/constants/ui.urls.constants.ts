const UI_BASE_URL_ENV = 'UI_BASE_URL';

const uiBaseUrl = process.env[UI_BASE_URL_ENV] ?? 'http://localhost:8081';

export const LOGIN_URL = new URL('/login', uiBaseUrl).toString();
export const REGISTER_URL = new URL('/register', uiBaseUrl).toString();
export const HOME_URL = new URL('/', uiBaseUrl).toString();
