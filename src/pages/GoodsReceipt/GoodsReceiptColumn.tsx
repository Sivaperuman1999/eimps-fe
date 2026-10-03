import { Chip, IconButton, Tooltip } from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
}

function GoodsReceiptColumn({
  goodsReceipts,
  vendors,
  onEdit,
  onDelete,
}: GoodsReceiptColumnProps) {
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
              : params.value === "CANCELLED"
                ? "error"
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

      renderCell: (params: GridRenderCellParams) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit?.(params.row as GoodsReceipt)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(params.row as GoodsReceipt)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
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
