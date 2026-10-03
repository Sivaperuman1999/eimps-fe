import * as yup from "yup";

export const inventorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Inventory name is required")
    .max(100, "Inventory name must not exceed 100 characters"),

  sku: yup
    .string()
    .trim()
    .required("SKU is required")
    .max(50, "SKU must not exceed 50 characters"),

  categoryId: yup
    .string()
    .typeError("Category is required")
    .required("Category is required"),

  quantity: yup
    .number()
    .typeError("Quantity is required")
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative"),

  price: yup
    .number()
    .typeError("Price is required")
    .required("Price is required")
    .min(0, "Price cannot be negative"),
});

export type InventoryFormData = yup.InferType<typeof inventorySchema>;
