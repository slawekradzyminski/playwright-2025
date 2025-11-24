import type { UserRegisterDto } from './auth';

export interface AuthFixture {
  token: string;
  userData: UserRegisterDto;
}

