export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export enum Role {
  ROLE_CLIENT = 'ROLE_CLIENT',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
} 