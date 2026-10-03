import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import metadataService from "../../services/metadataService";
import inventoryService from "../../services/inventoryService";

import type {
  Inventory,
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from "../../types/inventoryTypes";

import {
  inventorySchema,
  type InventoryFormData,
} from "../../validation/inventorySchema";

import { getApiErrorMessage } from "../../utils/apiError";

interface InventoryCreationProps {
  open: boolean;
  onClose: () => void;
  inventory?: Inventory | null;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
}

interface Category {
  id: string;
  name: string;
}

function InventoryCreation({
  open,
  onClose,
  inventory,
  onSaved,
  onError,
}: InventoryCreationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState(false);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<InventoryFormData>({
    resolver: yupResolver(inventorySchema),

    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      quantity: 0,
      price: 0,
    },
  });

  // Load categories
  useEffect(() => {
    if (!open) {
      return;
    }

    const loadMetadata = async () => {
      setIsCategoriesLoading(true);

      try {
        const response =
          await metadataService.getMetadata();

        setCategories(
          (response.data?.data.categories || []).map((c) => ({
            id: String(c.id),
            name: c.name,
          })),
        );
      } catch (error: unknown) {
        onError(
          getApiErrorMessage(
            error,
            "Unable to load categories",
          ),
        );
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    loadMetadata();
  }, [open, onError]);

  // Set form values
  useEffect(() => {
    if (inventory) {
      reset({
        name: inventory.name ?? "",
        sku: inventory.sku ?? "",
        categoryId: inventory.categoryId ?? "",
        quantity: inventory.quantity ?? 0,
        price: inventory.price ?? 0,
      });
    } else {
      reset({
        name: "",
        sku: "",
        categoryId: "",
        quantity: 0,
        price: 0,
      });
    }
  }, [inventory, open, reset]);

  const handleSave = async (
    data: InventoryFormData,
  ) => {
    setIsLoading(true);

    try {
      if (inventory) {
        const updateData: UpdateInventoryRequest = {
          name: data.name,
          sku: data.sku,
          categoryId: data.categoryId,
          quantity: data.quantity,
          price: data.price,
        };

        const response =
          await inventoryService.updateInventory(
            String(inventory.id),
            updateData,
          );

        onSaved(
          response.message ||
          "Inventory updated successfully",
        );
      } else {
        const createData: CreateInventoryRequest = {
          name: data.name,
          sku: data.sku,
          categoryId: data.categoryId,
          quantity: data.quantity,
          price: data.price,
        };

        const response =
          await inventoryService.createInventory(
            createData,
          );

        onSaved(
          response.message ||
          "Inventory created successfully",
        );
      }

      onClose();
    } catch (error: unknown) {
      onError(
        getApiErrorMessage(
          error,
          inventory
            ? "Unable to update inventory"
            : "Unable to create inventory",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {inventory
          ? "Edit Inventory"
          : "Create Inventory"}
      </DialogTitle>

      <form
        onSubmit={handleSubmit(handleSave)}
      >
        <DialogContent>

          {/* NAME */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Inventory Name"
                placeholder="Enter inventory name"
                margin="normal"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message
                }
              />
            )}
          />

          {/* SKU */}
          <Controller
            name="sku"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="SKU"
                placeholder="Enter SKU"
                margin="normal"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message
                }
              />
            )}
          />

          {/* CATEGORY */}
          <Controller
            name="categoryId"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                disabled={isCategoriesLoading}
              >
                <InputLabel id="category-label">
                  Category
                </InputLabel>

                <Select
                  {...field}
                  labelId="category-label"
                  label="Category"
                  value={
                    field.value === "0"
                      ? ""
                      : field.value
                  }
                  onChange={(event) => {
                    field.onChange(
                      event.target.value
                    );
                  }}
                >
                  <MenuItem value="">
                    {isCategoriesLoading
                      ? "Loading categories..."
                      : "Select Category"}
                  </MenuItem>

                  {categories.map((category) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

                {fieldState.error && (
                  <FormHelperText>
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* QUANTITY */}
          <Controller
            name="quantity"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Quantity"
                placeholder="Enter quantity"
                margin="normal"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message
                }
                onChange={(event) => {
                  field.onChange(
                    Number(event.target.value),
                  );
                }}
              />
            )}
          />

          {/* PRICE */}
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Price"
                placeholder="Enter unit price"
                margin="normal"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message
                }
                onChange={(event) => {
                  field.onChange(
                    Number(event.target.value),
                  );
                }}
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
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              isLoading ||
              isCategoriesLoading
            }
          >
            {isLoading
              ? "Saving..."
              : inventory
                ? "Update Inventory"
                : "Create Inventory"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default InventoryCreation;