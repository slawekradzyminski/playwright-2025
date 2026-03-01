const UI_BASE_URL_ENV = 'UI_BASE_URL';

const uiBaseUrl = process.env[UI_BASE_URL_ENV] ?? 'http://localhost:8081';

export const LOGIN_URL = new URL('/login', uiBaseUrl).toString();
export const REGISTER_URL = new URL('/register', uiBaseUrl).toString();
export const FORGOT_PASSWORD_URL = new URL('/forgot-password', uiBaseUrl).toString();
export const RESET_URL = new URL('/reset', uiBaseUrl).toString();
export const HOME_URL = new URL('/', uiBaseUrl).toString();
export const PRODUCTS_URL = new URL('/products', uiBaseUrl).toString();
export const PROFILE_URL = new URL('/profile', uiBaseUrl).toString();
