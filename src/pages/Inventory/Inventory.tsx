import { useEffect, useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import InventoryColumn from "./InventoryColumn";
import InventoryCreation from "./InventoryCreation";
import inventoryService from "../../services/inventoryService";
import type { Inventory as InventoryType } from "../../types/inventoryTypes";
import { getApiErrorMessage } from "../../utils/apiError";
import Toast from "../../compnents/Toast";
import Loader from "../../compnents/Loader";

function Inventory() {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryType | null>(
    null,
  );

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const getInventory = async () => {
    setIsLoading(true);

    try {
      const response = await inventoryService.getInventory();

      setInventory(response.data);
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Unable to load inventory");

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
    getInventory();
  }, []);

  const handleCreate = () => {
    setSelectedInventory(null);
    setOpenCreate(true);
  };

  const handleEdit = (item: InventoryType) => {
    setSelectedInventory(item);
    setOpenCreate(true);
  };

  const handleDelete = async (item: InventoryType) => {
    setIsLoading(true);

    try {
      const response = await inventoryService.deleteInventory(String(item.id));

      setToast({
        open: true,

        message: response.message || "Inventory deleted successfully",

        severity: "success",
      });

      await getInventory();
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to delete inventory"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (item: InventoryType, isActive: boolean) => {
    setIsLoading(true);

    try {
      const response = await inventoryService.updateInventoryStatus(
        String(item.id),
        isActive,
      );

      setToast({
        open: true,

        message:
          response.message ||
          (isActive
            ? "Inventory activated successfully"
            : "Inventory deactivated successfully"),

        severity: "success",
      });

      await getInventory();
    } catch (error: unknown) {
      setToast({
        open: true,

        message: getApiErrorMessage(error, "Unable to update inventory status"),

        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpenCreate(false);
    setSelectedInventory(null);
  };

  const handleSaved = async (message: string) => {
    setOpenCreate(false);
    setSelectedInventory(null);

    setToast({
      open: true,
      message,
      severity: "success",
    });

    await getInventory();
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
            Inventory Management
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
            + Add Inventory
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
        <InventoryColumn
          inventory={inventory}

          onEdit={handleEdit}

          onDelete={handleDelete}

          onStatusChange={handleStatusChange}
        />
      </Paper>

      <InventoryCreation
        open={openCreate}

        onClose={handleClose}

        inventory={selectedInventory}

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

export default Inventory;
