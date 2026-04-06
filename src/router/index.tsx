import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "../pages/404";
import websiteRoutes from "../pages/website/routes";
import adminRoutes from "../pages/admin/routes";
import userRoutes from "../pages/user/routes";
import clientRoutes from "../pages/client/routes";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import UserLayout from "../layouts/UserLayout";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Website Routes */}
                {websiteRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}

                <Route path="/admin" element={<AdminLayout />}>

                    {/* Redirect to dashboard */}
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />

                    {/* Admin Routes */}
                    {adminRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                <Route path="/user" element={<UserLayout />}>

                    {/* Redirect to dashboard */}
                    <Route index element={<Navigate to="/user/dashboard" replace />} />

                    {/* User Routes */}
                    {userRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                <Route path="/client" element={<ClientLayout />}>

                    {/* Redirect to dashboard */}
                    <Route index element={<Navigate to="/client/dashboard" replace />} />

                    {/* Client Routes */}
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