// src/services/userService.ts
import axios from 'axios';
import type { LoginRequest, RegistroRequest, LoginResponse } from '../domain/auth';

const API_URL = 'http://localhost:8080/api/auth';

export const userService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (credentials: RegistroRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/register`, credentials);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): LoginResponse | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },


 // getRanking: async (): Promise<RankingUser[]> => {
 //   const response = await axios.get(`${API_URL}/partidas/ranking`);
  //  return response.data;
//} para el maximo puntaje 

//export interface RankingUser {
 // id: number;
 // username: string;
  //maxPuntos: number;
//} dto para el max puntaje
};