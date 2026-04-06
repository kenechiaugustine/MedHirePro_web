import type { RouteObject } from "react-router-dom";
import { CLIENT_ROUTES } from "./routes.enum";
import ClientDashboardPage from "./page";

const clientRoutes: RouteObject[] = [
    { path: CLIENT_ROUTES.DASHBOARD, element: <ClientDashboardPage /> },
];

export default clientRoutes;
