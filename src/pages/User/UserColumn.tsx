import {
  Chip,
  IconButton,
  Switch,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { User } from "../../types/userTypes";

interface UserColumnProps {
  users: User[];

  onEdit?: (user: User) => void;

  onDelete?: (user: User) => void;

  onStatusChange?: (user: User, isActive: boolean) => void;

  error?: string | null;
}

function UserColumn({
  users,
  onEdit,
  onDelete,
  onStatusChange,
  error,
}: UserColumnProps) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 250,
    },

    {
      field: "role",
      headerName: "Role",
      width: 130,

      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" />
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
              size="small"
              checked={isActive}
              color="success"
              onChange={(event) => {
                onStatusChange?.(params.row as User, event.target.checked);
              }}
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
        const user = params.row as User;

        return (
          <Box>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit?.(user)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete?.(user)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {error && (
        <Box
          sx={{
            p: 2,
            mb: 1,
            border: "1px solid #f5c2c2",
            borderRadius: 1,
            backgroundColor: "#fff5f5",
          }}
        >
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      <DataGrid
        rows={users}
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
    </Box>
  );
}

export default UserColumn;
