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

export interface LoginResponseWithRefreshToken extends LoginResponseDto {
  refreshToken: string;
}

export interface SsoExchangeDto {
  idToken: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
} 
