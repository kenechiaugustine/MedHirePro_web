import { useParams, Link } from 'react-router-dom';
import { useGetJobListingDetailsQuery } from '../../../redux/apis/jobsApi';
import { useGetApplicationsQuery } from '../../../redux/apis/applicationsApi';
import { useReadAllUsersQuery } from '../../../redux/apis/adminApi';
import { 
    FiShield, 
    FiLoader, 
    FiArrowLeft, 
    FiBriefcase, 
    FiDownload, 
    FiFileText, 
    FiUser
} from 'react-icons/fi';

export default function AdminJobApplicantsPage() {
    const { id } = useParams<{ id: string }>();

    // Fetch API details
    const { data: job, isLoading: isJobLoading } = useGetJobListingDetailsQuery(id || '');
    const { data: applications, isLoading: isAppsLoading } = useGetApplicationsQuery({ vacancy_id: id });
    const { data: users, isLoading: isUsersLoading } = useReadAllUsersQuery();

    const isLoading = isJobLoading || isAppsLoading || isUsersLoading;

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-650" />
                    <p className="text-slate-500 font-medium text-xs">Loading campaign applicants...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-3xl mx-auto p-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto">
                    <FiBriefcase />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Job Campaign Not Found</h3>
                    <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                        The requested job listing could not be found or has been deleted.
                    </p>
                </div>
                <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-xs font-black text-teal-650 hover:underline">
                    <FiArrowLeft /> Back to Jobs
                </Link>
            </div>
        );
    }

    // User lookup helper
    const userMap = (users || []).reduce((acc, curr) => {
        acc[curr._id] = curr;
        return acc;
    }, {} as Record<string, any>);

    const postedByClinic = userMap[job.posted_by]?.facility_name || 'System Sponsor Clinic';

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Control Header & Back button */}
            <div className="flex items-center justify-between">
                <Link 
                    to={job.job_type === 'LOCUM' ? '/admin/locum-jobs' : '/admin/jobs'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-black text-slate-600 shadow-sm transition-all"
                >
                    <FiArrowLeft /> Back to Listings
                </Link>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 text-[10px] font-black border border-teal-500/20 uppercase tracking-wider">
                    <FiShield /> Supervisor Dossier View
                </div>
            </div>

            {/* Job Details Overview Card */}
            <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        job.job_type === 'PERMANENT' 
                        ? 'bg-purple-50 text-purple-700 border border-purple-150' 
                        : 'bg-amber-50 text-amber-700 border border-amber-150'
                    }`}>
                        {job.job_type} Campaign
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{job.position_title}</h1>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                        Setting: <span className="text-slate-600 font-extrabold">{job.clinical_setting}</span> • Specialty: <span className="text-slate-600 font-extrabold">{job.clinical_specialty}</span> • Poster: <span className="text-teal-650 font-extrabold">{postedByClinic}</span>
                    </p>
                </div>
                
                <div className="md:text-right flex flex-col justify-end space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Compensation Rate</span>
                    <span className="text-xl font-black text-slate-800">
                        {job.currency_symbol || '₦'}{job.rate_amount_min.toLocaleString()} - {job.rate_amount_max.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per {job.rate_type.toLowerCase()}</span>
                </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                        Applicant Telemetry Records ({applications?.length || 0})
                    </h3>
                </div>

                {!applications || applications.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-xl mx-auto">
                            <FiUser />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-extrabold text-slate-800 text-sm">No Applications Submitted</h4>
                            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                                Clinicians have not submitted credentials packets for this hiring campaign yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop View Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Applicant Clinician</th>
                                        <th className="px-6 py-4">Submission Dossier</th>
                                        <th className="px-6 py-4">Applied Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Resume Files</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {applications.map((app) => {
                                        const candidate = userMap[app.candidate_id];
                                        return (
                                            <tr key={app._id} className="hover:bg-slate-50/40">
                                                <td className="px-6 py-5 space-y-1">
                                                    <div className="font-extrabold text-slate-800">
                                                        {candidate?.full_name || 'New Clinician Practitioner'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-bold truncate">
                                                        {candidate?.email} (ID: {app.candidate_id.slice(-6).toUpperCase()})
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 max-w-xs">
                                                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2" title={app.clinical_summary}>
                                                        {app.clinical_summary}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 text-slate-400 font-bold text-[10px]">
                                                    {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                        app.application_status === 'ACCEPTED' 
                                                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                                                        : app.application_status === 'DECLINED'
                                                        ? 'bg-red-50 border-red-200 text-red-700'
                                                        : app.application_status === 'CREDENTIALING_REVIEW'
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-amber-50 border-amber-250 text-amber-700'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                                            app.application_status === 'ACCEPTED' ? 'bg-emerald-500' :
                                                            app.application_status === 'DECLINED' ? 'bg-red-500' :
                                                            app.application_status === 'CREDENTIALING_REVIEW' ? 'bg-blue-500' : 'bg-amber-500'
                                                        }`} />
                                                        {app.application_status.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    <div className="inline-flex gap-2">
                                                        <a 
                                                            href={app.curriculum_vitae_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-150 transition-colors"
                                                        >
                                                            <FiDownload /> CV
                                                        </a>
                                                        {app.credentialing_packet_urls && app.credentialing_packet_urls.map((docUrl: string, dIdx: number) => (
                                                            <a
                                                                key={dIdx}
                                                                href={docUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200 transition-colors"
                                                            >
                                                                <FiFileText /> Pack #{dIdx + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View Card Grid */}
                        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                            {applications.map((app) => {
                                const candidate = userMap[app.candidate_id];
                                return (
                                    <div key={app._id} className="bg-slate-50/50 border border-slate-150 rounded-xl p-4 space-y-4 text-xs font-semibold text-slate-600">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-extrabold text-slate-800 text-sm">
                                                    {candidate?.full_name || 'Clinician Practitioner'}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold truncate">
                                                    {candidate?.email}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                app.application_status === 'ACCEPTED' 
                                                ? 'bg-emerald-50 border-emerald-250 text-emerald-700' 
                                                : app.application_status === 'DECLINED'
                                                ? 'bg-red-50 border-red-200 text-red-700'
                                                : app.application_status === 'CREDENTIALING_REVIEW'
                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                : 'bg-amber-50 border-amber-250 text-amber-700'
                                            }`}>
                                                {app.application_status.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        <div className="space-y-1 py-2 border-t border-b border-slate-150">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Clinical Dossier Summary</span>
                                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                                {app.clinical_summary}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold">
                                            <span>
                                                Applied: {new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            
                                            <div className="inline-flex gap-2">
                                                <a 
                                                    href={app.curriculum_vitae_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-150 transition-colors"
                                                >
                                                    <FiDownload /> CV
                                                </a>
                                                {app.credentialing_packet_urls && app.credentialing_packet_urls.map((docUrl: string, dIdx: number) => (
                                                    <a
                                                        key={dIdx}
                                                        href={docUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200 transition-colors"
                                                    >
                                                        <FiFileText /> Pack #{dIdx + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
