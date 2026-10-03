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

import type { PurchaseOrder } from "../../types/purchaseOrderTypes";

interface PurchaseOrderColumnProps {
  purchaseOrders: PurchaseOrder[];

  onEdit?: (purchaseOrder: PurchaseOrder) => void;
  onDelete?: (purchaseOrder: PurchaseOrder) => void;
  onApprove?: (purchaseOrder: PurchaseOrder) => void;
  onReject?: (purchaseOrder: PurchaseOrder) => void;
  onSubmit?: (purchaseOrder: PurchaseOrder) => void;
}

function PurchaseOrderColumn({
  purchaseOrders,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onSubmit,
}: PurchaseOrderColumnProps) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "USER";
  const columns: GridColDef[] = [
    {
      field: "poNumber",
      headerName: "PO Number",
      flex: 1,
      minWidth: 160,
    },

    {
      field: "vendor",
      headerName: "Vendor",
      flex: 1,
      minWidth: 180,

      renderCell: (
        params: GridRenderCellParams<PurchaseOrder, PurchaseOrder["vendor"]>,
      ) => {
        return <span>{params.row.vendor?.name || "-"}</span>;
      },
    },

    {
      field: "orderDate",
      headerName: "Order Date",
      width: 180,

      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) {
          return "-";
        }

        return new Date(params.value).toLocaleDateString("en-IN");
      },
    },

    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 160,

      renderCell: (params: GridRenderCellParams) => {
        const amount = Number(params.value);

        return `₹ ${amount.toFixed(2)}`;
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,

      sortable: false,

      renderCell: (params: GridRenderCellParams) => {
        const status = String(params.value);

        return (
          <Chip
            label={status}
            size="small"
            color={
              status === "APPROVED"
                ? "success"
                : status === "REJECTED"
                  ? "error"
                  : status === "CANCELLED"
                    ? "error"
                    : "default"
            }
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,

      sortable: false,
      filterable: false,

      renderCell: (params: GridRenderCellParams) => {
        const purchaseOrder = params.row as PurchaseOrder;
        const status = purchaseOrder.status;
        const canApproveReject = (role === "ADMIN" || role === "MANAGER") && (status === "SUBMITTED" || status === "PENDING_REVIEW");
        const canSubmit = status === "DRAFT";

        return (
          <>
            {canSubmit && (
              <Tooltip title="Submit for Approval">
                <IconButton size="small" color="primary" onClick={() => onSubmit?.(purchaseOrder)}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            )}
            {canApproveReject && (
              <>
                <Tooltip title="Approve">
                  <IconButton size="small" color="success" onClick={() => onApprove?.(purchaseOrder)}>
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton size="small" color="error" onClick={() => onReject?.(purchaseOrder)}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit?.(purchaseOrder)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete?.(purchaseOrder)}
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
      rows={purchaseOrders}

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

export default PurchaseOrderColumn;
