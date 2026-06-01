import type { RouteObject } from "react-router-dom";
import { CLIENT_ROUTES } from "./routes.enum";
import ClientDashboardPage from "./page";
import InstituteOnboardingPage from "./onboarding/page";

const clientRoutes: RouteObject[] = [
    { path: CLIENT_ROUTES.DASHBOARD, element: <ClientDashboardPage /> },
    { path: CLIENT_ROUTES.ONBOARDING, element: <InstituteOnboardingPage /> },
];

export default clientRoutes;
