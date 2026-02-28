export interface LoginDto {
  username: string;
  password: string;
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
