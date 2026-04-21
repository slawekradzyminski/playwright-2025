import { randomUUID } from 'node:crypto';

export function trafficSessionId(label: string): string {
  const sanitizedLabel = label
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  return `pw-${Date.now()}-${sanitizedLabel}-${randomUUID()}`;
}

export function invalidSigninPayload(username = `wronguser-${randomUUID()}`): Record<string, string> {
  return {
    username,
    password: 'wrongpassword'
  };
}

export function invalidSignupPayload(): Record<string, string> {
  return {
    username: 'abc',
    email: 'not-an-email',
    password: 'short',
    firstName: 'Traffic',
    lastName: 'Probe'
  };
}
