/**
 * @aegisBlueprint feat-user-auth
 * @aegisFrameworkVersion 2.4.0
 * @mode strict
 * @intent Generated for evaluation: eval-feat-user-auth
 */


export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}
