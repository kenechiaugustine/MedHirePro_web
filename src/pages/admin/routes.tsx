import type { RouteObject } from "react-router-dom";
import { ADMIN_ROUTES } from "./routes.enum";
import AdminDashboardPage from "./page";
import AdminVerificationsPage from "./verifications/page";

const adminRoutes: RouteObject[] = [
    { path: ADMIN_ROUTES.DASHBOARD, element: <AdminDashboardPage /> },
    { path: ADMIN_ROUTES.VERIFICATIONS, element: <AdminVerificationsPage /> },
];

export default adminRoutes;
