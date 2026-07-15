import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api-client';

export interface ItemImage {
  id: string;
  url: string;
  key: string;
  isPrimary: boolean;
  sortOrder: number;
  label: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  mimeType: string | null;
  hash: string | null;
  itemId: string;
  createdAt: string;
}

export interface UpdateImageInput {
  label?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export function useItemImages(itemId: string) {
  return useQuery({
    queryKey: ['item-images', itemId],
    queryFn: async (): Promise<ItemImage[]> => {
      const response = await apiClient.get(`/items/${itemId}/images`);
      return response.data;
    },
    enabled: !!itemId,
  });
}

export function useUploadImages(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      const response = await apiClient.post(`/items/${itemId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-images', itemId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateImage(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId, data }: { imageId: string; data: UpdateImageInput }) => {
      const response = await apiClient.patch(`/items/${itemId}/images/${imageId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-images', itemId] });
    },
  });
}

export function useDeleteImage(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId: string) => {
      await apiClient.delete(`/items/${itemId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-images', itemId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
