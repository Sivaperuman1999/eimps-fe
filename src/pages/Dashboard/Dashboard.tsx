import { Box, Typography, Paper } from "@mui/material";

function Dashboard() {
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

      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <Typography variant="h6" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
          Welcome to EIMPS Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 1 }}>
          (No dashboard metrics are currently configured in the API)
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;
