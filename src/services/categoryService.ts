import api from "../api/axios";

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categoryTypes";

const categoryService = {
  getCategories: async () => {
    const response = await api.get("/categories");

    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest) => {
    const response = await api.post("/categories", data);

    return response.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryRequest) => {
    const response = await api.patch(`/categories/${id}`, data);

    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);

    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/categories/${id}/status`, {
      isActive,
    });

    return response.data;
  },
};

export default categoryService;
