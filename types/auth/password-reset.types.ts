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
