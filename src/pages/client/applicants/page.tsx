import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    useGetApplicationsQuery,
    useShortlistApplicationMutation,
    useAcceptApplicationMutation,
    useUpdateApplicationStatusMutation
} from '../../../redux/apis/applicationsApi';
import { 
    FiCompass, 
    FiLoader, 
    FiFileText, 
    FiDownload, 
    FiCheckCircle, 
    FiX,
    FiUser,
    FiFilter,
    FiCheck,
    FiEye,
    FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ClientApplicantsPage() {
    const navigate = useNavigate();

    // Fetch all applications for listings posted by this recruiter
    const { data: applications, isLoading, refetch } = useGetApplicationsQuery();

    // Mutations
    const [shortlistApplication] = useShortlistApplicationMutation();
    const [acceptApplication] = useAcceptApplicationMutation();
    const [updateStatus] = useUpdateApplicationStatusMutation();

    const [processingAppId, setProcessingAppId] = useState<string | null>(null);

    // Search and filters states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [selectedType, setSelectedType] = useState<'ALL' | 'PERMANENT' | 'LOCUM'>('ALL');
    const [onlyShortlisted, setOnlyShortlisted] = useState(false);

    const handleShortlist = async (appId: string, currentShortlisted: boolean) => {
        setProcessingAppId(appId);
        try {
            await shortlistApplication({
                id: appId,
                body: { is_shortlisted: !currentShortlisted }
            }).unwrap();
            toast.success(currentShortlisted ? "Removed candidate from shortlist." : "Successfully shortlisted candidate for credential review!");
            refetch();
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
            refetch();
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
            refetch();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to decline application.");
        } finally {
            setProcessingAppId(null);
        }
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

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading applicants roster...</p>
                </div>
            </div>
        );
    }

    // Calculations for metrics
    const totalCount = applications?.length || 0;
    const reviewCount = applications?.filter(app => app.application_status === 'CREDENTIALING_REVIEW').length || 0;
    const hiredCount = applications?.filter(app => app.application_status === 'ACCEPTED').length || 0;
    const closedCount = applications?.filter(app => app.application_status === 'DECLINED').length || 0;

    // Filter results
    const filteredApps = (applications || []).filter(app => {
        const job = typeof app.vacancy_id === 'object' ? app.vacancy_id : null;
        const jobTitle = job ? (job.position_title || '').toLowerCase() : '';
        const dept = job ? (job.department_unit || '').toLowerCase() : '';

        const matchesSearch = jobTitle.includes(searchTerm.toLowerCase()) || 
            dept.includes(searchTerm.toLowerCase()) ||
            app.candidate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app._id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'ALL' || app.application_status === selectedStatus;
        const matchesType = selectedType === 'ALL' || app.vacancy_type === selectedType;
        const matchesShortlisted = !onlyShortlisted || app.is_shortlisted;

        return matchesSearch && matchesStatus && matchesType && matchesShortlisted;
    });

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            
            {/* Header section with rich gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-indigo-500/10">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-indigo-500/20">
                        <FiCompass className="w-3.5 h-3.5" /> Recruiter Applications Hub
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Manage Job Applicants</h1>
                    <p className="text-indigo-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Review, audit, shortlist, and hire practitioners across all your published permanent placements and locum shifts.
                    </p>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Total Candidates</span>
                    <span className="text-xl font-black text-slate-800">{totalCount} Applicants</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-blue-400 tracking-wider uppercase block">Credentials Audit</span>
                    <span className="text-xl font-black text-blue-700">{reviewCount} In Review</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-emerald-400 tracking-wider uppercase block">Hired & Contracted</span>
                    <span className="text-xl font-black text-emerald-700">{hiredCount} Hires</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-red-400 tracking-wider uppercase block">Closed Campaigns</span>
                    <span className="text-xl font-black text-red-700">{closedCount} Declined</span>
                </div>
            </div>

            {/* Search and Filters row */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by job title, department, candidate ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-medium text-slate-700"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-450 font-bold">
                        <FiFilter /> Filters:
                    </div>
                    {/* Job Type Filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-600 cursor-pointer"
                    >
                        <option value="ALL">All Types</option>
                        <option value="PERMANENT">Permanent Only</option>
                        <option value="LOCUM">Locum Only</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-600 cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="CREDENTIALING_REVIEW">Credential Audit</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="DECLINED">Declined</option>
                    </select>

                    {/* Shortlisted Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                        <input
                            type="checkbox"
                            checked={onlyShortlisted}
                            onChange={(e) => setOnlyShortlisted(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/20"
                        />
                        Shortlisted Only
                    </label>
                </div>
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden">
                {filteredApps.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto text-2xl">
                            <FiUser />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-slate-800">No Applicants Found</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                                No practitioner applications match your search query or filter settings.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Applicant Reference</th>
                                    <th className="px-6 py-4">Placement Vacancy</th>
                                    <th className="px-6 py-4">Submission Dossier</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {filteredApps.map((app) => {
                                    const job = typeof app.vacancy_id === 'object' ? app.vacancy_id : null;
                                    const isProcessing = processingAppId === app._id;
                                    
                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5 max-w-xs space-y-1">
                                                <p className="font-extrabold text-slate-800">
                                                    Practitioner Ref: #{app._id.slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold truncate">
                                                    ID: {app.candidate_id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 max-w-xs space-y-1">
                                                <p 
                                                    onClick={() => job && navigate(`/client/jobs/view/${job._id}`)}
                                                    className="font-extrabold text-slate-850 hover:text-indigo-600 transition-colors truncate cursor-pointer"
                                                >
                                                    {job ? job.position_title : 'Archived Placement Listing'}
                                                </p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                                        app.vacancy_type === 'PERMANENT'
                                                            ? 'bg-blue-50 border-blue-150 text-blue-700'
                                                            : 'bg-teal-50 border-teal-150 text-teal-700'
                                                    }`}>
                                                        {app.vacancy_type === 'PERMANENT' ? 'Permanent' : 'Locum'}
                                                    </span>
                                                    {job && (
                                                        <span className="text-[9px] font-bold text-slate-400">
                                                            {job.city}, {job.state}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 max-w-xs space-y-2">
                                                <p className="text-[10px] text-slate-500 font-medium line-clamp-2" title={app.clinical_summary}>
                                                    {app.clinical_summary}
                                                </p>
                                                <div className="flex gap-2">
                                                    <a 
                                                        href={app.curriculum_vitae_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 transition-colors"
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

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyles(app.application_status)}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                                        app.application_status === 'ACCEPTED' ? 'bg-emerald-500' :
                                                        app.application_status === 'CREDENTIALING_REVIEW' ? 'bg-blue-500' :
                                                        app.application_status === 'DECLINED' ? 'bg-red-500' : 'bg-amber-500'
                                                    }`} />
                                                    {app.application_status.replace(/_/g, ' ')}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right whitespace-nowrap space-x-2">
                                                {/* Go to Job Details Campaign view */}
                                                <button
                                                    onClick={() => job && navigate(`/client/jobs/view/${job._id}`)}
                                                    className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                    title="Campaign Details"
                                                >
                                                    <FiEye className="text-sm" />
                                                </button>

                                                {app.application_status !== 'DECLINED' && (
                                                    <>
                                                        {/* Shortlist */}
                                                        <button
                                                            onClick={() => handleShortlist(app._id, app.is_shortlisted)}
                                                            disabled={isProcessing || app.application_status === 'ACCEPTED'}
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
                                                            disabled={isProcessing}
                                                            className={`p-2 rounded-lg cursor-pointer transition-colors inline-flex items-center border ${
                                                                app.is_accepted
                                                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                    : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}
                                                            title={app.is_accepted ? "Contract Active" : "Hire Candidate"}
                                                        >
                                                            <FiCheckCircle className="text-sm" />
                                                        </button>

                                                        {app.application_status !== 'ACCEPTED' && (
                                                            <button
                                                                onClick={() => handleDecline(app._id)}
                                                                disabled={isProcessing}
                                                                className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors inline-flex items-center border border-red-100"
                                                                title="Decline Candidate"
                                                            >
                                                                <FiX className="text-sm" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Mobile Responsive Cards Layout */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {filteredApps.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-150 p-12 text-center shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto text-xl">
                            <FiUser />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-slate-800">No Applicants Found</h4>
                            <p className="text-[11px] text-slate-455 max-w-sm mx-auto font-medium">
                                Try adjusting search filters or parameters.
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredApps.map((app) => {
                        const job = typeof app.vacancy_id === 'object' ? app.vacancy_id : null;
                        const isProcessing = processingAppId === app._id;
                        
                        return (
                            <div key={app._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-350 transition-colors">
                                
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 max-w-[70%]">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(app.application_status)}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                                app.application_status === 'ACCEPTED' ? 'bg-emerald-500' :
                                                app.application_status === 'CREDENTIALING_REVIEW' ? 'bg-blue-500' :
                                                app.application_status === 'DECLINED' ? 'bg-red-500' : 'bg-amber-500'
                                            }`} />
                                            {app.application_status.replace(/_/g, ' ')}
                                        </span>
                                        <h4 className="font-extrabold text-slate-800 text-xs">
                                            Ref: #{app._id.slice(-6).toUpperCase()}
                                        </h4>
                                        <p 
                                            onClick={() => job && navigate(`/client/jobs/view/${job._id}`)}
                                            className="font-extrabold text-slate-850 hover:text-indigo-600 transition-colors text-[11px] truncate cursor-pointer pt-0.5"
                                        >
                                            {job ? job.position_title : 'Archived Placement Listing'}
                                        </p>
                                    </div>

                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                        app.vacancy_type === 'PERMANENT'
                                            ? 'bg-blue-50 border-blue-150 text-blue-700'
                                            : 'bg-teal-50 border-teal-150 text-teal-700'
                                    }`}>
                                        {app.vacancy_type === 'PERMANENT' ? 'Permanent' : 'Locum'}
                                    </span>
                                </div>

                                {/* Clinical Capabilities summary info */}
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[11px] font-semibold text-slate-650 space-y-2">
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Clinical Cover letter</span>
                                        <p className="font-medium text-slate-600 leading-relaxed whitespace-pre-line pt-0.5">{app.clinical_summary}</p>
                                    </div>
                                    {job && (
                                        <div className="flex justify-between items-center border-t border-slate-200/60 pt-2 text-[10px]">
                                            <span className="text-slate-400">Target Location:</span>
                                            <span className="text-slate-700 font-bold">{job.city}, {job.state}</span>
                                        </div>
                                    )}
                                </div>

                                {/* File downloads */}
                                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                                    <a 
                                        href={app.curriculum_vitae_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-black px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-750 transition-colors"
                                    >
                                        <FiDownload /> Resume CV
                                    </a>
                                    {app.credentialing_packet_urls && app.credentialing_packet_urls.map((docUrl: string, dIdx: number) => (
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
                                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                                    {/* Campaign details */}
                                    <button
                                        onClick={() => job && navigate(`/client/jobs/view/${job._id}`)}
                                        className="px-3.5 py-2 text-[10px] font-black text-indigo-600 hover:text-indigo-850 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 rounded-xl cursor-pointer transition-colors"
                                    >
                                        Review Campaign
                                    </button>

                                    {app.application_status !== 'DECLINED' && app.application_status !== 'ACCEPTED' && (
                                        <button
                                            onClick={() => handleDecline(app._id)}
                                            disabled={isProcessing}
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
                                                disabled={isProcessing || app.application_status === 'ACCEPTED'}
                                                className={`px-3 py-2 text-[10px] font-black rounded-xl cursor-pointer border transition-all ${
                                                    app.is_shortlisted
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-white border-slate-200 text-slate-600'
                                                }`}
                                            >
                                                {app.is_shortlisted ? 'Shortlisted' : 'Shortlist'}
                                            </button>

                                            {/* Accept/Hire */}
                                            <button
                                                onClick={() => handleAccept(app._id, app.is_accepted)}
                                                disabled={isProcessing}
                                                className={`px-3 py-2 text-[10px] font-black rounded-xl cursor-pointer border transition-all shadow-sm ${
                                                    app.is_accepted
                                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/10'
                                                        : 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/15'
                                                }`}
                                            >
                                                {app.is_accepted ? 'Placed Hired' : 'Hire'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
