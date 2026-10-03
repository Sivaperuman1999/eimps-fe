import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./compnents/Login";

import ForgotPassword from "./compnents/Forgotpawoord";

import VerifyResetOtp from "./compnents/VerifyResetOtp";

import ResetPassword from "./compnents/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";

import PublicRoute from "./PublicRoute";

import RoleRoute from "./RoleRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import Layout from "./compnents/Layout";
import Users from "./pages/User/Users";
import Inventory from "./pages/Inventory/Inventory";
import Vendor from "./pages/Vendor/Vendor";
import PurchaseOrder from "./pages/PurchaseOrder/PurchaseOrder";
import GoodsReceipt from "./pages/GoodsReceipt/GoodsReceipt";
import { Category } from "./pages/Category/Category";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />

          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/users" element={<Users />} />
            </Route>

            <Route path="/inventory" element={<Inventory />} />

            <Route path="/vendors" element={<Vendor />} />

            <Route path="/purchase-orders" element={<PurchaseOrder />} />

            <Route path="/goods-receipts" element={<GoodsReceipt />} />
            <Route path="/category" element={<Category />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
