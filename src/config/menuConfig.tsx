import type { SvgIconComponent } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CategoryIcon from "@mui/icons-material/Category";

export type UserRole = "ADMIN" | "MANAGER" | "USER";

export interface MenuItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
  roles: UserRole[];
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
    roles: ["ADMIN", "MANAGER", "USER"],
  },

  {
    label: "Users",
    path: "/users",
    icon: PeopleIcon,
    roles: ["ADMIN"],
  },

  {
    label: "Inventory",
    path: "/inventory",
    icon: InventoryIcon,
    roles: ["ADMIN", "MANAGER", "USER"],
  },

  {
    label: "Vendors",
    path: "/vendors",
    icon: BusinessIcon,
    roles: ["ADMIN", "MANAGER", "USER"],
  },

  {
    label: "Purchase Orders",
    path: "/purchase-orders",
    icon: ShoppingCartIcon,
    roles: ["ADMIN", "MANAGER", "USER"],
  },

  {
    label: "Goods Receipts",
    path: "/goods-receipts",
    icon: ReceiptIcon,
    roles: ["ADMIN", "MANAGER", "USER"],
  },

  {
    label: "Category",
    path: "/category",
    icon: CategoryIcon,
    roles: ["ADMIN", "MANAGER", "USER"],
  },
];
