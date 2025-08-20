export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
  firstName: string;
  lastName: string;
}

export type UserRole = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export interface ValidationErrorResponse {
  [field: string]: string;
}

export interface SystemPromptDto {
  systemPrompt: string;
}

