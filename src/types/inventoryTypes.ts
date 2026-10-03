export interface Inventory {
  id: number;
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  price: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryRequest {
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  price: number;
}

export interface UpdateInventoryRequest {
  name?: string;
  sku?: string;
  categoryId?: string;
  quantity?: number;
  price?: number;
}