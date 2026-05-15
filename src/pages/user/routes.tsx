import type { RouteObject } from "react-router-dom";
import { USER_ROUTES } from "./routes.enum";
import UserDashboardPage from "./dashboard/page";
import VerificationPage from "./verification/page";
import JobSearchPage from "./job-search/page";
import ApplicationsPage from "./applications/page";
import ProfilePage from "./profile/page";
import SettingsPage from "./settings/page";
import NotificationsPage from "./notifications/page";

const userRoutes: RouteObject[] = [
    { path: USER_ROUTES.DASHBOARD, element: <UserDashboardPage /> },
    { path: USER_ROUTES.VERIFICATION, element: <VerificationPage /> },
    { path: USER_ROUTES.JOB_SEARCH, element: <JobSearchPage /> },
    { path: USER_ROUTES.APPLICATIONS, element: <ApplicationsPage /> },
    { path: USER_ROUTES.PROFILE, element: <ProfilePage /> },
    { path: USER_ROUTES.SETTINGS, element: <SettingsPage /> },
    { path: USER_ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
];

export default userRoutes;
