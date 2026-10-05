import { Button, Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../App.css";
import banner from "../assets/eimpsBanner.png";

import Toast from "./Toast";
import Loader from "./Loader";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../validation/forgotPasswordSchema";
import authService from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

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
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({
        email: data.email as string,
      });

      setToast({
        open: true,
        message:
          response.data.message || response.message || "OTP sent successfully",
        severity: "success",
      });

      navigate("/verify-reset-otp", {
        state: {
          email: data.email,
        },
      });
    } catch {
      setToast({
        open: true,
        message: "Unable to send reset link",
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
              <h1> Forgot Password</h1>
              <p> Enter your registered email to reset your password</p>
            </div>
            <form
              className="login-form"
              onSubmit={handleSubmit(handleForgotPassword)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
