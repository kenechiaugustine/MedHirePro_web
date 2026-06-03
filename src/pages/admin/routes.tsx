import type { RouteObject } from "react-router-dom";
import { ADMIN_ROUTES } from "./routes.enum";
import AdminDashboardPage from "./page";
import AdminVerificationsPage from "./verifications/page";
import AdminUserManagementPage from "./users/page";
import AdminUserCreditHistoryPage from "./users/credit-history";
import AdminUserReferralsPage from "./users/referrals";
import AdminJobsPage from "./jobs/page";
import AdminLocumJobsPage from "./locum-jobs/page";
import AdminProfilePage from "./profile/page";
import AdminSettingsPage from "./settings/page";

const adminRoutes: RouteObject[] = [
    { path: ADMIN_ROUTES.DASHBOARD, element: <AdminDashboardPage /> },
    { path: ADMIN_ROUTES.VERIFICATIONS, element: <AdminVerificationsPage /> },
    { path: ADMIN_ROUTES.USERS, element: <AdminUserManagementPage /> },
    { path: ADMIN_ROUTES.USER_CREDIT_HISTORY, element: <AdminUserCreditHistoryPage /> },
    { path: ADMIN_ROUTES.USER_REFERRALS, element: <AdminUserReferralsPage /> },
    { path: ADMIN_ROUTES.JOBS, element: <AdminJobsPage /> },
    { path: ADMIN_ROUTES.LOCUM_JOBS, element: <AdminLocumJobsPage /> },
    { path: ADMIN_ROUTES.PROFILE, element: <AdminProfilePage /> },
    { path: ADMIN_ROUTES.SETTINGS, element: <AdminSettingsPage /> },
];

export default adminRoutes;
