import api from "../api/axios";

import type {
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from "../types/purchaseOrderTypes";

const purchaseOrderService = {
  getPurchaseOrders: async () => {
    const response = await api.get("/purchase-orders");

    return response.data;
  },

  getPurchaseOrder: async (id: string) => {
    const response = await api.get(`/purchase-orders/${id}`);

    return response.data;
  },

  createPurchaseOrder: async (data: CreatePurchaseOrderRequest) => {
    const response = await api.post("/purchase-orders", data);

    return response.data;
  },

  updatePurchaseOrder: async (id: string, data: UpdatePurchaseOrderRequest) => {
    const response = await api.patch(`/purchase-orders/${id}`, data);

    return response.data;
  },

  deletePurchaseOrder: async (id: string) => {
    const response = await api.delete(`/purchase-orders/${id}`);

    return response.data;
  },
};

export default purchaseOrderService;
