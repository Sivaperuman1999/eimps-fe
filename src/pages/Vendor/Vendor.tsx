import { useEffect, useState } from "react";

import { Button, Grid, Paper, Typography } from "@mui/material";

import VendorColumn from "./VendorColumn";
import VendorCreation from "./VendorCreation";

import vendorService from "../../services/vendorService";

import type { Vendor as VendorType } from "../../types/vendorTypes";

import { getApiErrorMessage } from "../../utils/apiError";

import Toast from "../../compnents/Toast";
import Loader from "../../compnents/Loader";

function Vendor() {
  const [vendors, setVendors] = useState<VendorType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const getVendors = async () => {
    setIsLoading(true);

    try {
      const response = await vendorService.getVendors();

      setVendors(response.data);
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to load vendors"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const handleCreate = () => {
    setSelectedVendor(null);

    setOpenCreate(true);
  };

  const handleEdit = (vendor: VendorType) => {
    setSelectedVendor(vendor);

    setOpenCreate(true);
  };

  const handleDelete = async (vendor: VendorType) => {
    setIsLoading(true);

    try {
      const response = await vendorService.deleteVendor(String(vendor.id));

      setToast({
        open: true,

        message: response?.message || "Vendor deleted successfully",

        severity: "success",
      });

      await getVendors();
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to delete vendor"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (vendor: VendorType, isActive: boolean) => {
    setIsLoading(true);

    try {
      const response = await vendorService.updateVendorStatus(
        String(vendor.id),
        isActive,
      );

      setToast({
        open: true,

        message:
          response?.message ||
          (isActive
            ? "Vendor activated successfully"
            : "Vendor deactivated successfully"),

        severity: "success",
      });

      await getVendors();
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to update vendor status"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);

    setSelectedVendor(null);
  };

  const handleSaved = async (message: string) => {
    setOpenCreate(false);

    setSelectedVendor(null);

    setToast({
      open: true,
      message,
      severity: "success",
    });

    await getVendors();
  };

  const handleError = (message: string) => {
    setToast({
      open: true,
      message,
      severity: "error",
    });
  };

  return (
    <>
      <Grid container>
        <Grid size={10}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
            }}
          >
            Vendor Management
          </Typography>
        </Grid>

        <Grid
          size={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" onClick={handleCreate}>
            + Add Vendor
          </Button>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 2,
        }}
      >
        <VendorColumn
          vendors={vendors}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      <VendorCreation
        open={openCreate}
        onClose={handleClose}
        vendor={selectedVendor}
        onSaved={handleSaved}
        onError={handleError}
      />

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
    </>
  );
}

export default Vendor;
