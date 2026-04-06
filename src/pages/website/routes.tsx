import type { RouteObject } from "react-router-dom";
import { WEBSITE_ROUTES } from "./routes.enum";
import HomePage from "./page";
import AboutPage from "./about/page";
import ContactPage from "./contact/page";

const websiteRoutes: RouteObject[] = [
    { path: WEBSITE_ROUTES.HOME, element: <HomePage /> },
    { path: WEBSITE_ROUTES.ABOUT, element: <AboutPage /> },
    { path: WEBSITE_ROUTES.CONTACT, element: <ContactPage /> },
];

export default websiteRoutes;