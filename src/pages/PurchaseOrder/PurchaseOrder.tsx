import { useEffect, useState } from "react";

import { Button, Grid, Paper, Typography } from "@mui/material";

import PurchaseOrderColumn from "./PurchaseOrderColumn";

import PurchaseOrderCreation from "./PurchaseOrderCreation";

import purchaseOrderService from "../../services/purchaseOrderService";

import type { PurchaseOrder as PurchaseOrderType } from "../../types/purchaseOrderTypes";

import { getApiErrorMessage } from "../../utils/apiError";

import Toast from "../../compnents/Toast";

import Loader from "../../compnents/Loader";

function PurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrderType | null>(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const getPurchaseOrders = async () => {
    setIsLoading(true);

    try {
      const response = await purchaseOrderService.getPurchaseOrders();

      setPurchaseOrders(response.data);
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to load purchase orders"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPurchaseOrders();
  }, []);

  const handleCreate = () => {
    setSelectedPurchaseOrder(null);

    setOpenCreate(true);
  };

  const handleEdit = (purchaseOrder: PurchaseOrderType) => {
    setSelectedPurchaseOrder(purchaseOrder);

    setOpenCreate(true);
  };

  const handleDelete = async (purchaseOrder: PurchaseOrderType) => {
    setIsLoading(true);

    try {
      const response = await purchaseOrderService.deletePurchaseOrder(
        String(purchaseOrder.id),
      );

      setToast({
        open: true,

        message: response?.message || "Purchase order deleted successfully",

        severity: "success",
      });

      await getPurchaseOrders();
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to delete purchase order"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (purchaseOrder: PurchaseOrderType) => {
    if (!window.confirm(`Are you sure you want to approve PO ${purchaseOrder.poNumber}?`)) return;
    setIsLoading(true);
    try {
      await purchaseOrderService.approvePurchaseOrder(String(purchaseOrder.id));
      setToast({ open: true, message: "Purchase Order Approved", severity: "success" });
      await getPurchaseOrders();
    } catch (error: unknown) {
      setToast({ open: true, message: getApiErrorMessage(error, "Failed to approve PO"), severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (purchaseOrder: PurchaseOrderType) => {
    const reason = window.prompt(`Enter rejection reason for PO ${purchaseOrder.poNumber}:`);
    if (reason === null) return;
    if (!reason.trim()) {
      setToast({ open: true, message: "Rejection reason is required", severity: "error" });
      return;
    }
    setIsLoading(true);
    try {
      await purchaseOrderService.rejectPurchaseOrder(String(purchaseOrder.id), reason);
      setToast({ open: true, message: "Purchase Order Rejected", severity: "success" });
      await getPurchaseOrders();
    } catch (error: unknown) {
      setToast({ open: true, message: getApiErrorMessage(error, "Failed to reject PO"), severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPO = async (purchaseOrder: PurchaseOrderType) => {
    if (!window.confirm(`Are you sure you want to submit PO ${purchaseOrder.poNumber} for approval?`)) return;
    setIsLoading(true);
    try {
      await purchaseOrderService.submitPurchaseOrder(String(purchaseOrder.id));
      setToast({ open: true, message: "Purchase Order Submitted successfully", severity: "success" });
      await getPurchaseOrders();
    } catch (error: unknown) {
      setToast({ open: true, message: getApiErrorMessage(error, "Failed to submit PO"), severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);

    setSelectedPurchaseOrder(null);
  };

  const handleSaved = async (message: string) => {
    setOpenCreate(false);

    setSelectedPurchaseOrder(null);

    setToast({
      open: true,
      message,
      severity: "success",
    });

    await getPurchaseOrders();
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
            Purchase Order Management
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
            + Create PO
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
        <PurchaseOrderColumn
          purchaseOrders={purchaseOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
          onSubmit={handleSubmitPO}
        />
      </Paper>

      <PurchaseOrderCreation
        open={openCreate}

        onClose={handleClose}

        purchaseOrder={selectedPurchaseOrder}

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

export default PurchaseOrder;
