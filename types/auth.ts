export interface LoginDto {
  username: string;
  password: string;
}

export interface SignupDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}


export interface UserEditDto {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface ChatSystemPromptDto {
  chatSystemPrompt: string;
}

export interface ToolSystemPromptDto {
  toolSystemPrompt: string;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
} 
