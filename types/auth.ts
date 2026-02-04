export interface LoginDto {
  username: string;
  password: string;
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: ('ROLE_ADMIN' | 'ROLE_CLIENT')[];
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

export interface LoginResponseDto {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
} 
