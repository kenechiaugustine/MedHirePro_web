import type { RouteObject } from "react-router-dom";
import { USER_ROUTES } from "./routes.enum";
import UserDashboardPage from "./page";
import ProfessionalOnboardingPage from "./onboarding/page";
import ProfessionalJobSearchPage from "./jobs";
import ProfessionalLocumSearchPage from "./jobs/locum";
import ProfessionalPostLocumJobPage from "./jobs/post-locum";
import ProfessionalEditLocumJobPage from "./jobs/edit-locum";
import ProfessionalLocumApplicantsPage from "./jobs/applicants";
import ProfessionalJobDetailsPage from "./jobs/details";
import ProfessionalApplicationsPage from "./applications";
import UserProfilePage from "./profile/page";
import UserSettingsPage from "./settings/page";
import UserReferralsPage from "./referrals/page";

const userRoutes: RouteObject[] = [
    { path: USER_ROUTES.DASHBOARD, element: <UserDashboardPage /> },
    { path: USER_ROUTES.ONBOARDING, element: <ProfessionalOnboardingPage /> },
    { path: USER_ROUTES.JOBS, element: <ProfessionalJobSearchPage /> },
    { path: USER_ROUTES.LOCUM_JOBS, element: <ProfessionalLocumSearchPage /> },
    { path: USER_ROUTES.POST_LOCUM, element: <ProfessionalPostLocumJobPage /> },
    { path: USER_ROUTES.EDIT_LOCUM, element: <ProfessionalEditLocumJobPage /> },
    { path: USER_ROUTES.JOB_APPLICANTS, element: <ProfessionalLocumApplicantsPage /> },
    { path: USER_ROUTES.JOB_DETAILS, element: <ProfessionalJobDetailsPage /> },
    { path: USER_ROUTES.APPLICATIONS, element: <ProfessionalApplicationsPage /> },
    { path: USER_ROUTES.PROFILE, element: <UserProfilePage /> },
    { path: USER_ROUTES.SETTINGS, element: <UserSettingsPage /> },
    { path: USER_ROUTES.REFERRALS, element: <UserReferralsPage /> },
];

export default userRoutes;
