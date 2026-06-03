import type { RouteObject } from "react-router-dom";
import { CLIENT_ROUTES } from "./routes.enum";
import ClientDashboardPage from "./page";
import InstituteOnboardingPage from "./onboarding/page";
import ClientJobListingsPage from "./jobs/page";
import PostPermanentJobPage from "./jobs/post-permanent";
import PostLocumJobPage from "./jobs/post-locum";
import ClientJobDetailsPage from "./jobs/details";
import EditJobPage from "./jobs/edit";
import ClientApplicantsPage from "./applicants/page";
import ClientProfilePage from "./profile/page";
import ClientSettingsPage from "./settings/page";

const clientRoutes: RouteObject[] = [
    { path: CLIENT_ROUTES.DASHBOARD, element: <ClientDashboardPage /> },
    { path: CLIENT_ROUTES.ONBOARDING, element: <InstituteOnboardingPage /> },
    { path: CLIENT_ROUTES.JOBS, element: <ClientJobListingsPage /> },
    { path: CLIENT_ROUTES.POST_PERMANENT, element: <PostPermanentJobPage /> },
    { path: CLIENT_ROUTES.POST_LOCUM, element: <PostLocumJobPage /> },
    { path: CLIENT_ROUTES.DETAILS, element: <ClientJobDetailsPage /> },
    { path: CLIENT_ROUTES.EDIT, element: <EditJobPage /> },
    { path: CLIENT_ROUTES.APPLICANTS, element: <ClientApplicantsPage /> },
    { path: CLIENT_ROUTES.PROFILE, element: <ClientProfilePage /> },
    { path: CLIENT_ROUTES.SETTINGS, element: <ClientSettingsPage /> },
];

export default clientRoutes;
