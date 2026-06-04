import { useGetMeQuery } from "../../redux/apis/userApi";
import { useGetOnboardingStatusQuery } from "../../redux/apis/onboardingApi";
import { useGetMyJobListingsQuery } from "../../redux/apis/jobsApi";
import { useGetApplicationsQuery } from "../../redux/apis/applicationsApi";
import { Link } from "react-router-dom";
import {
    FiAward,
    FiShield,
    FiCreditCard,
    FiLayers,
    FiAlertCircle,
    FiBriefcase,
    FiFileText,
    FiLoader
} from "react-icons/fi";

export default function ClientDashboardPage() {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();
    const { data: onboarding, isLoading: isOnboardingLoading } = useGetOnboardingStatusQuery();
    const { data: myListings, isLoading: isListingsLoading } = useGetMyJobListingsQuery();
    const { data: applications, isLoading: isAppsLoading } = useGetApplicationsQuery();

    const isLoading = isUserLoading || isOnboardingLoading || isListingsLoading || isAppsLoading;

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading institutional metrics...</p>
                </div>
            </div>
        );
    }

    // Counters calculations
    const totalListings = myListings?.length || 0;
    const permanentJobs = myListings?.filter(j => j.job_type === 'PERMANENT').length || 0;
    const locumShifts = myListings?.filter(j => j.job_type === 'LOCUM').length || 0;

    const totalApps = applications?.length || 0;
    const pendingApps = applications?.filter(a => a.application_status === 'SUBMITTED' || a.application_status === 'CREDENTIALING_REVIEW').length || 0;
    const shortlistedApps = applications?.filter(a => a.is_shortlisted).length || 0;

    // Latest items
    const latestListings = myListings ? [...myListings].slice(-5).reverse() : [];
    const latestApplications = applications ? [...applications].slice(-5).reverse() : [];

    return (
        <div className="space-y-8 animate-fadeIn duration-300">
            {/* Onboarding Verification Action Banner */}
            {onboarding?.onboarding_status !== 'approved' && (
                <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${onboarding?.onboarding_status === 'pending'
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : onboarding?.onboarding_status === 'rejected'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${onboarding?.onboarding_status === 'pending'
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
                                    ? 'Corporate Dossier Under Audit'
                                    : onboarding?.onboarding_status === 'rejected'
                                        ? 'Corporate Verification Rejected'
                                        : 'Verify Your Institutional Facility Credentials'
                                }
                            </h4>
                            <p className="text-xs font-medium opacity-90 leading-relaxed max-w-xl">
                                {onboarding?.onboarding_status === 'pending'
                                    ? 'Our compliance registry is auditing your healthcare corporate credentials. Verified entities gain listing authority and campaign promotion priority.'
                                    : onboarding?.onboarding_status === 'rejected'
                                        ? `Compliance Audit Rejected: ${onboarding?.submission?.rejection_reason || 'Flagged credentials'}. Please edit and re-upload correct business documents.`
                                        : 'Your healthcare institution is currently unverified. Submit your facility licenses and corporate registration certificates to unlock listing campaigns.'
                                }
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/client/onboarding"
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all hover:-translate-y-0.5 active:translate-y-0 text-center flex-shrink-0 ${onboarding?.onboarding_status === 'pending'
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
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-500 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-12 translate-x-6">
                    <FiLayers className="w-96 h-96" />
                </div>

                <div className="relative z-10 max-w-xl space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-semibold backdrop-blur-md">
                        <FiAward className="w-3.5 h-3.5" /> Premium Recruiting Partner
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                        Recruiter Control Console
                    </h1>
                    <p className="text-indigo-100 text-xs md:text-sm leading-relaxed font-medium">
                        Deploy your recruiting campaigns immediately. Acquire clinicians, check credentials, or purchase hiring credits to post more openings.
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Recruiter Balance */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                        <span className="text-2xl font-black text-slate-800 block">{user?.credit_balance ?? 0} Credits</span>
                        <div className="text-[10px] text-indigo-600 font-extrabold">
                            {user?.credit_balance ?? 0} Credits Available
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                        <FiCreditCard />
                    </div>
                </div>

                {/* Job Listings Count */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Job Listings</span>
                        <span className="text-3xl font-black text-slate-800 block">{totalListings}</span>
                        <div className="text-[10px] text-slate-400 font-semibold">
                            <span className="text-indigo-600 font-extrabold">{permanentJobs}</span> Perm / <span className="text-purple-600 font-extrabold">{locumShifts}</span> Locums
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                        <FiBriefcase />
                    </div>
                </div>

                {/* Received Applications */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Applications</span>
                        <span className="text-3xl font-black text-slate-800 block">{totalApps}</span>
                        <div className="text-[10px] text-slate-400 font-semibold">
                            <span className="text-amber-600 font-extrabold">{pendingApps}</span> New / <span className="text-emerald-600 font-extrabold">{shortlistedApps}</span> Shortlisted
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                        <FiFileText />
                    </div>
                </div>

                {/* Verification Level */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Verification</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded uppercase block mt-1.5 w-fit ${onboarding?.onboarding_status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                                : onboarding?.onboarding_status === 'pending'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-150 animate-pulse'
                                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                            {onboarding?.onboarding_status || 'not_started'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold">
                            Registry Audit Rank
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center text-lg">
                        <FiShield />
                    </div>
                </div>
            </div>

            {/* Split workspace data panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent job campaigns */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FiBriefcase className="text-indigo-650" /> Active Hiring Campaigns
                        </h3>
                        <div className="flex gap-2">
                            <Link to="/client/jobs" className="text-[10px] font-black text-indigo-650 hover:underline">
                                View Openings
                            </Link>
                        </div>
                    </div>

                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                    <th className="px-6 py-3">Vacancy</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Setting</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {latestListings.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">
                                            No active job campaigns posted.
                                        </td>
                                    </tr>
                                ) : (
                                    latestListings.map((job) => (
                                        <tr key={job._id} className="hover:bg-slate-50/40 font-medium text-slate-700">
                                            <td className="px-6 py-3.5">
                                                <div className="font-extrabold text-slate-800 truncate max-w-[170px]">
                                                    {job.position_title}
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                                    {job.clinical_specialty}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${job.job_type === 'PERMANENT'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-150'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-150'
                                                    }`}>
                                                    {job.job_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-500 font-semibold truncate max-w-[100px]">
                                                {job.clinical_setting}
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${job.status === 'OPEN'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                                                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent applications */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FiFileText className="text-indigo-650" /> Candidate Applications
                        </h3>
                        <Link to="/client/applicants" className="text-[10px] font-black text-indigo-650 hover:underline">
                            View Applicants
                        </Link>
                    </div>

                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                    <th className="px-6 py-3">Applicant Ref</th>
                                    <th className="px-6 py-3">Candidate ID</th>
                                    <th className="px-6 py-3">Applied</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {latestApplications.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">
                                            No clinician applications received yet.
                                        </td>
                                    </tr>
                                ) : (
                                    latestApplications.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50/40 font-medium text-slate-700">
                                            <td className="px-6 py-3.5">
                                                <div className="font-extrabold text-slate-800">
                                                    Practitioner Ref: #{app._id.slice(-6).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-500 font-semibold truncate max-w-[150px]">
                                                {app.candidate_id}
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-450 font-bold text-[10px]">
                                                {new Date(app.created_at || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${app.application_status === 'ACCEPTED'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                                                        : app.application_status === 'DECLINED'
                                                            ? 'bg-red-50 text-red-700 border border-red-150'
                                                            : 'bg-blue-50 text-blue-700 border border-blue-150 animate-pulse'
                                                    }`}>
                                                    {app.application_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}