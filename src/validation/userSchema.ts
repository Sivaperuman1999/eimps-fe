import * as yup from "yup";

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.default(""),
  }),

  role: yup.string().required("Role is required"),

  status: yup.string().required("Status is required"),
});
