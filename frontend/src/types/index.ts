export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  visibility: 'private' | 'public';
  itemCount: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  collectionId: string;
  title: string;
  subtitle?: string;
  brand?: string;
  category?: string;
  purchasePrice?: number;
  estimatedValue?: number;
  purchaseDate?: string;
  condition?: ItemCondition;
  quantity: number;
  location?: string;
  images: ItemImage[];
  description?: string;
  customAttributes: Record<string, string>;
  notes?: string;
  tags: string[];
  barcode?: string;
  serialNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemCondition =
  | 'mint'
  | 'near_mint'
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor';

export interface ItemImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface WishlistItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  targetPrice?: number;
  priority: 'low' | 'medium' | 'high';
  url?: string;
  image?: string;
  createdAt: string;
}

export interface Statistics {
  totalCollections: number;
  totalItems: number;
  totalValue: number;
  totalInvested: number;
  profitLoss: number;
  mostValuableItem?: Item;
  newestItem?: Item;
  recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  type: 'item_added' | 'item_updated' | 'collection_created';
  description: string;
  timestamp: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
}
