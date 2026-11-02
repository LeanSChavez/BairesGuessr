import axios from 'axios';
import type { User } from '../domain/user';

const API_URL = 'http://localhost:8080/api';

export interface LoginCredentials {
  emailOrUsername: string;
  passwordHash: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  passwordHash: string;
}

export const MOCK_USER: User = {
  id: 1,
  username: 'lean',
  email: 'lean@bairesguessr.com',
};

const MOCK_PASSWORD = '123';

export const userService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // LLAMADA REAL CON AXIOS:
    // const response = await axios.post<User>(`${API_URL}/auth/login`, credentials);
    // return response.data;

    // MOCK TEMPORAL CON VALIDACIÓN:
    console.log('Haciendo login mock con:', credentials);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulamos la verificación de credenciales
        if (credentials.passwordHash === MOCK_PASSWORD) {
          resolve(MOCK_USER);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 500);
    });
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    // LLAMADA REAL CON AXIOS:
    // const response = await axios.post<User>(`${API_URL}/auth/register`, credentials);
    // return response.data;

    console.log('Haciendo registro mock con:', credentials);
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER), 500);
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER), 300);
    });
  },
};