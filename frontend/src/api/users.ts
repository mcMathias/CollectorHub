import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api-client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    collections: number;
    wishlistItems: number;
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async (): Promise<UserProfile> => {
      const response = await apiClient.get('/users/me');
      return response.data;
    },
  });
}
