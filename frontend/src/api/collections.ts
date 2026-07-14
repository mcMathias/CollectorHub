import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api-client';

export interface CollectionType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
  fieldDefinitions: FieldDefinition[];
  _count?: { collections: number };
}

export interface FieldDefinition {
  id: string;
  name: string;
  slug: string;
  fieldType: string;
  description: string | null;
  isRequired: boolean;
  defaultValue: string | null;
  options: string[];
  sortOrder: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  visibility: 'PRIVATE' | 'PUBLIC';
  createdAt: string;
  updatedAt: string;
  collectionType: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  };
  _count: { items: number };
}

export function useCollectionTypes() {
  return useQuery({
    queryKey: ['collection-types'],
    queryFn: async (): Promise<CollectionType[]> => {
      const response = await apiClient.get('/collection-types');
      return response.data;
    },
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await apiClient.get('/collections');
      return response.data;
    },
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: async () => {
      const response = await apiClient.get(`/collections/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      collectionTypeId: string;
      description?: string;
      icon?: string;
      visibility?: 'PRIVATE' | 'PUBLIC';
    }) => {
      const response = await apiClient.post('/collections', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}
