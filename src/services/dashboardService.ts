import api from "../api/axios";

export interface DashboardData {
  inventory: {
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
    outOfStock: number;
    totalStock: number;
  };
  vendors: {
    total: number;
    active: number;
    inactive: number;
  };
  purchaseOrders: {
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    completed: number;
    cancelled: number;
    totalValue: number;
  };
  goodsReceipts: {
    total: number;
    draft: number;
    received: number;
    cancelled: number;
  };
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
  return response.data.data;
};
