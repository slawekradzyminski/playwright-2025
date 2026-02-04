export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface TokenRefreshResponseDto {
  token: string;
  refreshToken: string;
}
