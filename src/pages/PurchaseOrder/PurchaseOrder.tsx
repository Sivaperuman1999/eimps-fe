import { useEffect, useState } from "react";

import { Button, Grid, Paper, Typography } from "@mui/material";

import PurchaseOrderColumn from "./PurchaseOrderColumn";

import PurchaseOrderCreation from "./PurchaseOrderCreation";

import purchaseOrderService from "../../services/purchaseOrderService";

import type { PurchaseOrder } from "../../types/purchaseOrderTypes";

import { getApiErrorMessage } from "../../utils/apiError";

import Toast from "../../compnents/Toast";

import Loader from "../../compnents/Loader";

function PurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrder | null>(null);

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

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);

    setOpenCreate(true);
  };

  const handleDelete = async (purchaseOrder: PurchaseOrder) => {
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
        }}
      >
        <PurchaseOrderColumn
          purchaseOrders={purchaseOrders}

          onEdit={handleEdit}

          onDelete={handleDelete}
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
