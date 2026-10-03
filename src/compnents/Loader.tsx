import { Backdrop, CircularProgress } from "@mui/material";

interface LoaderProps {
  open: boolean;
}

function Loader({ open }: LoaderProps) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loader;
