export interface StoredEmail {
  timestamp: string;
  destination: string;
  payload: Record<string, unknown>;
}

export type EmailTemplate =
  | 'GENERIC'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_CONFIRMED';

export interface EmailDto {
  to?: string;
  subject: string;
  message: string;
  template?: EmailTemplate;
  properties?: Record<string, string>;
}
