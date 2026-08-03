import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";

import AdminPage from "../pages/admin/DashboardPage";
import ProductsPage from "../pages/admin/ProductsPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import AddProductPage from "../pages/admin/AddProductPage";
import EditProductPage from "../pages/admin/EditProductPage";
import AddCategoryModal from "../pages/admin/AddCategoryModal";
import SalesPage from "../pages/admin/SalesPage";
import SalesHistoryPage from "../pages/admin/SalesHistoryPage";
import ReturnsPage from "../pages/admin/ReturnsPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SalesReportPage from "../pages/admin/SalesReportPage";
import ProductReportPage from "../pages/admin/ProductReportPage";
import ProfitReportPage from "../pages/admin/ProfitReportPage";
import StockReportPage from "../pages/admin/StockReportPage";
import UserProfilePage from "../pages/admin/UserProfilePage";
import POSPage from "../pages/pos/POSPage";

// 1. IMPORT YOUR POS RETURNS COMPONENT HERE
import POSReturnsPage from "../pages/pos/ReturnsPage"; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:id/:token" element={<ResetPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected Routes for All Logged-In Users */}
      <Route element={<ProtectedRoute />}>
        {/* Dynamic Entry Points: Directs 'admin' to Dashboard and 'user' to POS */}
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/dashboard" element={<RoleBasedRedirect />} />
        <Route path="/pos" element={<POSPage />} />

        {/* 2. ADD POS RETURN ROUTE HERE (Accessible by all logged-in users/cashiers) */}
        <Route path="/pos/returns" element={<POSReturnsPage />} />

        {/* Admin-Only Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/products/add" element={<AddProductPage />} />
          <Route path="/admin/products/categories" element={<CategoriesPage />} />
          <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
          <Route path="/admin/products/categories/add" element={<AddCategoryModal />} />
          <Route path="/admin/sales" element={<SalesPage />} />
          <Route path="/admin/sales/history" element={<SalesHistoryPage />} />
          <Route path="/admin/sales/returns" element={<ReturnsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/reports/sales" element={<SalesReportPage />} />
          <Route path="/admin/reports/products" element={<ProductReportPage />} />
          <Route path="/admin/reports/profit" element={<ProfitReportPage />} />
          <Route path="/admin/reports/stock" element={<StockReportPage />} />
          <Route path="/admin/user" element={<UserProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all MUST BE LAST */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;