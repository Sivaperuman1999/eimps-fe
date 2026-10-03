import { Alert, Snackbar } from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

function Toast({ open, message, severity, onClose }: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
