import { IconButton, Switch, Tooltip } from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Inventory } from "../../types/inventoryTypes";

interface InventoryColumnProps {
  inventory: Inventory[];

  onEdit?: (inventory: Inventory) => void;

  onDelete?: (inventory: Inventory) => void;

  onStatusChange?: (inventory: Inventory, isActive: boolean) => void;
}

function InventoryColumn({
  inventory,
  onEdit,
  onDelete,
  onStatusChange,
}: InventoryColumnProps) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "sku",
      headerName: "SKU",
      width: 150,
    },

    {
      field: "category",
      headerName: "Category",
      width: 120,
      valueGetter: (params: any, row?: any) => {
        const actualRow = row || params?.row;
        return actualRow?.category?.name || actualRow?.categoryId || "-";
      }
    },

    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
    },

    {
      field: "price",
      headerName: "Price",
      width: 130,

      renderCell: (params: GridRenderCellParams) => (
        <span>₹ {Number(params.value).toFixed(2)}</span>
      ),
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 130,
      sortable: false,

      renderCell: (params: GridRenderCellParams) => {
        const isActive = Boolean(params.value);

        return (
          <Tooltip title={isActive ? "Active" : "Inactive"}>
            <Switch
              checked={isActive}
              color="success"
              onChange={() =>
                onStatusChange?.(params.row as Inventory, !isActive)
              }
            />
          </Tooltip>
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
        const row = params.row as Inventory;

        return (
          <>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit?.(row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete?.(row)}
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
      rows={inventory}
      columns={columns}
      getRowId={(row) => row.id}
      autoHeight
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

export default InventoryColumn;
