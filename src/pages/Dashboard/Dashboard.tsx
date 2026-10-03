import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, CircularProgress, useTheme } from "@mui/material";
import { getDashboardData, type DashboardData } from "../../services/dashboardService";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: `${color}15`, p: 1.5, borderRadius: 2, color: color, display: 'flex' }}>
        {icon}
      </Box>
    </Paper>
  );

  const inventoryChartData = data ? [
    { name: 'Active', value: data.inventory.active, color: '#10B981' },
    { name: 'Low Stock', value: data.inventory.lowStock, color: '#F59E0B' },
    { name: 'Out of Stock', value: data.inventory.outOfStock, color: '#EF4444' },
  ].filter(item => item.value > 0) : [];

  const poChartData = data ? [
    { name: 'Draft', count: data.purchaseOrders.draft },
    { name: 'Submitted', count: data.purchaseOrders.submitted },
    { name: 'Review', count: data.purchaseOrders.pendingReview },
    { name: 'Approved', count: data.purchaseOrders.approved },
    { name: 'Processing', count: data.purchaseOrders.processing },
    { name: 'Completed', count: data.purchaseOrders.completed },
  ] : [];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
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
            {/* Inventory Pie Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Inventory Status</Typography>
                <Box sx={{ height: 300 }}>
                  {inventoryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={inventoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {inventoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="textSecondary">No inventory data available</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* PO Bar Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Purchase Orders Overview</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={poChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                      <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: theme.palette.action.hover }}
                        contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8, border: `1px solid ${theme.palette.divider}` }} 
                      />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
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
