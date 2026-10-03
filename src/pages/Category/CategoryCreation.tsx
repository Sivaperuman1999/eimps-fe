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

import categoryService from "../../services/categoryService";

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../types/categoryTypes";

import {
  categorySchema,
  type CategoryFormData,
} from "../../validation/categorySchema";

import { getApiErrorMessage } from "../../utils/apiError";

interface CategoryCreationProps {
  open: boolean;

  onClose: () => void;

  category?: Category | null;

  onSaved: (message: string) => void;

  onError: (message: string) => void;
}

function CategoryCreation({
  open,
  onClose,
  category,
  onSaved,
  onError,
}: CategoryCreationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),

    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name ?? "",

        description: category.description ?? "",

        status: category.status ?? "ACTIVE",
      });
    } else {
      reset({
        name: "",
        description: "",
        status: "ACTIVE",
      });
    }
  }, [category, open, reset]);

  const handleSave = async (data: CategoryFormData) => {
    setIsLoading(true);

    try {
      let response;

      if (category) {
        const updateData: UpdateCategoryRequest = {
          name: data.name,
          description: data.description || "",
        };

        response = await categoryService.updateCategory(
          String(category.id),
          updateData,
        );
      } else {
        const createData: CreateCategoryRequest = {
          name: data.name,
          description: data.description || "",
        };

        response = await categoryService.createCategory(createData);
      }

      onSaved(
        response?.message ||
          (category
            ? "Category updated successfully"
            : "Category created successfully"),
      );

      onClose();
    } catch (error: unknown) {
      onError(
        getApiErrorMessage(
          error,
          category ? "Unable to update category" : "Unable to create category",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {category ? "Edit Category" : "Create Category"}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}

            render={({ field, fieldState }) => (
              <TextField
                {...field}

                fullWidth

                label="Category Name"

                placeholder="Enter category name"

                margin="normal"

                error={!!fieldState.error}

                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}

            render={({ field, fieldState }) => (
              <TextField
                {...field}

                fullWidth

                multiline

                rows={3}

                label="Description"

                placeholder="Enter category description"

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
              : category
                ? "Update Category"
                : "Create Category"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CategoryCreation;
