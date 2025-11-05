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

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface UserEditDto {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserEntity extends UserResponseDto {
  systemPrompt?: string;
}

export interface SystemPromptDto {
  systemPrompt: string | null;
}
