import { create } from "zustand";
import axios from "axios";

import authService from "../services/authService";

import type { LoginRequest, User } from "../types/authTypes";

interface LoginResult {
  success: boolean;
  message: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  error: string | null;

  login: (data: LoginRequest) => Promise<LoginResult>;

  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("authUser");

    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),

  accessToken: localStorage.getItem("accessToken"),

  error: null,

  login: async (data) => {
    try {
      const response = await authService.login(data);

      const loginData = response.data;

      localStorage.setItem("accessToken", loginData.access_token);

      localStorage.setItem("authUser", JSON.stringify(loginData.user));

      set({
        user: loginData.user,

        accessToken: loginData.access_token,

        error: null,
      });

      return {
        success: true,

        message: loginData.message || "Login successful",
      };
    } catch (error: unknown) {
      let message = "Login failed";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Login failed";
      }

      set({
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("authUser");

    set({
      user: null,
      accessToken: null,
      error: null,
    });
  },
}));
