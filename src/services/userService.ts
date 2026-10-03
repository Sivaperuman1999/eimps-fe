import api from "../api/axios";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../types/userTypes";

interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

const userService = {
  getUsers: async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>("/users");

    return response.data;
  },

  createUser: async (data: CreateUserRequest) => {
    const response = await api.post<UserResponse>("/users", data);

    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    const response = await api.patch<UserResponse>(`/users/${id}`, data);

    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<UserResponse>(`/users/${id}`);

    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch<UserResponse>(`/users/${id}/status`, {
      isActive,
    });

    return response.data;
  },
};

export default userService;
