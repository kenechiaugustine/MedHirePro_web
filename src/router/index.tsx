import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NotFound from "../pages/404";
import websiteRoutes from "../pages/website/routes";
import adminRoutes from "../pages/admin/routes";
import userRoutes from "../pages/user/routes";
import clientRoutes from "../pages/client/routes";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import GuestRoute from "../components/guards/GuestRoute";
import { WEBSITE_ROUTES } from "../pages/website/routes.enum";

export default function AppRouter() {
    // Identify which website routes need the GuestRoute guard (auth pages)
    const guestPaths = [WEBSITE_ROUTES.LOGIN, WEBSITE_ROUTES.SIGNUP];

    return (
        <Router>
            <Routes>
                {/* Website Routes — login/signup wrapped with GuestRoute */}
                {websiteRoutes.map((route) => {
                    const isGuestRoute = guestPaths.includes(route.path as string);
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                isGuestRoute ? (
                                    <GuestRoute>{route.element}</GuestRoute>
                                ) : (
                                    route.element
                                )
                            }
                        />
                    );
                })}

                {/* User (Professional) Routes — requires 'professional' role */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={['professional']}>
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Redirect to dashboard */}
                    <Route index element={<Navigate to="/user/dashboard" replace />} />

                    {/* User Routes */}
                    {userRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                {/* Client (Institute) Routes — requires 'institute' role */}
                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={['institute']}>
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Redirect to dashboard */}
                    <Route index element={<Navigate to="/client/dashboard" replace />} />

                    {/* Client Routes */}
                    {clientRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                {/* Admin Routes — requires 'admin' role */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Redirect to dashboard */}
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />

                    {/* Admin Routes */}
                    {adminRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}