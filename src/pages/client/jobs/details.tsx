import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobListingDetailsQuery } from '../../../redux/apis/jobsApi';
import { 
    useGetApplicationsQuery,
    useShortlistApplicationMutation,
    useAcceptApplicationMutation,
    useUpdateApplicationStatusMutation
} from '../../../redux/apis/applicationsApi';
import { CLIENT_ROUTES } from '../routes.enum';
import { 
    FiArrowLeft, 
    FiBriefcase, 
    FiClock, 
    FiMapPin, 
    FiDollarSign, 
    FiFileText, 
    FiCalendar, 
    FiCheckCircle, 
    FiLoader, 
    FiUser, 
    FiDownload, 
    FiCheck, 
    FiX,
    FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ClientJobDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Queries
    const { data: job, isLoading: isJobLoading, error: jobError, refetch: refetchJob } = useGetJobListingDetailsQuery(id || '', { skip: !id });
    const { data: applications, isLoading: isAppsLoading, refetch: refetchApps } = useGetApplicationsQuery({ vacancy_id: id || '' }, { skip: !id });

    // Mutations
    const [shortlistApplication, { isLoading: isShortlisting }] = useShortlistApplicationMutation();
    const [acceptApplication, { isLoading: isAccepting }] = useAcceptApplicationMutation();
    const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateApplicationStatusMutation();

    const [processingAppId, setProcessingAppId] = useState<string | null>(null);

    const handleShortlist = async (appId: string, currentShortlisted: boolean) => {
        setProcessingAppId(appId);
        try {
            await shortlistApplication({
                id: appId,
                body: { is_shortlisted: !currentShortlisted }
            }).unwrap();
            toast.success(currentShortlisted ? "Removed applicant from shortlist." : "Successfully shortlisted candidate for credential review!");
            refetchApps();
            refetchJob();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to update shortlist status.");
        } finally {
            setProcessingAppId(null);
        }
    };

    const handleAccept = async (appId: string, currentAccepted: boolean) => {
        setProcessingAppId(appId);
        try {
            await acceptApplication({
                id: appId,
                body: { is_accepted: !currentAccepted }
            }).unwrap();
            toast.success(currentAccepted ? "Reverted applicant acceptance." : "Practitioner successfully hired/contracted for this placement!");
            refetchApps();
            refetchJob();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to update acceptance status.");
        } finally {
            setProcessingAppId(null);
        }
    };

    const handleDecline = async (appId: string) => {
        setProcessingAppId(appId);
        try {
            await updateStatus({
                id: appId,
                application_status: 'DECLINED'
            }).unwrap();
            toast.success("Application successfully declined.");
            refetchApps();
            refetchJob();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to decline application.");
        } finally {
            setProcessingAppId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return 'bg-emerald-50 border-emerald-250 text-emerald-700';
            case 'CREDENTIALING_REVIEW':
                return 'bg-blue-50 border-blue-250 text-blue-700';
            case 'DECLINED':
                return 'bg-red-50 border-red-250 text-red-700';
            default:
                return 'bg-amber-50 border-amber-250 text-amber-700';
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return 'bg-emerald-500';
            case 'CREDENTIALING_REVIEW':
                return 'bg-blue-500';
            case 'DECLINED':
                return 'bg-red-500';
            default:
                return 'bg-amber-500';
        }
    };

    if (isJobLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading campaign parameters...</p>
                </div>
            </div>
        );
    }

    if (jobError || !job) {
        return (
            <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto text-2xl">
                    <FiAlertCircle />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Job Listing Not Found</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        The requested vacancy details could not be resolved or you do not have permission to view them.
                    </p>
                </div>
                <button
                    onClick={() => navigate(CLIENT_ROUTES.JOBS)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                >
                    <FiArrowLeft /> Back to Listings
                </button>
            </div>
        );
    }

    const formattedRate = `${formatCurrency(job.rate_amount_min)} - ${formatCurrency(job.rate_amount_max)}`;

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            {/* Header & Breadcrumbs */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => navigate(CLIENT_ROUTES.JOBS)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-600 transition-colors cursor-pointer w-fit"
                >
                    <FiArrowLeft /> Back to Job Listings
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                                job.job_type === 'PERMANENT'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-teal-50 border-teal-200 text-teal-700'
                            }`}>
                                {job.job_type === 'PERMANENT' ? <FiBriefcase className="text-[10px]" /> : <FiClock className="text-[10px]" />}
                                {job.job_type === 'PERMANENT' ? 'Permanent Placement' : 'Locum Placement'}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                job.status === 'OPEN'
                                    ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                    : job.status === 'FILLED'
                                    ? 'bg-blue-50 border-blue-250 text-blue-700'
                                    : job.status === 'DRAFT'
                                    ? 'bg-amber-50 border-amber-250 text-amber-700'
                                    : 'bg-red-50 border-red-250 text-red-700'
                            }`}>
                                <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                    job.status === 'OPEN' ? 'bg-emerald-500' :
                                    job.status === 'FILLED' ? 'bg-blue-500' :
                                    job.status === 'DRAFT' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                {job.status}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                            {job.position_title}
                        </h1>
                        <p className="text-xs text-slate-400 font-semibold">
                            {job.department_unit} • {(job.clinical_setting || '').replace(/_/g, ' ')}
                        </p>
                    </div>

                    <div className="text-[10px] text-slate-400 font-bold md:text-right space-y-1">
                        <p>Published: {new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        <p>Last Audit: {new Date(job.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            </div>

            {/* Layout Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 2 COLS: VACANCY CLINICAL DETAILS */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Detailed Specifications Box */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <FiFileText className="text-indigo-500" /> Vacancy Core Specifications
                            </h3>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Description</h4>
                            <div className="text-slate-650 text-xs leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                {job.description}
                            </div>
                        </div>

                        {/* Credentials Required */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Professional Licences / Credentials</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.required_credentials && job.required_credentials.length > 0 ? (
                                    job.required_credentials.map((cred, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
                                            {cred}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 text-xs italic font-medium">None specified</span>
                                )}
                            </div>
                        </div>

                        {/* Clinical Parameters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold">Clinical Specialty:</span>
                                <span className="font-extrabold text-slate-750 bg-white border border-slate-150 px-2 py-0.5 rounded-md text-[10px] uppercase">
                                    {(job.clinical_specialty || '').replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold">Minimum Experience:</span>
                                <span className="font-extrabold text-slate-750 bg-white border border-slate-150 px-2 py-0.5 rounded-md text-[10px]">
                                    {job.minimum_experience_years} {job.minimum_experience_years === 1 ? 'Year' : 'Years'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Conditional parameters based on Job Type */}
                    {job.job_type === 'LOCUM' ? (
                        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <FiCalendar className="text-indigo-500" /> Locum Placement Timeframe & Perks
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Coverage Period</span>
                                    <span className="text-[11px] font-black text-slate-750 block mt-1">
                                        {job.coverage_start_date ? new Date(job.coverage_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'} - {job.coverage_end_date ? new Date(job.coverage_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Shift Hours</span>
                                    <span className="text-[11px] font-black text-slate-750 block mt-1 truncate" title={job.shift_hours || undefined}>
                                        {job.shift_hours || 'N/A'}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">On-Call Requirements</span>
                                    <span className="text-[11px] font-black text-slate-750 block mt-1 truncate" title={job.on_call_requirements || 'None'}>
                                        {job.on_call_requirements || 'None'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
                                    <span className="text-slate-500 font-semibold">Malpractice Insurance Provided:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                        job.malpractice_insurance_provided
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-slate-100 border-slate-200 text-slate-500'
                                    }`}>
                                        {job.malpractice_insurance_provided ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
                                    <span className="text-slate-500 font-semibold">Travel & Housing Reimbursed:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                        job.travel_housing_reimbursement
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-slate-100 border-slate-200 text-slate-500'
                                    }`}>
                                        {job.travel_housing_reimbursement ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <FiBriefcase className="text-indigo-500" /> Permanent Placement Terms & Benefits
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                    <span className="text-slate-500 font-semibold">Accepts Responders / Interns:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                        job.accepts_interns
                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                            : 'bg-slate-100 border-slate-200 text-slate-500'
                                    }`}>
                                        {job.accepts_interns ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                    <span className="text-slate-500 font-semibold">Rotation Schedule:</span>
                                    <span className="font-extrabold text-slate-750">
                                        {job.rotation_schedule || 'Standard Hours'}
                                    </span>
                                </div>
                            </div>

                            {/* Fringe Benefits */}
                            <div className="space-y-2 border-t border-slate-100 pt-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fringe Recruiter Benefits</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.fringe_benefits && job.fringe_benefits.length > 0 ? (
                                        job.fringe_benefits.map((benefit, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-100 text-teal-700">
                                                {benefit}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-xs italic font-medium">None specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT 1 COL: FACILITY & APPLICATIONS PANEL */}
                <div className="space-y-6">
                    
                    {/* Facility and Compensation Summary Card */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                            <FiDollarSign className="text-indigo-500" /> Facility & Budget Details
                        </h4>

                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Estimated Compensation</span>
                            <p className="text-lg font-black text-indigo-600 leading-none">{formattedRate}</p>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                per {job.rate_type ? job.rate_type.toLowerCase() : 'billing cycle'}
                            </span>
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-3 text-xs font-semibold text-slate-650">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Currency Mode:</span>
                                <span className="font-extrabold text-slate-850">{job.currency} ({job.currency_symbol})</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Location City:</span>
                                <span className="font-extrabold text-slate-750 flex items-center gap-0.5">
                                    <FiMapPin className="text-[10px]" /> {job.city}, {job.state}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Country:</span>
                                <span className="font-extrabold text-slate-750">{job.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Campaign Metrics */}
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-indigo-500/10 text-center space-y-3">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-200">Active Candidates</span>
                            <h2 className="text-3xl font-black">{applications?.length || 0}</h2>
                            <p className="text-[10px] text-indigo-300 font-semibold mt-0.5">Submitted shifts or permanent applications</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CANDIDATE APPLICATIONS SECTION */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <FiUser className="text-indigo-500" /> Practitioner Campaign Applications ({applications?.length || 0})
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Audit qualifications, download compliance credential files, and select candidates for clinical placements.
                    </p>
                </div>

                {isAppsLoading ? (
                    <div className="flex h-32 items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <FiLoader className="animate-spin h-6 w-6 text-indigo-600" />
                            <p className="text-slate-500 font-medium text-[10px]">Loading practitioner records...</p>
                        </div>
                    </div>
                ) : !applications || applications.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto text-xl">
                            <FiUser />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-extrabold text-slate-800">No Applications Received</h4>
                            <p className="text-[10px] text-slate-455 max-w-sm mx-auto font-medium">
                                Active practitioners will populate here once they apply for your published placement.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table Layout */}
                        <div className="hidden lg:block bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Applicant Ref</th>
                                            <th className="px-6 py-4">Applied Date</th>
                                            <th className="px-6 py-4">Credentials & Summary</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-750">
                                        {applications.map((app) => {
                                            const isProcessing = processingAppId === app._id;
                                            
                                            return (
                                                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-5 max-w-xs space-y-1">
                                                        <p className="font-extrabold text-slate-800">
                                                            Ref: #{app._id.slice(-6).toUpperCase()}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-bold truncate">
                                                            ID: {app.candidate_id}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-5 whitespace-nowrap text-slate-450 font-semibold">
                                                        {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>

                                                    <td className="px-6 py-5 max-w-md space-y-2">
                                                        <p className="text-[10px] text-slate-550 font-medium line-clamp-2" title={app.clinical_summary}>
                                                            {app.clinical_summary}
                                                        </p>
                                                        <div className="flex gap-2 flex-wrap">
                                                            <a 
                                                                href={app.curriculum_vitae_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 transition-colors"
                                                            >
                                                                <FiDownload /> Resume CV
                                                            </a>
                                                            {app.credentialing_packet_urls && app.credentialing_packet_urls.map((docUrl: string, dIdx: number) => (
                                                                <a
                                                                    key={dIdx}
                                                                    href={docUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200 transition-colors"
                                                                >
                                                                    <FiFileText /> Doc #{dIdx + 1}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyles(app.application_status)}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full inline-block ${getStatusDotColor(app.application_status)}`} />
                                                            {app.application_status.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-5 text-right whitespace-nowrap space-x-2">
                                                        {app.application_status !== 'DECLINED' && app.application_status !== 'ACCEPTED' && (
                                                            <button
                                                                onClick={() => handleDecline(app._id)}
                                                                disabled={isProcessing || isStatusUpdating}
                                                                className="p-2 text-red-655 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-150 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                                title="Decline Candidate"
                                                            >
                                                                <FiX className="text-sm" />
                                                            </button>
                                                        )}

                                                        {app.application_status !== 'DECLINED' && (
                                                            <>
                                                                {/* Shortlist */}
                                                                <button
                                                                    onClick={() => handleShortlist(app._id, app.is_shortlisted)}
                                                                    disabled={isProcessing || isShortlisting || app.application_status === 'ACCEPTED'}
                                                                    className={`p-2 rounded-lg cursor-pointer transition-colors inline-flex items-center border ${
                                                                        app.is_shortlisted
                                                                            ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                                                                            : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                                                    }`}
                                                                    title={app.is_shortlisted ? "Shortlisted" : "Shortlist Candidate"}
                                                                >
                                                                    <FiCheck className="text-sm" />
                                                                </button>

                                                                {/* Accept/Hire */}
                                                                <button
                                                                    onClick={() => handleAccept(app._id, app.is_accepted)}
                                                                    disabled={isProcessing || isAccepting}
                                                                    className={`p-2 rounded-lg cursor-pointer transition-colors inline-flex items-center border ${
                                                                        app.is_accepted
                                                                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                            : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                                                    }`}
                                                                    title={app.is_accepted ? "Cancel Placement" : "Hire Candidate"}
                                                                >
                                                                    <FiCheckCircle className="text-sm" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Responsive Cards Layout */}
                        <div className="grid grid-cols-1 gap-4 lg:hidden">
                            {applications.map((app) => {
                                const isProcessing = processingAppId === app._id;
                                
                                return (
                                    <div key={app._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-350 transition-colors">
                                        
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1 max-w-[70%]">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(app.application_status)}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${getStatusDotColor(app.application_status)}`} />
                                                    {app.application_status.replace(/_/g, ' ')}
                                                </span>
                                                <h4 className="font-extrabold text-slate-800 text-xs">
                                                    Ref: #{app._id.slice(-6).toUpperCase()}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold truncate">
                                                    ID: {app.candidate_id}
                                                </p>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-450">
                                                {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>

                                        {/* Summary Box */}
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[11px] font-semibold text-slate-650 space-y-2">
                                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Clinical summary</span>
                                            <p className="font-medium text-slate-600 leading-relaxed whitespace-pre-line">{app.clinical_summary}</p>
                                        </div>

                                        {/* Supporting Documents / Files */}
                                        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                                            <a 
                                                href={app.curriculum_vitae_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-750 transition-colors"
                                            >
                                                <FiDownload /> Resume CV
                                            </a>
                                            {app.credentialing_packet_urls && app.credentialing_packet_urls.map((docUrl, dIdx) => (
                                                <a
                                                    key={dIdx}
                                                    href={docUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-650 transition-colors"
                                                >
                                                    <FiFileText /> Doc #{dIdx + 1}
                                                </a>
                                            ))}
                                        </div>

                                        {/* Active Action Buttons */}
                                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                            {app.application_status !== 'DECLINED' && app.application_status !== 'ACCEPTED' && (
                                                <button
                                                    onClick={() => handleDecline(app._id)}
                                                    disabled={isProcessing || isStatusUpdating}
                                                    className="px-3 py-2 text-[10px] font-black text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-150 rounded-xl cursor-pointer transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            )}

                                            {app.application_status !== 'DECLINED' && (
                                                <>
                                                    {/* Shortlist */}
                                                    <button
                                                        onClick={() => handleShortlist(app._id, app.is_shortlisted)}
                                                        disabled={isProcessing || isShortlisting || app.application_status === 'ACCEPTED'}
                                                        className={`px-3 py-2 text-[10px] font-black rounded-xl cursor-pointer border transition-all ${
                                                            app.is_shortlisted
                                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                                : 'bg-white border-slate-200 text-slate-650'
                                                        }`}
                                                    >
                                                        {app.is_shortlisted ? 'Shortlisted' : 'Shortlist'}
                                                    </button>

                                                    {/* Accept/Hire */}
                                                    <button
                                                        onClick={() => handleAccept(app._id, app.is_accepted)}
                                                        disabled={isProcessing || isAccepting}
                                                        className={`px-3 py-2 text-[10px] font-black rounded-xl cursor-pointer border transition-all shadow-sm ${
                                                            app.is_accepted
                                                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                                                : 'bg-indigo-600 border-indigo-600 text-white'
                                                        }`}
                                                    >
                                                        {app.is_accepted ? 'Placed Hired' : 'Hire'}
                                                    </button>
                                                </>
                                            )}
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
