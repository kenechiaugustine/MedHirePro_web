import type { RouteObject } from "react-router-dom";
import { WEBSITE_ROUTES } from "./routes.enum";
import HomePage from "./page";
import AboutPage from "./about/page";
import ContactPage from "./contact/page";
import ProfessionalPage from "./professional/page";
import InstitutePage from "./institute/page";
import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";
import FAQPage from "./faq/page";
import LoginPage from "./login/page";
import SignupPage from "./signup/page";

const websiteRoutes: RouteObject[] = [
    { path: WEBSITE_ROUTES.HOME, element: <HomePage /> },
    { path: WEBSITE_ROUTES.ABOUT, element: <AboutPage /> },
    { path: WEBSITE_ROUTES.CONTACT, element: <ContactPage /> },
    { path: WEBSITE_ROUTES.PROFESSIONAL, element: <ProfessionalPage /> },
    { path: WEBSITE_ROUTES.INSTITUTE, element: <InstitutePage /> },
    { path: WEBSITE_ROUTES.PRIVACY, element: <PrivacyPage /> },
    { path: WEBSITE_ROUTES.TERMS, element: <TermsPage /> },
    { path: WEBSITE_ROUTES.FAQ, element: <FAQPage /> },
    { path: WEBSITE_ROUTES.LOGIN, element: <LoginPage /> },
    { path: WEBSITE_ROUTES.SIGNUP, element: <SignupPage /> },
];

export default websiteRoutes;