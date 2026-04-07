import { Link } from "react-router-dom";
import { WEBSITE_ROUTES } from "./website/routes.enum";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            {/* Subtle background grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative z-10 text-center max-w-md">
                {/* Status code */}
                <p className="text-8xl font-bold text-blue-600 leading-none select-none">
                    404
                </p>

                {/* Divider */}
                <div className="mt-4 mb-6 h-px w-12 bg-slate-200 mx-auto" />

                {/* Heading */}
                <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                    Page not found
                </h1>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    The page you're looking for doesn't exist or may have been moved.
                    Double-check the URL and try again.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to={WEBSITE_ROUTES.HOME}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        to={WEBSITE_ROUTES.CONTACT}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}