import * as yup from "yup";

export const purchaseOrderSchema = yup.object({
  vendorId: yup
    .string()
    .required("Vendor is required"),

  orderDate: yup.string().required("Order date is required"),

  items: yup
    .array()
    .of(
      yup.object({
        itemId: yup.string().required("Item is required"),

        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be greater than 0"),

        unitPrice: yup
          .number()
          .required("Unit price is required")
          .min(0, "Price cannot be negative"),
      }),
    )
    .min(1, "At least one item is required")
    .required(),
});

export type PurchaseOrderFormData = yup.InferType<typeof purchaseOrderSchema>;
