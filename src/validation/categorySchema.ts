import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),

  description: yup
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: yup
    .string()
    .oneOf(["ACTIVE", "INACTIVE"], "Invalid status")
    .required("Status is required"),
});

export type CategoryFormData = yup.InferType<typeof categorySchema>;
