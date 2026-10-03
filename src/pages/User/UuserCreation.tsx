import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import userService from "../../services/userService";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../../types/userTypes";

import { userSchema, type UserFormData } from "../../validation/userSchema";
import metadataService, { type Role } from "../../services/metadataService";

interface UserCreationProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;

  onSaved: (message: string) => void;

  onError: (message: string) => void;
}

function UserCreation({
  open,
  onClose,
  user,
  onSaved,
  onError,
}: UserCreationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  console.log("roles", roles);

  const { control, handleSubmit, reset } = useForm<UserFormData>({
    resolver: yupResolver(userSchema) as never,

    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        role: user.role ?? "USER",
        status: user.status ?? "ACTIVE",
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });
    }
  }, [user, open, reset]);

  const handleSave = async (data: UserFormData) => {
    setIsLoading(true);

    try {
      let response;

      if (user) {
        const updateData: UpdateUserRequest = {
          name: data.name,
          email: data.email,
        };

        response = await userService.updateUser(String(user.id), updateData);
      } else {
        const createData: CreateUserRequest = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
        };

        response = await userService.createUser(createData);
      }

      onSaved(
        response?.message ||
          (user ? "User updated successfully" : "User created successfully"),
      );

      onClose();
    } catch (error: unknown) {
      const message = user ? "Unable to update user" : "Unable to create user";
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!open) return;

    const fetchRoles = async () => {
      setRolesLoading(true);

      try {
        const response = await metadataService.getRoles();

        console.log("response", response);

        if (response.success) {
          const rolesArray = Array.isArray(response.data) ? response.data : response.data?.data;
          setRoles(rolesArray || []);
        }
      } catch (error) {
        console.error("Failed to fetch roles", error);

        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>

      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                placeholder="Enter user name"
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                placeholder="Enter email"
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {!user && (
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Role"
                margin="normal"
                disabled={!!user || rolesLoading}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {roles.map((role: any) => (
                  <MenuItem key={role.id || role._id} value={role.roleCode || role.code}>
                    {role.roleName || role.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserCreation;
