export type EmailTemplate = 'GENERIC' | 'PASSWORD_RESET_REQUESTED' | 'PASSWORD_RESET_CONFIRMED';
export type EmailDeliveryStatus = 'QUEUED' | 'SENT_TO_SMTP_SINK' | 'FAILED';

export interface EmailEventDto {
  type: EmailTemplate;
  status: EmailDeliveryStatus;
  recipientMasked: string;
  createdAt: string;
  updatedAt: string;
  failureReason?: string | null;
}

export interface EmailDto {
  to: string;
  subject: string;
  body: string;
}

export interface StoredEmail {
  timestamp: string;
  destination: string;
  payload: EmailDto;
}
