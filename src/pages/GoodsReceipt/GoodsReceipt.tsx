import { useEffect, useState } from "react";

import { Button, Grid, Paper, Typography } from "@mui/material";

import GoodsReceiptColumn from "./GoodsReceiptColumn";

import GoodsReceiptCreation from "./GoodsReceiptCreation";

import goodsReceiptService from "../../services/goodsReceiptService";

import type { GoodsReceipt as GoodsReceiptType } from "../../types/goodsReceiptTypes";

import { getApiErrorMessage } from "../../utils/apiError";

import Toast from "../../compnents/Toast";

import Loader from "../../compnents/Loader";
import vendorService from "../../services/vendorService";

function GoodsReceipt() {
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceiptType[]>([]);
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [selectedGoodsReceipt, setSelectedGoodsReceipt] =
    useState<GoodsReceiptType | null>(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const getVendors = async () => {
    try {
      const response = await vendorService.getVendors();

      setVendors(response.data || []);
    } catch (error: unknown) {
      setToast({
        open: true,
        message: getApiErrorMessage(error, "Unable to load vendors"),
        severity: "error",
      });
    }
  };

  const getGoodsReceipts = async () => {
    setIsLoading(true);

    try {
      const response = await goodsReceiptService.getGoodsReceipts();
      setGoodsReceipts(response.data.data || []);
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to load goods receipts"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGoodsReceipts();
    getVendors();
  }, []);

  const handleCreate = () => {
    setSelectedGoodsReceipt(null);

    setOpenCreate(true);
  };

  const handleEdit = (goodsReceipt: GoodsReceiptType) => {
    setSelectedGoodsReceipt(goodsReceipt);

    setOpenCreate(true);
  };

  const handleDelete = async (goodsReceipt: GoodsReceiptType) => {
    setIsLoading(true);

    try {
      const response = await goodsReceiptService.deleteGoodsReceipt(
        String(goodsReceipt.id),
      );

      setToast({
        open: true,

        message: response?.message || "Goods receipt deleted successfully",

        severity: "success",
      });

      await getGoodsReceipts();
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to delete goods receipt"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (goodsReceipt: GoodsReceiptType) => {
    if (!window.confirm(`Are you sure you want to approve GRN ${goodsReceipt.grnNumber}? Once RECEIVED, stock will be updated.`)) return;
    setIsLoading(true);
    try {
      await goodsReceiptService.approveGoodsReceipt(String(goodsReceipt.id));
      setToast({ open: true, message: "Goods Receipt Approved", severity: "success" });
      await getGoodsReceipts();
    } catch (error: unknown) {
      setToast({ open: true, message: getApiErrorMessage(error, "Failed to approve GRN"), severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (goodsReceipt: GoodsReceiptType) => {
    const reason = window.prompt(`Enter rejection reason for GRN ${goodsReceipt.grnNumber}:`);
    if (reason === null) return;
    if (!reason.trim()) {
      setToast({ open: true, message: "Rejection reason is required", severity: "error" });
      return;
    }
    setIsLoading(true);
    try {
      await goodsReceiptService.rejectGoodsReceipt(String(goodsReceipt.id), reason);
      setToast({ open: true, message: "Goods Receipt Rejected", severity: "success" });
      await getGoodsReceipts();
    } catch (error: unknown) {
      setToast({ open: true, message: getApiErrorMessage(error, "Failed to reject GRN"), severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitGRN = async (goodsReceipt: GoodsReceiptType) => {
    if (!window.confirm(`Are you sure you want to submit GRN ${goodsReceipt.grnNumber} for approval?`)) return;
    setIsLoading(true);
    try {
      await goodsReceiptService.submitGoodsReceipt(String(goodsReceipt.id));
      setToast({ open: true, message: "Goods Receipt Submitted successfully", severity: "success" });
      await getGoodsReceipts();
    } catch (error: unknown) {
      setToast({ open: true, message: getApiErrorMessage(error, "Failed to submit GRN"), severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);

    setSelectedGoodsReceipt(null);
  };

  const handleSaved = async (message: string) => {
    setOpenCreate(false);

    setSelectedGoodsReceipt(null);

    setToast({
      open: true,
      message,
      severity: "success",
    });

    await getGoodsReceipts();
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
      <Grid
        container
        sx={{
          mb: 2,
          alignItems: "center",
        }}
      >
        <Grid size={10}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
            }}
          >
            Goods Receipt Management
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
            + Add Goods Receipt
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
        <GoodsReceiptColumn
          goodsReceipts={goodsReceipts}
          vendors={vendors}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
          onSubmit={handleSubmitGRN}
        />
      </Paper>

      <GoodsReceiptCreation
        open={openCreate}

        onClose={handleClose}

        goodsReceipt={selectedGoodsReceipt}

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

export default GoodsReceipt;
