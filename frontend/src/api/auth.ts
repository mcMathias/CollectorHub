import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/api-client';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar: string | null;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async (refreshToken: string): Promise<void> => {
      await apiClient.post('/auth/logout', { refreshToken });
    },
  });
}
