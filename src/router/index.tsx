import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "../pages/404";
import websiteRoutes from "../pages/website/routes";
import adminRoutes from "../pages/admin/routes";
import userRoutes from "../pages/user/routes";
import clientRoutes from "../pages/client/routes";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Website Routes */}
                {websiteRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}

                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    {adminRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                <Route path="/user" element={
                    <ProtectedRoute allowedRoles={['professional']}>
                        <UserLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/user/dashboard" replace />} />
                    {userRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                <Route path="/client" element={
                    <ProtectedRoute allowedRoles={['institute']}>
                        <ClientLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/client/dashboard" replace />} />
                    {clientRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}