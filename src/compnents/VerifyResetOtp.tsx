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
  verifyResetOtpSchema,
  type VerifyResetOtpFormData,
} from "../validation/verifyResetOtpSchema";

function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

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
  } = useForm<VerifyResetOtpFormData>({
    resolver: yupResolver(verifyResetOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleVerifyOtp = async (data: VerifyResetOtpFormData) => {
    setIsLoading(true);

    try {
      const response = await authService.verifyResetOtp({
        email,
        otp: data.otp,
      });

      setToast({
        open: true,
        message:
          response.data.message ||
          response.message ||
          "OTP verified successfully",
        severity: "success",
      });

      navigate("/reset-password", {
        state: {
          email,
          otp: data.otp,
        },
      });
    } catch {
      setToast({
        open: true,
        message: "Invalid or expired OTP",
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
              <h1>Verify OTP</h1>

              <p>Enter the OTP sent to your registered email</p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit(handleVerifyOtp)}
            >
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="OTP"
                    placeholder="Enter OTP"
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
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
                {isLoading ? "Verifying..." : "Verify OTP"}
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

export default VerifyResetOtp;
