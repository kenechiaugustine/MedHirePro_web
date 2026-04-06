import type { RouteObject } from "react-router-dom";
import { USER_ROUTES } from "./routes.enum";
import UserDashboardPage from "./page";

const userRoutes: RouteObject[] = [
    { path: USER_ROUTES.DASHBOARD, element: <UserDashboardPage /> },
];

export default userRoutes;
