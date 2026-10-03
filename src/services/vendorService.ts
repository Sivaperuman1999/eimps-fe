import api from "../api/axios";

import type {
  CreateVendorRequest,
  UpdateVendorRequest,
} from "../types/vendorTypes";

const vendorService = {
  getVendors: async () => {
    const response = await api.get("/vendors");

    return response.data;
  },

  getVendor: async (id: string) => {
    const response = await api.get(`/vendors/${id}`);

    return response.data;
  },

  createVendor: async (data: CreateVendorRequest) => {
    const response = await api.post("/vendors", data);

    return response.data;
  },

  updateVendor: async (id: string, data: UpdateVendorRequest) => {
    const response = await api.patch(`/vendors/${id}`, data);

    return response.data;
  },

  deleteVendor: async (id: string) => {
    const response = await api.delete(`/vendors/${id}`);

    return response.data;
  },

  updateVendorStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/vendors/${id}/status`, {
      isActive,
    });

    return response.data;
  },
};

export default vendorService;
