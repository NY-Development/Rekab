import { User } from '../../../types';

export interface LoginResponseDto {
  token: string;
  user: User;
}

export interface SignupResponseDto {
  token: string;
  user: User;
}
