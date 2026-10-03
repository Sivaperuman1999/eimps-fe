import * as React from "react";
import { styled, useTheme, type Theme, type CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  InputBase
} from "@mui/material";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { menuItems, type UserRole } from "../config/menuConfig";

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#0B3A66",
  color: "#FFFFFF",
  borderRight: "none",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  backgroundColor: "#0B3A66",
  color: "#FFFFFF",
  borderRight: "none",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#FFFFFF",
  color: "#1F2937",
  boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  backgroundColor: "#F3F4F6",
  '&:hover': {
    backgroundColor: "#E5E7EB",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: "#9CA3AF"
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = React.useState(true);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const userRole: UserRole | undefined = user?.role
    ?.toString()
    .trim()
    .toUpperCase() as UserRole | undefined;

  const visibleMenuItems = userRole
    ? menuItems.filter((item) => item.roles.includes(userRole))
    : [];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login", { replace: true });
  };

  const isMenuActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, color: "#1F2937" }}
          >
            <MenuIcon />
          </IconButton>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search anything..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton color="inherit" sx={{ mr: 2, color: "#6B7280" }}>
            <NotificationsNoneIcon />
          </IconButton>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", mr: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937", lineHeight: 1 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  {user.role}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, gap: 1 }}>
            <BusinessCenterIcon fontSize="large" sx={{ color: '#42A5F5' }} />
            {open && (
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                EIMPS
              </Typography>
            )}
          </Box>
        </DrawerHeader>
        
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography variant="overline" sx={{ color: '#94A3B8', opacity: open ? 1 : 0, display: open ? 'block' : 'none' }}>
            Menu
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isMenuActive(item.path);

            return (
              <ListItem key={item.path} disablePadding sx={{ display: "block", mb: 1 }}>
                <Tooltip title={open ? "" : item.label} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 44,
                      justifyContent: open ? "initial" : "center",
                      px: open ? 2 : 1,
                      borderRadius: 2,
                      color: active ? "#FFFFFF" : "#94A3B8",
                      backgroundColor: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                        color: active ? "#42A5F5" : "inherit",
                      }}
                    >
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: { fontSize: "0.9rem", fontWeight: active ? 600 : 500 } } }}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
