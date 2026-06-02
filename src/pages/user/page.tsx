import { useGetMeQuery } from "../../redux/apis/userApi";
import { useGetOnboardingStatusQuery } from "../../redux/apis/onboardingApi";
import { Avatar } from "../../components/app";
import { Link } from "react-router-dom";
import { 
    FiUser, 
    FiAward, 
    FiClock, 
    FiCreditCard, 
    FiGrid, 
    FiAlertCircle 
} from "react-icons/fi";

export default function UserDashboardPage() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const { data: onboarding, isLoading: isOnboardingLoading } = useGetOnboardingStatusQuery();

    const isLoading = isUserLoading || isOnboardingLoading;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-slate-500 font-medium text-xs">Loading profile metrics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn duration-300">
            {/* Onboarding Verification Action Banner */}
            {onboarding?.onboarding_status !== 'approved' && (
                <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                    onboarding?.onboarding_status === 'pending' 
                    ? 'bg-blue-50 border-blue-200 text-blue-800' 
                    : onboarding?.onboarding_status === 'rejected'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                            onboarding?.onboarding_status === 'pending' 
                            ? 'bg-blue-100 text-blue-600' 
                            : onboarding?.onboarding_status === 'rejected'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                            <FiAlertCircle />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-extrabold text-sm">
                                {onboarding?.onboarding_status === 'pending' 
                                    ? 'Dossier Under Review' 
                                    : onboarding?.onboarding_status === 'rejected'
                                    ? 'Verification Flagged & Rejected'
                                    : 'Complete Your Professional Verification'
                                }
                            </h4>
                            <p className="text-xs font-medium opacity-90 leading-relaxed max-w-xl">
                                {onboarding?.onboarding_status === 'pending' 
                                    ? 'We are currently auditing your clinical certificates. Verified profiles gain premium index matching and priority placements.' 
                                    : onboarding?.onboarding_status === 'rejected'
                                    ? `Audit rejected: ${onboarding?.submission?.rejection_reason || 'Flagged credentials'}. Please edit and re-upload correct licenses.`
                                    : 'You are currently unverified. Submit your academic transcripts and medical practice licenses to activate placement matching.'
                                }
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/user/onboarding"
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all hover:-translate-y-0.5 active:translate-y-0 text-center flex-shrink-0 ${
                            onboarding?.onboarding_status === 'pending' 
                            ? 'bg-blue-600 text-white shadow-blue-500/10 hover:bg-blue-700' 
                            : onboarding?.onboarding_status === 'rejected'
                            ? 'bg-red-600 text-white shadow-red-500/10 hover:bg-red-700'
                            : 'bg-amber-600 text-white shadow-amber-500/10 hover:bg-amber-700'
                        }`}
                    >
                        {onboarding?.onboarding_status === 'pending' 
                            ? 'Track Submission' 
                            : onboarding?.onboarding_status === 'rejected'
                            ? 'Correct Dossier'
                            : 'Start Verification'
                        }
                    </Link>
                </div>
            )}

            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-2xl p-8 text-white shadow-lg">
                {/* Decorative overlay background */}
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-12 translate-x-6">
                    <FiGrid className="w-96 h-96" />
                </div>

                <div className="relative z-10 max-w-xl space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sky-100 text-xs font-semibold backdrop-blur-md">
                        <FiAward className="w-3.5 h-3.5" /> Certified Clinician Network
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Welcome back, {user?.full_name || "Professional"}!
                    </h1>
                    <p className="text-blue-100 text-sm leading-relaxed font-medium">
                        Your professional status is currently active. Search premium vacancies or verify your credentials to boost your profile index.
                    </p>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Credit Balance */}
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <FiCreditCard />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">
                            Credit Balance
                        </span>
                        <span className="text-2xl font-black text-slate-800">
                            {user?.credit_balance ?? 0}
                        </span>
                        <span className="text-xs text-blue-600 font-bold ml-1.5">
                            (₦{(user?.credit_balance ?? 0) * 100})
                        </span>
                    </div>
                </div>

                {/* Card 2: Specialty Label */}
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                        <FiUser />
                    </div>
                    <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">
                            Specialty
                        </span>
                        <span className="text-lg font-extrabold text-slate-800 block truncate">
                            {user?.specialty || "General Medical Practitioner"}
                        </span>
                    </div>
                </div>

                {/* Card 3: Account Status */}
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                        onboarding?.onboarding_status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : onboarding?.onboarding_status === 'pending'
                        ? 'bg-blue-50 text-blue-600'
                        : onboarding?.onboarding_status === 'rejected'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-slate-50 text-slate-500'
                    }`}>
                        <FiClock />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">
                            Account Integrity
                        </span>
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border inline-block mt-0.5 ${
                            onboarding?.onboarding_status === 'approved' 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200/50' 
                            : onboarding?.onboarding_status === 'pending'
                            ? 'text-blue-700 bg-blue-50 border-blue-200/50 animate-pulse'
                            : onboarding?.onboarding_status === 'rejected'
                            ? 'text-red-700 bg-red-50 border-red-200/50'
                            : 'text-slate-600 bg-slate-50 border-slate-200/50'
                        }`}>
                            {onboarding?.onboarding_status === 'approved' 
                                ? 'Verified Clinician' 
                                : onboarding?.onboarding_status === 'pending'
                                ? 'Review In Progress'
                                : onboarding?.onboarding_status === 'rejected'
                                ? 'Review Flagged'
                                : 'Credentials Missing'
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Details Panel */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                        Clinician Credentials Dossier
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400">
                        UID: {user?._id}
                    </span>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Large Avatar */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <Avatar 
                            name={user?.full_name} 
                            avatarUrl={user?.avatar_url} 
                            size="lg" 
                            role="professional" 
                        />
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            Professional Account
                        </span>
                    </div>

                    {/* Form-like profile display */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full text-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Full Registered Name
                            </span>
                            <p className="font-extrabold text-slate-800 bg-slate-50/60 border border-slate-100 rounded-lg p-3">
                                {user?.full_name || "N/A"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Email Address
                            </span>
                            <p className="font-extrabold text-slate-800 bg-slate-50/60 border border-slate-100 rounded-lg p-3 truncate">
                                {user?.email}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Professional Specialty
                            </span>
                            <p className="font-extrabold text-slate-800 bg-slate-50/60 border border-slate-100 rounded-lg p-3">
                                {user?.specialty || "General Medical Practitioner"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Daily Credits Cap limit
                            </span>
                            <div className="flex items-center justify-between font-extrabold text-slate-800 bg-slate-50/60 border border-slate-100 rounded-lg p-3">
                                <span>{user?.daily_credit_cap ?? 5} Credits / Day</span>
                                <FiAlertCircle className="text-blue-500 text-base" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}