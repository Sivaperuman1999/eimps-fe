import { IconButton, Switch, Tooltip } from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Category } from "../../types/categoryTypes";

interface CategoryColumnProps {
  categories: Category[];

  onEdit?: (category: Category) => void;

  onDelete?: (category: Category) => void;

  onStatusChange?: (category: Category, isActive: boolean) => void;
}

function CategoryColumn({
  categories,
  onEdit,
  onDelete,
  onStatusChange,
}: CategoryColumnProps) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Category Name",
      flex: 0.7,
      minWidth: 150,
    },

    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 250,
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 140,
      sortable: false,
      filterable: false,

      renderCell: (params: GridRenderCellParams<Category, boolean>) => {
        const isActive = Boolean(params.value);

        return (
          <Tooltip title={isActive ? "Active" : "Inactive"}>
            <Switch
              checked={isActive}
              color="success"
              onChange={() => onStatusChange?.(params.row, !isActive)}
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
        const category = params.row as Category;

        return (
          <>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit?.(category)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete?.(category)}
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
      rows={categories}
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

export default CategoryColumn;
