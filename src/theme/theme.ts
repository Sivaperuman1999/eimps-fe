import { createTheme } from "@mui/material/styles";
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565C0",
      dark: "#0B3A66",
      light: "#42A5F5",
    },
    secondary: {
      main: "#0F766E",
    },
    success: {
      main: "#2E7D32",
    },
    warning: {
      main: "#ED6C02",
    },
    error: {
      main: "#D32F2F",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: "#1565C0",
            "&:hover": {
              backgroundColor: "#0B3A66",
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)",
          borderRadius: "12px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0B3A66",
          color: "#FFFFFF",
          borderRight: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F9FAFB",
            borderBottom: "1px solid #E5E7EB",
            color: "#4B5563",
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F3F4F6",
          },
        },
      },
    } as any,
  },
});

export default theme;
