import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api-client';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ItemTag {
  tag: {
    id: string;
    name: string;
    color: string | null;
  };
}

export interface Item {
  id: string;
  title: string;
  subtitle: string | null;
  brand: string | null;
  purchasePrice: string | null;
  estimatedValue: string | null;
  purchaseCurrencyCode: string;
  estimatedCurrencyCode: string;
  purchaseCurrency: Currency;
  estimatedCurrency: Currency;
  purchaseDate: string | null;
  condition: string | null;
  quantity: number;
  ownership: string;
  description: string | null;
  notes: string | null;
  barcode: string | null;
  serialNumber: string | null;
  categoryId: string | null;
  locationId: string | null;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string; isPrimary: boolean }[];
  tags: ItemTag[];
  category: { id: string; name: string } | null;
  location: { id: string; name: string } | null;
  _count?: { images: number };
}

export interface ItemsResponse {
  data: Item[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ItemQueryParams {
  search?: string;
  condition?: string;
  ownership?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateItemInput {
  title: string;
  collectionId: string;
  subtitle?: string;
  brand?: string;
  purchasePrice?: number;
  purchaseCurrencyCode?: string;
  estimatedValue?: number;
  estimatedCurrencyCode?: string;
  purchaseDate?: string;
  condition?: string;
  quantity?: number;
  ownership?: string;
  description?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateItemInput {
  title?: string;
  subtitle?: string;
  brand?: string;
  purchasePrice?: number;
  purchaseCurrencyCode?: string;
  estimatedValue?: number;
  estimatedCurrencyCode?: string;
  purchaseDate?: string;
  condition?: string;
  quantity?: number;
  ownership?: string;
  description?: string;
  notes?: string;
  tags?: string[];
}

export function useItems(collectionId: string, params?: ItemQueryParams) {
  return useQuery({
    queryKey: ['items', collectionId, params],
    queryFn: async (): Promise<ItemsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.condition) searchParams.set('condition', params.condition);
      if (params?.ownership) searchParams.set('ownership', params.ownership);
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      const qs = searchParams.toString();
      const response = await apiClient.get(`/items/collection/${collectionId}${qs ? `?${qs}` : ''}`);
      return response.data;
    },
    enabled: !!collectionId,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['items', 'detail', id],
    queryFn: async (): Promise<Item> => {
      const response = await apiClient.get(`/items/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateItemInput) => {
      const response = await apiClient.post('/items', data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items', variables.collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateItem(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItemInput }) => {
      const response = await apiClient.patch(`/items/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useDeleteItem(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}
