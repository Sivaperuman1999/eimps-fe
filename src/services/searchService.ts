import api from "../api/axios";
import type { Inventory } from "../types/inventoryTypes";
import type { Vendor } from "../types/vendorTypes";
import type { PurchaseOrder } from "../types/purchaseOrderTypes";

export interface SearchResults {
  inventory: Inventory[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
}

export const searchGlobal = async (query: string): Promise<SearchResults> => {
  const response = await api.get<{ success: boolean; data: SearchResults }>(`/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};
