import { Link, useSearchParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import SignupAsProfessional from '../../../components/website/signup/SignupAsProfessional';
import SignupAsInstitute from '../../../components/website/signup/SignupAsInstitute';
import SignupSelection from '../../../components/website/signup/SignupSelection';
import { WEBSITE_ROUTES } from '../routes.enum';

const SignupPage = () => {
    // Read query parameters from URL
    const [searchParams] = useSearchParams();
    const signupType = searchParams.get('as');

    // Dynamically determine which component to render
    const renderContent = () => {
        switch (signupType) {
            case 'professional':
                return <SignupAsProfessional />;
            case 'institute':
                return <SignupAsInstitute />;
            default:
                // If 'as' is null or invalid, show the selection cards
                return <SignupSelection />;
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans relative overflow-hidden">

            {/* Decorative Background Blob (Bottom Right) */}
            <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none"></div>

            {/* Auth Minimal Header */}
            <header className="w-full flex justify-between items-center px-6 sm:px-10 py-6 relative z-50">

                {/* Left Side: Back Arrow (only if a type is selected) & Logo */}
                <div className="flex items-center gap-4">
                    {signupType && (
                        <Link to={WEBSITE_ROUTES.SIGNUP} className="text-slate-500 hover:text-[#0a192f] transition-colors p-2 -ml-2">
                            <HiArrowLeft className="w-5 h-5" />
                        </Link>
                    )}
                    <Link to={WEBSITE_ROUTES.HOME} className="flex items-center text-[#0d47a1] font-bold text-xl tracking-tight">
                        MedHirePro
                    </Link>
                </div>

                {/* Right Side: Login Link */}
                <div className="text-sm font-medium text-slate-500 hidden sm:block">
                    Already have an account?{' '}
                    <Link to={WEBSITE_ROUTES.LOGIN} className="text-[#0b5cd5] font-bold hover:underline ml-1">
                        Log in
                    </Link>
                </div>
                {/* Mobile Login Link */}
                <Link to={WEBSITE_ROUTES.LOGIN} className="sm:hidden text-[#0b5cd5] font-bold text-sm">
                    Log in
                </Link>
            </header>

            {/* DYNAMIC CONTENT AREA */}
            {renderContent()}

            {/* Simple Footer */}
            <footer className="w-full py-6 text-center relative z-50 mt-auto">
                <p className="text-[12px] text-slate-400 font-medium tracking-wide uppercase">
                    © {currentYear} MedHirePro — Precision Staffing for Nigerian Healthcare.
                </p>
            </footer>

        </div>
    );
};

export default SignupPage;