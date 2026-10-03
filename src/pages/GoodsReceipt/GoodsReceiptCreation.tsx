import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useFieldArray, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import purchaseOrderService from "../../services/purchaseOrderService";
import goodsReceiptService from "../../services/goodsReceiptService";

import type { CreateGoodsReceiptRequest, GoodsReceipt, UpdateGoodsReceiptRequest } from "../../types/goodsReceiptTypes";

import {
  goodsReceiptSchema,
  type GoodsReceiptFormData,
} from "../../validation/goodsReceiptSchema";

import { getApiErrorMessage } from "../../utils/apiError";

interface PurchaseOrderItem {
  id: string;
  itemId: string;
  quantity: number | string;
  unitPrice: number | string;

  item?: {
    id: string;
    name: string;
    sku: string;
  };
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;

  vendor?: {
    id: string;
    name: string;
    code?: string;
  };

  items: PurchaseOrderItem[];
}

interface GoodsReceiptCreationProps {
  open: boolean;
  onClose: () => void;
  goodsReceipt?: GoodsReceipt | null;
  onSaved: (message: string) => void;
  onError?: (message: string) => void;
}

function GoodsReceiptCreation({
  open,
  onClose,
  goodsReceipt,
  onSaved,
  onError,
}: GoodsReceiptCreationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoadingPurchaseOrders, setIsLoadingPurchaseOrders] =
    useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<GoodsReceiptFormData>({
    resolver: yupResolver(goodsReceiptSchema),

    defaultValues: {
      purchaseOrderId: "",
      receiptDate: "",
      items: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "items",
  });

  const selectedPurchaseOrderId = watch("purchaseOrderId");

  /*
   * Load Purchase Orders
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const fetchPurchaseOrders = async () => {
      setIsLoadingPurchaseOrders(true);

      try {
        const response = await purchaseOrderService.getPurchaseOrders();

        setPurchaseOrders(
          Array.isArray(response.data) ? response.data : [],
        );
      } catch (error: unknown) {
        onError?.(
          getApiErrorMessage(
            error,
            "Unable to load purchase orders",
          ),
        );
      } finally {
        setIsLoadingPurchaseOrders(false);
      }
    };

    fetchPurchaseOrders();
  }, [open, onError]);

  /*
   * Reset form when dialog opens / closes
   * and when edit record changes.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (goodsReceipt) {
      reset({
        purchaseOrderId: goodsReceipt.purchaseOrderId,

        receiptDate: goodsReceipt.receivedDate
          ? goodsReceipt.receivedDate.split("T")[0]
          : "",

        items: goodsReceipt.items.map((item) => ({
          itemId: item.itemId,
          quantity: Number(item.receivedQuantity),
        })),
      });

      return;
    }

    reset({
      purchaseOrderId: "",
      receiptDate: "",
      items: [],
    });
  }, [goodsReceipt, open, reset]);

  /*
   * CREATE MODE:
   *
   * When Purchase Order is selected,
   * automatically load all items from that PO.
   *
   * User cannot add/remove/select items manually.
   */
  useEffect(() => {
    if (goodsReceipt) {
      return;
    }

    if (!selectedPurchaseOrderId) {
      replace([]);
      return;
    }

    const selectedPO = purchaseOrders.find(
      (po) => po.id === selectedPurchaseOrderId,
    );

    if (!selectedPO) {
      replace([]);
      return;
    }

    replace(
      selectedPO.items.map((poItem) => ({
        itemId: poItem.itemId,
        quantity: 0,
      })),
    );
  }, [
    selectedPurchaseOrderId,
    purchaseOrders,
    goodsReceipt,
    replace,
  ]);

  /*
   * Save Goods Receipt
   */
  const handleSave = async (data: GoodsReceiptFormData) => {
    setIsLoading(true);

    try {
      if (!goodsReceipt) {
        const createPayload: CreateGoodsReceiptRequest = {
          purchaseOrderId: data.purchaseOrderId,

          receiptDate: data.receiptDate,

          items: data.items.map((item) => ({
            itemId: item.itemId,
            quantity: Number(item.quantity),
          })),
        };

        const response =
          await goodsReceiptService.createGoodsReceipt(createPayload);

        onSaved(
          response?.message || "Goods receipt created successfully",
        );

        onClose();

        return;
      }

      const updatePayload: UpdateGoodsReceiptRequest = {
        purchaseOrderId: data.purchaseOrderId,
        receiptDate: data.receiptDate,
      };

      const response =
        await goodsReceiptService.updateGoodsReceipt(
          String(goodsReceipt.id),
          updatePayload,
        );

      onSaved(
        response?.message || "Goods receipt updated successfully",
      );

      onClose();
    } catch (error: unknown) {
      onError?.(
        getApiErrorMessage(
          error,
          goodsReceipt
            ? "Unable to update goods receipt"
            : "Unable to create goods receipt",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };
  /*
   * Find selected PO
   */
  const selectedPO = purchaseOrders.find(
    (po) => po.id === selectedPurchaseOrderId,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {goodsReceipt
          ? "Edit Goods Receipt"
          : "Create Goods Receipt"}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          {/* Purchase Order */}
          <Controller
            name="purchaseOrderId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value || ""}
                fullWidth
                select
                label="Purchase Order"
                margin="normal"
                disabled={
                  isLoadingPurchaseOrders ||
                  !!goodsReceipt
                }
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {isLoadingPurchaseOrders ? (
                  <MenuItem disabled>
                    Loading purchase orders...
                  </MenuItem>
                ) : purchaseOrders.length === 0 ? (
                  <MenuItem disabled>
                    No purchase orders found
                  </MenuItem>
                ) : (
                  purchaseOrders.map((po) => (
                    <MenuItem
                      key={po.id}
                      value={po.id}
                    >
                      {po.poNumber}

                      {po.vendor?.name
                        ? ` - ${po.vendor.name}`
                        : ""}
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />

          {/* Receipt Date */}
          <Controller
            name="receiptDate"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label="Receipt Date"
                margin="normal"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Items */}
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 1,
            }}
          >
            Goods Receipt Items
          </Typography>

          {!selectedPurchaseOrderId && !goodsReceipt ? (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Please select a purchase order.
            </Typography>
          ) : null}

          {/* EDIT MODE */}
          {goodsReceipt
            ? goodsReceipt.items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                spacing={2}
                sx={{
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  label="Item"
                  value={
                    item.item
                      ? `${item.item.name} (${item.item.sku})`
                      : String(item.itemId)
                  }
                  disabled
                  sx={{
                    flex: 2,
                  }}
                />

                <TextField
                  fullWidth
                  label="Received Quantity"
                  value={item.receivedQuantity}
                  disabled
                  sx={{
                    flex: 1,
                  }}
                />
              </Stack>
            ))
            : /* CREATE MODE */
            fields.map((field, index) => {
              const poItem = selectedPO?.items.find(
                (item) =>
                  item.itemId === field.itemId,
              );

              const itemName =
                poItem?.item?.name ||
                `Item ${field.itemId}`;

              const itemSku =
                poItem?.item?.sku || "";

              const orderedQuantity =
                Number(poItem?.quantity || 0);

              return (
                <Stack
                  key={field.id}
                  direction="row"
                  spacing={2}
                  sx={{
                    mb: 2,
                    alignItems: "center",
                  }}
                >
                  {/* Item - ALWAYS LOCKED */}
                  <TextField
                    fullWidth
                    label="Item"
                    value={
                      itemSku
                        ? `${itemName} (${itemSku})`
                        : itemName
                    }
                    disabled
                    sx={{
                      flex: 2,
                    }}
                  />

                  {/* Ordered Quantity */}
                  <TextField
                    fullWidth
                    label="Ordered Quantity"
                    value={orderedQuantity}
                    disabled
                    sx={{
                      flex: 1,
                    }}
                  />

                  {/* Received Quantity */}
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({
                      field,
                      fieldState,
                    }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Received Quantity"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error?.message
                        }
                        sx={{
                          flex: 1,
                        }}
                      />
                    )}
                  />
                </Stack>
              );
            })}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              isLoading ||
              isLoadingPurchaseOrders ||
              (!goodsReceipt &&
                !selectedPurchaseOrderId)
            }
          >
            {isLoading
              ? "Saving..."
              : goodsReceipt
                ? "Update Goods Receipt"
                : "Create Goods Receipt"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default GoodsReceiptCreation;