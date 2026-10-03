import { useEffect, useState } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";

import UserColumn from "./UserColumn";
import UserCreation from "./UuserCreation";

import userService from "../../services/userService";

import type { User } from "../../types/userTypes";

import Toast from "../../compnents/Toast";
import Loader from "../../compnents/Loader";

import { getApiErrorMessage } from "../../utils/apiError";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const getUsers = async () => {
    setIsLoading(true);
    setTableError(null);

    try {
      const response = await userService.getUsers();

      setUsers(response.data.users);
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Unable to load users");

      setTableError(message);
      setToast({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setOpenCreate(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpenCreate(true);
  };

  const handleDelete = async (user: User) => {
    setIsLoading(true);

    try {
      const response = await userService.deleteUser(String(user.id));

      setToast({
        open: true,
        message: response?.message || "User deleted successfully",
        severity: "success",
      });

      await getUsers();
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Unable to delete user");

      setToast({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (user: User, isActive: boolean) => {
    setIsLoading(true);

    try {
      const response = await userService.updateUserStatus(
        String(user.id),
        isActive,
      );

      setToast({
        open: true,
        message:
          response?.message ||
          (isActive
            ? "User activated successfully"
            : "User deactivated successfully"),
        severity: "success",
      });

      await getUsers();
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Unable to update user status");

      setToast({
        open: true,
        message,
        severity: "error",
      });

      await getUsers();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setSelectedUser(null);
  };

  const handleUserSaved = async (message: string) => {
    setOpenCreate(false);
    setSelectedUser(null);

    setToast({
      open: true,
      message,
      severity: "success",
    });

    await getUsers();
  };

  const handleUserError = (message: string) => {
    setToast({
      open: true,
      message,
      severity: "error",
    });
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Manage system users and access
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleCreate}
          sx={{ borderRadius: 2, px: 3 }}
        >
          + Add User
        </Button>
      </Box>

      <Paper
        sx={{
          p: 2,
        }}
      >
        <UserColumn
          users={users}
          error={tableError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      <UserCreation
        open={openCreate}
        onClose={handleCloseCreate}
        user={selectedUser}
        onSaved={handleUserSaved}
        onError={handleUserError}
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

export default Users;
