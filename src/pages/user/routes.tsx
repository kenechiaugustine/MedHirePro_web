import type { RouteObject } from "react-router-dom";
import { USER_ROUTES } from "./routes.enum";
import UserDashboardPage from "./page";
import ProfessionalOnboardingPage from "./onboarding/page";

const userRoutes: RouteObject[] = [
    { path: USER_ROUTES.DASHBOARD, element: <UserDashboardPage /> },
    { path: USER_ROUTES.ONBOARDING, element: <ProfessionalOnboardingPage /> },
];

export default userRoutes;
