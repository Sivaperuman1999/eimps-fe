import * as yup from "yup";

export const vendorSchema = yup.object({
  name: yup
    .string()
    .required("Vendor name is required")
    .max(100, "Vendor name cannot exceed 100 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must contain 10 digits"),

  address: yup
    .string()
    .required("Address is required")
    .max(500, "Address cannot exceed 500 characters"),
});

export type VendorFormData = yup.InferType<typeof vendorSchema>;
