export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

export interface UserEditDto {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserEntityDto extends UserResponseDto {
  systemPrompt?: string | null;
}

export interface SystemPromptDto {
  systemPrompt: string | null;
}
