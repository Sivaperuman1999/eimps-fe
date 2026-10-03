import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";


import vendorService from "../../services/vendorService";

import type {
  CreateVendorRequest,
  UpdateVendorRequest,
  Vendor,
} from "../../types/vendorTypes";

import {
  vendorSchema,
  type VendorFormData,
} from "../../validation/vendorSchema";

import { getApiErrorMessage } from "../../utils/apiError";

interface VendorCreationProps {
  open: boolean;

  onClose: () => void;

  vendor?: Vendor | null;

  onSaved: (message: string) => void;

  onError?: (message: string) => void;
}

function VendorCreation({
  open,
  onClose,
  vendor,
  onSaved,
  onError,
}: VendorCreationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<VendorFormData>({
    resolver: yupResolver(vendorSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (vendor) {
      reset({
        name: vendor.name ?? "",
        email: vendor.email ?? "",
        phone: vendor.phone ?? "",
        address: vendor.address ?? "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [vendor, open, reset]);

  const handleSave = async (data: VendorFormData) => {
    setIsLoading(true);

    try {
      let response;

      if (vendor) {
        const updateData: UpdateVendorRequest = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        };

        response = await vendorService.updateVendor(
          String(vendor.id),
          updateData,
        );
      } else {
        const createData: CreateVendorRequest = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        };

        response = await vendorService.createVendor(createData);
      }

      onSaved(
        response?.message ||
          (vendor
            ? "Vendor updated successfully"
            : "Vendor created successfully"),
      );

      onClose();
    } catch (error: unknown) {
      const message = getApiErrorMessage(
        error,
        vendor ? "Unable to update vendor" : "Unable to create vendor",
      );

      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{vendor ? "Edit Vendor" : "Create Vendor"}</DialogTitle>

      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}

            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Vendor Name"
                placeholder="Enter vendor name"
                margin="normal"

                error={!!fieldState.error}

                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}

            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                placeholder="Enter email"
                margin="normal"

                error={!!fieldState.error}

                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}

            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone"
                placeholder="Enter phone number"
                margin="normal"

                error={!!fieldState.error}

                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="address"
            control={control}

            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={3}
                label="Address"
                placeholder="Enter vendor address"
                margin="normal"

                error={!!fieldState.error}

                helperText={fieldState.error?.message}
              />
            )}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : vendor
                ? "Update Vendor"
                : "Create Vendor"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default VendorCreation;
