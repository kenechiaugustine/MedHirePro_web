import { useGetMeQuery } from "../../redux/apis/userApi";
import { useGetOnboardingStatusQuery } from "../../redux/apis/onboardingApi";
import { useGetMyApplicationsQuery } from "../../redux/apis/applicationsApi";
import { useGetJobListingsQuery } from "../../redux/apis/jobsApi";
import { Link } from "react-router-dom";
import { 
    FiAward, 
    FiClock, 
    FiCreditCard, 
    FiGrid, 
    FiAlertCircle,
    FiBriefcase,
    FiFileText,
    FiCheckCircle,
    FiChevronRight,
    FiLoader
} from "react-icons/fi";

export default function UserDashboardPage() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const { data: onboarding, isLoading: isOnboardingLoading } = useGetOnboardingStatusQuery();
    const { data: myApps, isLoading: isAppsLoading } = useGetMyApplicationsQuery();
    const { data: jobs, isLoading: isJobsLoading } = useGetJobListingsQuery();

    const isLoading = isUserLoading || isOnboardingLoading || isAppsLoading || isJobsLoading;

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading clinician dashboard...</p>
                </div>
            </div>
        );
    }

    // Counters calculations
    const totalApps = myApps?.length || 0;
    const pendingApps = myApps?.filter(a => a.application_status === 'SUBMITTED' || a.application_status === 'CREDENTIALING_REVIEW').length || 0;
    const acceptedApps = myApps?.filter(a => a.application_status === 'ACCEPTED').length || 0;

    // Filter recommended jobs matching the user's specialty
    const userSpecialty = user?.specialty;
    const recommendedJobs = jobs 
        ? jobs.filter(job => job.status === 'OPEN' && (!userSpecialty || job.clinical_specialty === userSpecialty)).slice(0, 4)
        : [];
    
    // Fallback if no exact specialty matches
    const displayJobs = recommendedJobs.length > 0 
        ? recommendedJobs 
        : (jobs ? jobs.filter(job => job.status === 'OPEN').slice(0, 4) : []);

    const latestApplications = myApps ? [...myApps].slice(-4).reverse() : [];

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
                                    ? 'Professional Dossier Under Compliance Audit' 
                                    : onboarding?.onboarding_status === 'rejected'
                                    ? 'Onboarding Documents Audit Flagged'
                                    : 'Complete Your Professional Dossier Verification'
                                }
                            </h4>
                            <p className="text-xs font-medium opacity-90 leading-relaxed max-w-xl">
                                {onboarding?.onboarding_status === 'pending' 
                                    ? 'We are currently auditing your clinical certificates. Verified profiles gain premium index matching and priority placements.' 
                                    : onboarding?.onboarding_status === 'rejected'
                                    ? `Audit Flagged: ${onboarding?.submission?.rejection_reason || 'Certificate mismatch'}. Please correct your documentation.`
                                    : 'Your practitioner profile is currently unverified. Upload your clinical license and background check certificates to unlock job applications.'
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
                            ? 'Track Progress' 
                            : onboarding?.onboarding_status === 'rejected'
                            ? 'Update Credentials'
                            : 'Verify Profile'
                        }
                    </Link>
                </div>
            )}

            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-12 translate-x-6">
                    <FiGrid className="w-96 h-96" />
                </div>

                <div className="relative z-10 max-w-xl space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-blue-100 text-xs font-semibold backdrop-blur-md">
                        <FiAward className="w-3.5 h-3.5" /> Licensed Practitioner
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                        Practitioner Match Console
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm leading-relaxed font-medium">
                        Your professional status is currently active. Search premium vacancies or verify your credentials to boost your profile index.
                    </p>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Credit Balance */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                        <span className="text-2xl font-black text-slate-800 block">₦{(user?.credit_balance ?? 0) * 100}</span>
                        <div className="text-[10px] text-blue-600 font-extrabold">
                            {user?.credit_balance ?? 0} Credits Available
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                        <FiCreditCard />
                    </div>
                </div>

                {/* Applications Count */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Submitted Applications</span>
                        <span className="text-3xl font-black text-slate-800 block">{totalApps}</span>
                        <div className="text-[10px] text-slate-400 font-semibold">
                            <span className="text-amber-600 font-extrabold">{pendingApps}</span> Under Review
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                        <FiFileText />
                    </div>
                </div>

                {/* Approved / Placed Shifts */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Approved Placements</span>
                        <span className="text-3xl font-black text-slate-800 block">{acceptedApps}</span>
                        <div className="text-[10px] text-slate-400 font-semibold">
                            Hired vacancies
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                        <FiCheckCircle />
                    </div>
                </div>

                {/* Onboarding Rank */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Registry Profile</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded uppercase block mt-1.5 w-fit ${
                            onboarding?.onboarding_status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                            : onboarding?.onboarding_status === 'pending'
                            ? 'bg-blue-50 text-blue-700 border border-blue-150 animate-pulse'
                            : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                            {onboarding?.onboarding_status || 'not_started'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold">
                            Verification Dossier Status
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center text-lg">
                        <FiClock />
                    </div>
                </div>
            </div>

            {/* Split data panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* My Applications */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FiFileText className="text-blue-600" /> Recent Job Applications
                        </h3>
                        <Link to="/user/applications" className="text-[10px] font-black text-blue-600 hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                    <th className="px-6 py-3">Job Opening</th>
                                    <th className="px-6 py-3">Applied</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {latestApplications.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-slate-400 font-medium">
                                            You haven't submitted any job applications yet.
                                        </td>
                                    </tr>
                                ) : (
                                    latestApplications.map((app) => {
                                        const job = typeof app.vacancy_id === 'object' ? app.vacancy_id : null;
                                        return (
                                            <tr key={app._id} className="hover:bg-slate-50/40 font-medium text-slate-700">
                                                <td className="px-6 py-3.5">
                                                    <div className="font-extrabold text-slate-800 truncate max-w-[200px]">
                                                        {job ? job.position_title : "Clinical Position"}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                                        {job ? job.clinical_specialty : "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-400 font-bold text-[10px]">
                                                    {new Date(app.created_at || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                        app.application_status === 'ACCEPTED' 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                                                        : app.application_status === 'DECLINED'
                                                        ? 'bg-red-50 text-red-700 border border-red-150'
                                                        : 'bg-blue-50 text-blue-700 border border-blue-150 animate-pulse'
                                                    }`}>
                                                        {app.application_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FiBriefcase className="text-blue-600" /> Matches For Your Specialty
                        </h3>
                        <Link to="/user/jobs" className="text-[10px] font-black text-blue-600 hover:underline">
                            Search Jobs
                        </Link>
                    </div>

                    <div className="space-y-3.5">
                        {displayJobs.length === 0 ? (
                            <p className="text-center py-8 text-slate-400 font-medium text-xs">
                                No active matching clinical openings found.
                            </p>
                        ) : (
                            displayJobs.map((job) => (
                                <Link 
                                    to={`/user/jobs/view/${job._id}`}
                                    key={job._id} 
                                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all group cursor-pointer"
                                >
                                    <div className="overflow-hidden space-y-0.5">
                                        <h4 className="font-extrabold text-slate-800 text-xs truncate group-hover:text-blue-650 transition-colors">
                                            {job.position_title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-semibold truncate">
                                            {job.clinical_specialty} • {job.clinical_setting}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-slate-50 px-2 py-0.5 border border-slate-150 rounded group-hover:bg-blue-50 group-hover:border-blue-150">
                                            {job.job_type}
                                        </span>
                                        <FiChevronRight />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}