import { Chip, IconButton, Tooltip } from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import { useAuthStore } from "../../store/authStore";

import type {
  GoodsReceipt,
  GoodsReceiptItem,
} from "../../types/goodsReceiptTypes";

interface Vendor {
  id: number;
  name: string;
}

interface GoodsReceiptColumnProps {
  goodsReceipts: GoodsReceipt[];

  vendors: Vendor[];

  onEdit?: (goodsReceipt: GoodsReceipt) => void;
  onDelete?: (goodsReceipt: GoodsReceipt) => void;
  onApprove?: (goodsReceipt: GoodsReceipt) => void;
  onReject?: (goodsReceipt: GoodsReceipt) => void;
  onSubmit?: (goodsReceipt: GoodsReceipt) => void;
}

function GoodsReceiptColumn({
  goodsReceipts,
  vendors,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onSubmit,
}: GoodsReceiptColumnProps) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "USER";
  const columns: GridColDef[] = [
    {
      field: "grnNumber",
      headerName: "GRN Number",
      flex: 1,
      minWidth: 160,
    },

    {
      field: "poNumber",
      headerName: "PO Number",
      flex: 1,
      minWidth: 160,

      valueGetter: (_value, row) => row.purchaseOrder?.poNumber || "-",
    },

    {
      field: "vendor",
      headerName: "Vendor",
      flex: 1,
      minWidth: 180,

      valueGetter: (_value, row) => {
        const vendorId = row.purchaseOrder?.vendorId;

        if (!vendorId) {
          return "-";
        }

        const vendor = vendors.find((vendor) => vendor.id === vendorId);

        return vendor?.name || "-";
      },
    },

    {
      field: "receivedDate",
      headerName: "Received Date",
      flex: 1,
      minWidth: 160,

      valueGetter: (_value, row) => {
        if (!row.receivedDate) {
          return "-";
        }

        return new Date(row.receivedDate).toLocaleDateString("en-IN");
      },
    },

    {
      field: "items",
      headerName: "Items",
      flex: 1.5,
      minWidth: 250,

      valueGetter: (_value, row) => {
        if (!row.items?.length) {
          return "-";
        }

        return row.items
          .map((receiptItem: GoodsReceiptItem) => {
            const itemName =
              receiptItem.item?.name || `Item ${receiptItem.itemId}`;

            const quantity = receiptItem.receivedQuantity;

            return `${itemName} (${quantity})`;
          })
          .join(", ");
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 140,

      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || "-"}
          size="small"
          color={
            params.value === "RECEIVED"
              ? "success"
              : params.value === "REJECTED" || params.value === "CANCELLED"
                ? "error"
                : params.value === "SUBMITTED" || params.value === "PENDING_REVIEW"
                  ? "info"
                  : "default"
          }
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      filterable: false,

      renderCell: (params: GridRenderCellParams) => {
        const goodsReceipt = params.row as GoodsReceipt;
        const status = goodsReceipt.status;
        const canApproveReject = status === "SUBMITTED" || status === "PENDING_REVIEW";
        const canSubmit = status === "DRAFT";

        return (
          <>
            {canSubmit && (
              <Tooltip title="Submit for Approval">
                <IconButton size="small" color="primary" onClick={() => onSubmit?.(goodsReceipt)}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            )}
            {canApproveReject && (
              <>
                <Tooltip title="Approve">
                  <IconButton size="small" color="success" onClick={() => onApprove?.(goodsReceipt)}>
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton size="small" color="error" onClick={() => onReject?.(goodsReceipt)}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit?.(goodsReceipt)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete?.(goodsReceipt)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={goodsReceipts}
      columns={columns}
      getRowId={(row) => row.id}
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 10,
          },
        },
      }}
      disableRowSelectionOnClick
      sx={{
        border: 0,
        height: '100%',

        "& .MuiDataGrid-columnHeaders": {
          fontWeight: 600,
        },

        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
      }}
    />
  );
}

export default GoodsReceiptColumn;
