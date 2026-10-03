import * as yup from "yup";

export const verifyResetOtpSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
});

export type VerifyResetOtpFormData = yup.InferType<typeof verifyResetOtpSchema>;
