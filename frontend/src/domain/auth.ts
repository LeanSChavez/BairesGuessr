
export interface LoginRequest {
  usernameOrEmail: string;
  passwordHash: string;
}

export interface RegistroRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  idUsuario: number;
  username: string;
  email: string;
  token?: string;
}