import api from "../api/axios";

import type {
  CreateGoodsReceiptRequest,
  GoodsReceipt,
  GoodsReceiptListResponse,
  UpdateGoodsReceiptRequest,
} from "../types/goodsReceiptTypes";

const goodsReceiptService = {
  getGoodsReceipts: async () => {
    return await api.get<{
      success: boolean;
      data: GoodsReceiptListResponse;
    }>("/goods-receipt");
  },

  getGoodsReceipt: async (id: string): Promise<GoodsReceipt> => {
    const response = await api.get<GoodsReceipt>(`/goods-receipt/${id}`);

    return response.data;
  },

  createGoodsReceipt: async (data: CreateGoodsReceiptRequest) => {
    const response = await api.post("/goods-receipt", data);

    return response.data;
  },

  updateGoodsReceipt: async (id: string, data: UpdateGoodsReceiptRequest) => {
    const response = await api.patch(`/goods-receipt/${id}`, data);

    return response.data;
  },

  deleteGoodsReceipt: async (id: string) => {
    const response = await api.delete(`/goods-receipt/${id}`);
    return response.data;
  },

  submitGoodsReceipt: async (id: string) => {
    const response = await api.patch(`/goods-receipt/${id}/submit`);
    return response.data;
  },

  approveGoodsReceipt: async (id: string) => {
    const response = await api.patch(`/goods-receipt/${id}/approve`);
    return response.data;
  },

  rejectGoodsReceipt: async (id: string, rejectionReason: string) => {
    const response = await api.patch(`/goods-receipt/${id}/reject`, { rejectionReason });
    return response.data;
  },
};

export default goodsReceiptService;
