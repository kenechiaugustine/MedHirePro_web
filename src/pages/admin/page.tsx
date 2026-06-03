import { useReadAllUsersQuery } from "../../redux/apis/adminApi";
import { useGetJobListingsQuery } from "../../redux/apis/jobsApi";
import { useGetApplicationsQuery } from "../../redux/apis/applicationsApi";
import { Link } from "react-router-dom";
import { 
    FiShield, 
    FiUsers, 
    FiBriefcase, 
    FiFileText,
    FiUserCheck,
    FiTrendingUp,
    FiEye,
    FiLoader
} from "react-icons/fi";

export default function AdminDashboardPage() {
    const { data: users, isLoading: isUsersLoading } = useReadAllUsersQuery();
    const { data: jobs, isLoading: isJobsLoading } = useGetJobListingsQuery();
    const { data: applications, isLoading: isAppsLoading } = useGetApplicationsQuery();

    const isLoading = isUsersLoading || isJobsLoading || isAppsLoading;

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-650" />
                    <p className="text-slate-500 font-medium text-xs">Loading administration analytics...</p>
                </div>
            </div>
        );
    }

    // Counters calculations
    const totalUsers = users?.length || 0;
    const totalProfessionals = users?.filter(u => u.role === 'professional').length || 0;
    const totalInstitutes = users?.filter(u => u.role === 'institute').length || 0;
    const pendingOnboardings = users?.filter(u => u.onboarding_status === 'pending').length || 0;

    const totalJobs = jobs?.length || 0;
    const permanentJobs = jobs?.filter(j => j.job_type === 'PERMANENT').length || 0;
    const locumJobs = jobs?.filter(j => j.job_type === 'LOCUM').length || 0;

    const totalApps = applications?.length || 0;
    const pendingApps = applications?.filter(a => a.application_status === 'SUBMITTED' || a.application_status === 'CREDENTIALING_REVIEW').length || 0;
    const shortlistedApps = applications?.filter(a => a.is_shortlisted).length || 0;

    // Get latest items
    const latestUsers = users ? [...users].slice(-5).reverse() : [];
    const latestJobs = jobs ? [...jobs].slice(-5).reverse() : [];

    return (
        <div className="space-y-8 animate-fadeIn duration-300">
            {/* Console Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-100 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiShield className="w-3.5 h-3.5" /> High Security Supervisor Console
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">MedHirePro Telemetry Center</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed font-sans max-w-2xl">
                        Monitor active clinician placements, institutional vacancies, pending credentials onboarding files, and system transaction limits.
                    </p>
                </div>
            </div>

            {/* Metrics Counters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Users */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Members</span>
                        <span className="text-3xl font-black text-slate-800 block">{totalUsers}</span>
                        <div className="text-[10px] font-semibold text-slate-400">
                            <span className="text-teal-600 font-extrabold">{totalProfessionals}</span> Pract. / <span className="text-indigo-600 font-extrabold">{totalInstitutes}</span> Inst.
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center text-lg">
                        <FiUsers />
                    </div>
                </div>

                {/* Open Jobs */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Job Vacancies</span>
                        <span className="text-3xl font-black text-slate-800 block">{totalJobs}</span>
                        <div className="text-[10px] font-semibold text-slate-400">
                            <span className="text-teal-600 font-extrabold">{permanentJobs}</span> Perm / <span className="text-indigo-600 font-extrabold">{locumJobs}</span> Locum Shifts
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                        <FiBriefcase />
                    </div>
                </div>

                {/* Total Applications */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Applications</span>
                        <span className="text-3xl font-black text-slate-800 block">{totalApps}</span>
                        <div className="text-[10px] font-semibold text-slate-400">
                            <span className="text-amber-600 font-extrabold">{pendingApps}</span> New / <span className="text-emerald-600 font-extrabold">{shortlistedApps}</span> Screened
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                        <FiFileText />
                    </div>
                </div>

                {/* Pending Verification Audits */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-start justify-between">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pending Audits</span>
                        <span className="text-3xl font-black text-slate-800 block">{pendingOnboardings}</span>
                        <div className="text-[10px] font-semibold text-slate-400">
                            Requires review files audit
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                        <FiUserCheck />
                    </div>
                </div>
            </div>

            {/* Split Data Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Registrations Table */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FiTrendingUp className="text-teal-600" /> Recent User Registrations
                        </h3>
                        <Link to="/admin/users" className="text-[10px] font-black text-teal-650 hover:underline">
                            View All Users
                        </Link>
                    </div>

                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                    <th className="px-6 py-3">Member</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {latestUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">
                                            No user accounts registered yet.
                                        </td>
                                    </tr>
                                ) : (
                                    latestUsers.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/40 font-medium text-slate-700">
                                            <td className="px-6 py-3.5">
                                                <div className="font-extrabold text-slate-800 truncate max-w-[160px]">
                                                    {item.full_name || item.facility_name || "New Member"}
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate max-w-[160px] font-semibold">
                                                    {item.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    item.role === 'admin' 
                                                    ? 'bg-teal-50 text-teal-700 border border-teal-150' 
                                                    : item.role === 'institute'
                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-150'
                                                    : 'bg-blue-50 text-blue-700 border border-blue-150'
                                                }`}>
                                                    {item.role === 'institute' ? 'Client' : item.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${
                                                    item.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                                                }`} />
                                                <span className="text-[10px] text-slate-500">
                                                    {item.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <Link 
                                                    to="/admin/users" 
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-650"
                                                >
                                                    <FiEye /> View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Job Listings Panel */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <FiBriefcase className="text-teal-600" /> Recent Job Campaigns
                        </h3>
                        <div className="flex gap-2">
                            <Link to="/admin/jobs" className="text-[10px] font-black text-teal-650 hover:underline">
                                View Openings
                            </Link>
                        </div>
                    </div>

                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                    <th className="px-6 py-3">Campaign Title</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Setting</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {latestJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">
                                            No job listings posted yet.
                                        </td>
                                    </tr>
                                ) : (
                                    latestJobs.map((job) => (
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
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    job.job_type === 'PERMANENT' 
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
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    job.status === 'OPEN' 
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
            </div>
        </div>
    );
}