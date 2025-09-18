export interface UserResponseDto {
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
