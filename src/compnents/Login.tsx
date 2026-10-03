import { Button, Grid, TextField, Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
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
      const result = await login({
        email: data.email as string,
        password: data.password as string,
      });
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
    <Box sx={{ width: "100%", height: "100vh", overflow: "hidden", display: "flex" }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Navy Blue Banner Section */}
        <Grid 
          size={{ xs: 12, md: 5, lg: 4 }}
          sx={{
            backgroundColor: "#0B3A66",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            p: 6,
            color: "#FFFFFF"
          }}
        >
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessCenterIcon fontSize="large" sx={{ color: '#42A5F5' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              EIMPS
            </Typography>
          </Box>
          
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, fontSize: '2.5rem', lineHeight: 1.2 }}>
            Manage Inventory. <br /> Streamline Purchases.
          </Typography>
          
          <Typography variant="body1" sx={{ color: "#94A3B8", fontSize: '1.1rem', mb: 6, maxWidth: 400 }}>
            A complete solution to manage your inventory, vendors, purchase orders and receipts efficiently.
          </Typography>
          
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={banner} 
              alt="EIPMS Illustration" 
              style={{ width: '100%', maxWidth: '400px', objectFit: 'contain' }} 
            />
          </Box>
        </Grid>

        {/* Right Form Section */}
        <Grid 
          size={{ xs: 12, md: 7, lg: 8 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5F7FA"
          }}
        >
          <Box 
            sx={{
              width: "100%",
              maxWidth: 480,
              p: { xs: 4, md: 6 },
              backgroundColor: "#FFFFFF",
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: "#6B7280" }}>
                Sign in to your EIPMS account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(handleLogin)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    placeholder="admin@example.com"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{ input: { sx: { borderRadius: 2 } } }}
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
                    slotProps={{ input: { sx: { borderRadius: 2 } } }}
                  />
                )}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: -1 }}>
                <FormControlLabel 
                  control={<Checkbox size="small" color="primary" />} 
                  label={<Typography variant="body2" sx={{ color: "#4B5563" }}>Remember me</Typography>}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#1565C0", cursor: "pointer", fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading}
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Login
              </Button>
            </form>
          </Box>
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
    </Box>
  );
}

export default Login;
