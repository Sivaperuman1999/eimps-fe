import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { getDashboardData, type DashboardData } from "../../services/dashboardService";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CardMetric = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2, height: '100%' }}>
      <Box>
        <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: `${color}15`, p: 1.5, borderRadius: 2, color: color, display: 'flex' }}>
        {icon}
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280" }}>
            Overview of your inventory and procurement
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CardMetric title="Total Inventory" value={data.inventory.total} icon={<InventoryIcon fontSize="large" />} color="#3B82F6" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CardMetric title="Total Vendors" value={data.vendors.total} icon={<StorefrontIcon fontSize="large" />} color="#10B981" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CardMetric title="Purchase Orders" value={data.purchaseOrders.total} icon={<ReceiptIcon fontSize="large" />} color="#F59E0B" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CardMetric title="Goods Receipts" value={data.goodsReceipts.total} icon={<LocalShippingIcon fontSize="large" />} color="#8B5CF6" />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Inventory Status</Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="body2" color="textSecondary">Active Items</Typography>
                    <Typography variant="h6">{data.inventory.active}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body2" color="textSecondary">Low Stock Items</Typography>
                    <Typography variant="h6" color="error.main">{data.inventory.lowStock}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body2" color="textSecondary">Out of Stock</Typography>
                    <Typography variant="h6" color="error.main">{data.inventory.outOfStock}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body2" color="textSecondary">Total Stock Qty</Typography>
                    <Typography variant="h6">{data.inventory.totalStock}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>PO Status</Typography>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Typography variant="body2" color="textSecondary">Draft</Typography>
                    <Typography variant="h6">{data.purchaseOrders.draft}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="textSecondary">Submitted</Typography>
                    <Typography variant="h6" color="warning.main">{data.purchaseOrders.submitted}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="body2" color="textSecondary">Approved</Typography>
                    <Typography variant="h6" color="success.main">{data.purchaseOrders.approved}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body2" color="textSecondary">Total PO Value</Typography>
                    <Typography variant="h5" color="primary.main">${data.purchaseOrders.totalValue.toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">Failed to load dashboard data.</Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Dashboard;
