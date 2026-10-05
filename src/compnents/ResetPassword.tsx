import { Button, Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../App.css";
import banner from "../assets/eimpsBanner.png";

import Toast from "./Toast";
import Loader from "./Loader";

import authService from "../services/authService";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../validation/resetPasswordSchema";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
      });

      setToast({
        open: true,
        message:
          response.data.message ||
          response.message ||
          "Password reset successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      setToast({
        open: true,
        message: "Unable to reset password",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Grid container className="main-grid">
        <Grid size={{ xs: 8 }} className="banner-section">
          <img src={banner} alt="EIPMS Banner" className="banner" />
        </Grid>

        <Grid size={{ xs: 4 }} className="login-section">
          <div className="login-container">
            <div className="login-header">
              <h1>Reset Password</h1>
              <p> Enter your new password </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit(handleResetPassword)}
            >
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                className="login-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <div className="login-options">
                <span
                  className="forgot-password"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </span>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <Loader open={isLoading} />
    </div>
  );
}

export default ResetPassword;
