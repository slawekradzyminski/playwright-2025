export interface LoginDto {
  username: string;
  password: string;
}

export type UserRole = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
  firstName: string;
  lastName: string;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface TokenRefreshResponseDto {
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordRequestDto {
  identifier: string;
  resetBaseUrl?: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
  token?: string;
}

export interface ResetPasswordRequestDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
