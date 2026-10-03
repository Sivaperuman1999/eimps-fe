import * as React from "react";

import {
  styled,
  useTheme,
  type Theme,
  type CSSObject,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { menuItems, type UserRole } from "../config/menuConfig";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.enteringScreen,
  }),

  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.leavingScreen,
  }),

  overflowX: "hidden",

  width: `calc(${theme.spacing(7)} + 1px)`,

  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",

  alignItems: "center",

  justifyContent: "flex-end",

  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(true && {
    "&.MuiAppBar-root": {
      backgroundColor: "#1976D2",
    },
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,

  flexShrink: 0,

  whiteSpace: "nowrap",

  boxSizing: "border-box",

  ...(true && {
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
    },
  }),
}));

function Layout() {
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = React.useState(true);
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

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const isMenuActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",

          marginLeft: open ? `${drawerWidth}px` : 0,

          transition: "all 0.2s",
        }}
      >
        <Toolbar>
          {!open && (
            <IconButton
              color="inherit"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
            }}
          >
            EIPMS
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
            }}
          />

          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                {user.name}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                }}
              >
                ({user.role})
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 65,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 65,
            transition: "width 0.2s",
            overflowX: "hidden",
            boxSizing: "border-box",
            borderRight: "1px solid #E0E0E0",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <DrawerHeader>
          {open && (
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                ml: 1,
                fontWeight: 700,
                color: "#1976D2",
              }}
            >
              EIPMS
            </Typography>
          )}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List
          sx={{
            px: 0.5,
            pt: 1,
          }}
        >
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isMenuActive(item.path);

            return (
              <ListItem
                key={item.path}
                disablePadding
                sx={{
                  display: "block",
                  mb: 0.5,
                }}
              >
                <Tooltip title={open ? "" : item.label} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      mx: 0.5,
                      borderRadius: 1.5,
                      justifyContent: open ? "initial" : "center",
                      color: active ? "#1976D2" : "#555",
                      backgroundColor: active ? "#E3F2FD" : "transparent",
                      "&:hover": {
                        backgroundColor: "#E3F2FD",
                        color: "#1976D2",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: "center",
                        color: active ? "#1976D2" : "#555",

                        mr: open ? 3 : "auto",
                      }}
                    >
                      <Icon />
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: open ? 1 : 0,
                        whiteSpace: "nowrap",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Box
          sx={{
            flexGrow: 1,
          }}
        />
        <Divider />
        <List>

          <ListItem disablePadding>
            <Tooltip title={open ? "" : "Logout"} placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  mx: 0.5,
                  borderRadius: 1.5,
                  justifyContent: open ? "initial" : "center",
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "#FFEBEE",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    color: "error.main",
                    mr: open ? 3 : "auto",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,

          minHeight: "100vh",

          backgroundColor: "#F5F7FA",

          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
