import { useEffect, useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import CategoryColumn from "./CategoryColumn";
import CategoryCreation from "./CategoryCreation";
import categoryService from "../../services/categoryService";
import type { Category as CategoryType } from "../../types/categoryTypes";
import { getApiErrorMessage } from "../../utils/apiError";
import Toast from "../../compnents/Toast";
import Loader from "../../compnents/Loader";

export function Category() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const getCategories = async () => {
    setIsLoading(true);

    try {
      const response = await categoryService.getCategories();

      setCategories(response.data);
    } catch (error: unknown) {
      setToast({
        open: true,
        message: getApiErrorMessage(error, "Unable to load categories"),
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setOpenCreate(true);
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setOpenCreate(true);
  };

  const handleDelete = async (category: CategoryType) => {
    setIsLoading(true);

    try {
      const response = await categoryService.deleteCategory(
        String(category.id),
      );

      setToast({
        open: true,
        message: response?.message || "Category deleted successfully",
        severity: "success",
      });
      await getCategories();
    } catch (error: unknown) {
      setToast({
        open: true,
        message: getApiErrorMessage(error, "Unable to delete category"),
        severity: "error",
      });

      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    category: CategoryType,
    isActive: boolean,
  ) => {
    setIsLoading(true);

    try {
      const response = await categoryService.updateStatus(
        String(category.id),
        isActive,
      );

      setToast({
        open: true,
        message:
          response?.message ||
          (isActive
            ? "Category activated successfully"
            : "Category deactivated successfully"),
        severity: "success",
      });
      await getCategories();
    } catch (error: unknown) {
      setToast({
        open: true,
        message: getApiErrorMessage(error, "Unable to update category status"),
        severity: "error",
      });

      await getCategories();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);
    setSelectedCategory(null);
  };

  const handleSaved = async (message: string) => {
    setOpenCreate(false);
    setSelectedCategory(null);

    setToast({
      open: true,
      message,
      severity: "success",
    });

    await getCategories();
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
            Category Management
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
            + Add Category
          </Button>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: 'calc(100vh - 200px)',
          overflow: 'hidden'
        }}
      >
        <CategoryColumn
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      <CategoryCreation
        open={openCreate}
        onClose={handleClose}
        category={selectedCategory}
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

export default Category;
