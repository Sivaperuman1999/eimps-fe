import { Button, Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import banner from "../assets/eimpsBanner.png";
import { useAuthStore } from "../store/authStore";
import { loginSchema, type LoginFormData } from "../validation/loginSchema";

import Toast from "./Toast";
import Loader from "./Loader";

function Login() {
  const login = useAuthStore((state) => state.login);
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
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await login(data);

      setToast({
        open: true,
        message: result.message,
        severity: result.success ? "success" : "error",
      });

      if (result.success) {
        navigate("/dashboard");
      }
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
              <h1>Welcome Back</h1>

              <p>Sign in to your EIPMS account</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
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

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />

              <div className="login-options">
                <span
                  className="forgot-password"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </span>
              </div>

              <Button
                fullWidth
                variant="contained"
                size="large"
                className="login-button"
                type="submit"
                disabled={isLoading}
              >
                Login
              </Button>
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

export default Login;
