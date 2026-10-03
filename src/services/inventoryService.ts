import api from "../api/axios";

import type {
  CreateInventoryRequest,
  Inventory,
  UpdateInventoryRequest,
} from "../types/inventoryTypes";

interface InventoryResponse {
  success: boolean;
  message: string;
  data: Inventory[];
}

interface SingleInventoryResponse {
  success: boolean;
  message: string;
  data: Inventory;
}

interface DeleteInventoryResponse {
  success: boolean;
  message: string;
  data?: Inventory;
}

type ApiInventory = Omit<Inventory, "price"> & {
  unitPrice: string | number;
};

const mapInventory = (item: ApiInventory): Inventory => ({
  ...item,
  price: Number(item.unitPrice),
});

const inventoryService = {
  // GET ALL INVENTORY
  getInventory: async (): Promise<InventoryResponse> => {
    const response =
      await api.get<{
        success: boolean;
        message: string;
        data: ApiInventory[];
      }>("/items");

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data.map(mapInventory),
    };
  },

  // GET INVENTORY BY ID
  getInventoryById: async (
    id: string,
  ): Promise<SingleInventoryResponse> => {
    const response =
      await api.get<{
        success: boolean;
        message: string;
        data: ApiInventory;
      }>(`/items/${id}`);

    return {
      success: response.data.success,
      message: response.data.message,
      data: mapInventory(response.data.data),
    };
  },

  // CREATE
  createInventory: async (
    data: CreateInventoryRequest,
  ): Promise<SingleInventoryResponse> => {
    const response =
      await api.post<{
        success: boolean;
        message: string;
        data: ApiInventory;
      }>("/items", {
        name: data.name,
        sku: data.sku,
        categoryId: data.categoryId,
        quantity: data.quantity,
        unitPrice: data.price,
      });

    return {
      success: response.data.success,
      message: response.data.message,
      data: mapInventory(response.data.data),
    };
  },

  // UPDATE
  updateInventory: async (
    id: string,
    data: UpdateInventoryRequest,
  ): Promise<SingleInventoryResponse> => {
    const response =
      await api.patch<{
        success: boolean;
        message: string;
        data: ApiInventory;
      }>(`/items/${id}`, {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.sku !== undefined && {
          sku: data.sku,
        }),

        ...(data.categoryId !== undefined && {
          categoryId: data.categoryId,
        }),

        ...(data.quantity !== undefined && {
          quantity: data.quantity,
        }),

        ...(data.price !== undefined && {
          unitPrice: data.price,
        }),
      });

    return {
      success: response.data.success,
      message: response.data.message,
      data: mapInventory(response.data.data),
    };
  },

  deleteInventory: async (
    id: string,
  ): Promise<DeleteInventoryResponse> => {
    const response =
      await api.delete<DeleteInventoryResponse>(
        `/items/${id}`,
      );

    return response.data;
  },

  // UPDATE STATUS
  updateInventoryStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<SingleInventoryResponse> => {
    const response =
      await api.patch<{
        success: boolean;
        message: string;
        data: ApiInventory;
      }>(`/items/${id}/status`, {
        isActive,
      });

    return {
      success: response.data.success,
      message: response.data.message,
      data: mapInventory(response.data.data),
    };
  },
};

export default inventoryService;