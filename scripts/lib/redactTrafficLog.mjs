const REDACTED = '[REDACTED]';
const MAX_STRING_LENGTH = 500;

const sensitiveKeyPatterns = [
  'authorization',
  'cookie',
  'set-cookie',
  'token',
  'access_token',
  'refresh_token',
  'id_token',
  'password',
  'secret',
  'api_key',
  'apikey',
  'key',
  'credential',
  'session'
];

export function redactTrafficLog(value, options = {}) {
  const { unsafeShowSecrets = false, maxStringLength = MAX_STRING_LENGTH } = options;

  if (unsafeShowSecrets) {
    return truncateLongStrings(value, maxStringLength);
  }

  return redactValue(value, undefined, maxStringLength);
}

export function isSensitiveKey(key) {
  const normalizedKey = String(key).toLowerCase();

  return sensitiveKeyPatterns.some(pattern => normalizedKey.includes(pattern));
}

function redactValue(value, key, maxStringLength) {
  if (key !== undefined && isSensitiveKey(key)) {
    return REDACTED;
  }

  if (Array.isArray(value)) {
    return value.map(item => redactValue(item, undefined, maxStringLength));
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        redactValue(entryValue, entryKey, maxStringLength)
      ])
    );
  }

  if (typeof value === 'string') {
    return truncateString(value, maxStringLength);
  }

  return value;
}

function truncateLongStrings(value, maxStringLength) {
  if (Array.isArray(value)) {
    return value.map(item => truncateLongStrings(item, maxStringLength));
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, truncateLongStrings(entryValue, maxStringLength)])
    );
  }

  if (typeof value === 'string') {
    return truncateString(value, maxStringLength);
  }

  return value;
}

function truncateString(value, maxStringLength) {
  if (value.length <= maxStringLength) {
    return value;
  }

  return `${value.slice(0, maxStringLength)}...[truncated ${value.length - maxStringLength} chars]`;
}
