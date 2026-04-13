import type { RouteObject } from "react-router-dom";
import { ADMIN_ROUTES } from "./routes.enum";
import AdminDashboardPage from "./page";

const adminRoutes: RouteObject[] = [
    { path: ADMIN_ROUTES.DASHBOARD, element: <AdminDashboardPage /> },
];

export default adminRoutes;
