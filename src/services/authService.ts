import api from "../api/axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
} from "../types/authTypes";

const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data,
    );

    return response.data;
  },

  verifyResetOtp: async (
    data: VerifyResetOtpRequest,
  ): Promise<VerifyResetOtpResponse> => {
    const response = await api.post<VerifyResetOtpResponse>(
      "/auth/verify-reset-otp",
      data,
    );

    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data,
    );

    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");

    return response.data;
  },
};

export default authService;
