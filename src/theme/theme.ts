import { type ThemeOptions } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import type {} from '@mui/x-data-grid/themeAugmentation';

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: "#1565C0", dark: "#0B3A66", light: "#42A5F5" },
          secondary: { main: "#0F766E" },
          success: { main: "#2E7D32" },
          warning: { main: "#ED6C02" },
          error: { main: "#D32F2F" },
          background: { default: "#F5F7FA", paper: "#FFFFFF" },
          text: { primary: "#1F2937", secondary: "#4B5563" },
        }
      : {
          primary: { main: "#42A5F5", dark: "#1565C0", light: "#64B5F6" },
          secondary: { main: "#14B8A6" },
          success: { main: "#4CAF50" },
          warning: { main: "#FF9800" },
          error: { main: "#F44336" },
          background: { default: "#111827", paper: "#1F2937" },
          text: { primary: "#F9FAFB", secondary: "#D1D5DB" },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: mode === 'light' ? "#1565C0" : "#42A5F5",
            color: mode === 'light' ? "#FFFFFF" : "#000000",
            "&:hover": { backgroundColor: mode === 'light' ? "#0B3A66" : "#1565C0" },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)" 
            : "0px 1px 3px rgba(0, 0, 0, 0.5)",
          borderRadius: "12px",
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)" 
            : "0px 1px 3px rgba(0, 0, 0, 0.5)",
          borderRadius: "12px",
          border: mode === 'light' ? "1px solid #E5E7EB" : "1px solid #374151",
          backgroundImage: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? "#0B3A66" : "#111827",
          color: "#FFFFFF",
          borderRight: mode === 'light' ? "none" : "1px solid #374151",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? "#FFFFFF" : "#1F2937",
          color: mode === 'light' ? "#1F2937" : "#F9FAFB",
          boxShadow: mode === 'light' ? "0px 1px 3px rgba(0, 0, 0, 0.05)" : "0px 1px 3px rgba(0, 0, 0, 0.5)",
          backgroundImage: "none",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-cell:focus": { outline: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: mode === 'light' ? "#F9FAFB" : "#374151",
            borderBottom: mode === 'light' ? "1px solid #E5E7EB" : "1px solid #4B5563",
            color: mode === 'light' ? "#4B5563" : "#D1D5DB",
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: mode === 'light' ? "#F3F4F6" : "#374151",
          },
        },
      },
    },
  },
});
