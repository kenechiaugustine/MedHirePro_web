import { Link } from "react-router-dom";
import { WEBSITE_ROUTES } from "./website/routes.enum";
import Navbar from "../components/website/Navbar";
import Footer from "../components/website/Footer";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-24 pb-12">
                <div className="container mx-auto px-4 text-center max-w-lg">
                    <p className="text-7xl font-bold tracking-tight text-gray-200 mb-4 select-none">
                        404
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Page not found
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        The page you are looking for doesn't exist or has been moved.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to={WEBSITE_ROUTES.HOME}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Return to Home
                        </Link>
                        <Link
                            to={WEBSITE_ROUTES.CONTACT}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}