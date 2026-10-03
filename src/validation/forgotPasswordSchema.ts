import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
