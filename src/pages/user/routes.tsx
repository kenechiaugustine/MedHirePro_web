import type { RouteObject } from "react-router-dom";
import { USER_ROUTES } from "./routes.enum";
import UserDashboardPage from "./page";
import ProfessionalOnboardingPage from "./onboarding/page";
import ProfessionalJobSearchPage from "./jobs";
import ProfessionalLocumSearchPage from "./jobs/locum";
import ProfessionalJobDetailsPage from "./jobs/details";
import ProfessionalApplicationsPage from "./applications";

const userRoutes: RouteObject[] = [
    { path: USER_ROUTES.DASHBOARD, element: <UserDashboardPage /> },
    { path: USER_ROUTES.ONBOARDING, element: <ProfessionalOnboardingPage /> },
    { path: USER_ROUTES.JOBS, element: <ProfessionalJobSearchPage /> },
    { path: USER_ROUTES.LOCUM_JOBS, element: <ProfessionalLocumSearchPage /> },
    { path: USER_ROUTES.JOB_DETAILS, element: <ProfessionalJobDetailsPage /> },
    { path: USER_ROUTES.APPLICATIONS, element: <ProfessionalApplicationsPage /> },
];

export default userRoutes;
