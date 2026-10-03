import { IconButton, Switch, Tooltip } from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Vendor } from "../../types/vendorTypes";

interface VendorColumnProps {
  vendors: Vendor[];
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (vendor: Vendor) => void;
  onStatusChange?: (vendor: Vendor, isActive: boolean) => void;
}

function VendorColumn({
  vendors,
  onEdit,
  onDelete,
  onStatusChange,
}: VendorColumnProps) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Vendor Name",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },

    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },

    {
      field: "address",
      headerName: "Address",
      flex: 1.5,
      minWidth: 250,
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      sortable: false,

      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value ? "Active" : "Inactive"}>
          <Switch
            checked={Boolean(params.value)}
            color="success"

            onChange={() =>
              onStatusChange?.(params.row as Vendor, !Boolean(params.value))
            }
          />
        </Tooltip>
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
              onClick={() => onEdit?.(params.row as Vendor)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(params.row as Vendor)}
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
      rows={vendors}
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

export default VendorColumn;
