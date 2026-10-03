import * as yup from "yup";

export const goodsReceiptSchema = yup.object({
  purchaseOrderId: yup
    .string()
    .required("Purchase order is required"),

  receiptDate: yup.string().required("Receipt date is required"),

  items: yup
    .array()
    .of(
      yup.object({
        itemId: yup
          .string()
          .required("Item is required"),

        quantity: yup
          .number()
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one item is required")
    .required("Items are required"),
});

export type GoodsReceiptFormData = yup.InferType<typeof goodsReceiptSchema>;
