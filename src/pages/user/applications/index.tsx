import { useState } from 'react';
import { useGetMyApplicationsQuery } from '../../../redux/apis/applicationsApi';
import { 
    FiCompass, 
    FiLoader, 
    FiFileText, 
    FiDownload, 
    FiX,
    FiBriefcase,
    FiClock
} from 'react-icons/fi';

export default function ProfessionalApplicationsPage() {
    // Fetch all applications submitted by current professional
    const { data: applications, isLoading, error } = useGetMyApplicationsQuery();

    const [selectedApp, setSelectedApp] = useState<any | null>(null);

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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
                return 'Placed / Hired';
            case 'CREDENTIALING_REVIEW':
                return 'Credentialing Audit';
            case 'DECLINED':
                return 'Placement Closed';
            default:
                return 'Submitted';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Fetching application records...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="text-red-500 text-3xl">⚠️</div>
                <h3 className="font-extrabold text-slate-800">Connection Error</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                    Failed to communicate with application records. Please check your network.
                </p>
            </div>
        );
    }

    // Calculations for metrics
    const totalApps = applications?.length || 0;
    const reviewApps = applications?.filter(app => app.application_status === 'CREDENTIALING_REVIEW').length || 0;
    const acceptedApps = applications?.filter(app => app.application_status === 'ACCEPTED').length || 0;
    const declinedApps = applications?.filter(app => app.application_status === 'DECLINED').length || 0;

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            
            {/* Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-indigo-500/10">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-indigo-500/20">
                        <FiCompass className="w-3.5 h-3.5" /> Applications Tracker
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">My Placement Applications</h1>
                    <p className="text-indigo-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Audit, track, and monitor status updates on your submitted clinical placement profiles. Keep documents updated to clear credential reviews faster.
                    </p>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Total Submitted</span>
                    <span className="text-xl font-black text-slate-800">{totalApps} Applications</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-blue-400 tracking-wider uppercase block">Dossier Audit</span>
                    <span className="text-xl font-black text-blue-700">{reviewApps} In Review</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-emerald-400 tracking-wider uppercase block">Placed & Hired</span>
                    <span className="text-xl font-black text-emerald-700">{acceptedApps} Contracted</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs">
                    <span className="text-[9px] font-black text-red-400 tracking-wider uppercase block">Declined</span>
                    <span className="text-xl font-black text-red-700">{declinedApps} Closed</span>
                </div>
            </div>

            {/* Application List */}
            {!applications || applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto text-2xl">
                        <FiCompass />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-slate-800">No Applications Submitted</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                            You haven't requested any placements yet. Search our open rosters and apply to begin credential auditing.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Placement / Position</th>
                                    <th className="px-6 py-4">Job Type</th>
                                    <th className="px-6 py-4">Compensation / Rate</th>
                                    <th className="px-6 py-4">Applied Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {applications.map((app) => {
                                    // Parse vacancy details (vacancy_id is populated as IJobListingResponse object)
                                    const job = typeof app.vacancy_id === 'object' ? app.vacancy_id : null;
                                    
                                    const rateText = job 
                                        ? `${formatCurrency(job.rate_amount_min)} - ${formatCurrency(job.rate_amount_max)}`
                                        : 'N/A';
                                        
                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5 max-w-xs space-y-1">
                                                <p className="font-extrabold text-slate-850 truncate">
                                                    {job ? job.position_title : 'Archived Placement Position'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold truncate">
                                                    {job ? `${job.department_unit} • ${job.clinical_setting.replace(/_/g, ' ')}` : 'N/A'}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                                                    app.vacancy_type === 'PERMANENT'
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-teal-50 border-teal-200 text-teal-700'
                                                }`}>
                                                    {app.vacancy_type === 'PERMANENT' ? (
                                                        <>
                                                            <FiBriefcase className="text-[10px]" /> Permanent
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiClock className="text-[10px]" /> Locum Placements
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <p className="font-extrabold text-slate-800">{rateText}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{job ? job.rate_type : ''}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap text-slate-450 font-semibold">
                                                {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyles(app.application_status)}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                                        app.application_status === 'ACCEPTED' ? 'bg-emerald-500' :
                                                        app.application_status === 'CREDENTIALING_REVIEW' ? 'bg-blue-500' :
                                                        app.application_status === 'DECLINED' ? 'bg-red-500' : 'bg-amber-500'
                                                    }`} />
                                                    {getStatusLabel(app.application_status)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="px-3.5 py-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-850 bg-indigo-50 hover:bg-indigo-100 rounded-xl cursor-pointer transition-colors"
                                                >
                                                    Audit Submission
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL PREVIEW */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-slideUp duration-200">
                        {/* Header Color Accent */}
                        <div className={`h-2 w-full ${
                            selectedApp.application_status === 'ACCEPTED'
                                ? 'bg-emerald-500'
                                : selectedApp.application_status === 'CREDENTIALING_REVIEW'
                                ? 'bg-blue-500'
                                : selectedApp.application_status === 'DECLINED'
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                        }`} />

                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-extrabold text-slate-800">
                                        Clinical Application Dossier
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                        Submitted details for the placement ref #{selectedApp._id.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                    <FiX />
                                </button>
                            </div>

                            {/* Job Information Header Box */}
                            {typeof selectedApp.vacancy_id === 'object' && (
                                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2 text-xs font-semibold text-slate-650">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-450 uppercase text-[9px]">Position Title</span>
                                        <span className="font-extrabold text-slate-800 truncate max-w-[200px]" title={selectedApp.vacancy_id.position_title}>
                                            {selectedApp.vacancy_id.position_title}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-450 uppercase text-[9px]">Facility Setting</span>
                                        <span>{selectedApp.vacancy_id.clinical_setting.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-450 uppercase text-[9px]">Location</span>
                                        <span>{selectedApp.vacancy_id.city}, {selectedApp.vacancy_id.state}</span>
                                    </div>
                                </div>
                            )}

                            {/* Status and Details Box */}
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Audit Status</span>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(selectedApp.application_status)}`}>
                                        {getStatusLabel(selectedApp.application_status)}
                                    </span>
                                </div>

                                {/* Clinical capabilities summary */}
                                <div className="space-y-1 text-xs">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Clinical Summary</span>
                                    <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl font-medium text-slate-650 leading-relaxed whitespace-pre-line">
                                        {selectedApp.clinical_summary}
                                    </div>
                                </div>

                                {/* Documents List */}
                                <div className="space-y-2">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dossier Documents Pack</span>
                                    
                                    <div className="flex flex-wrap gap-2 pt-0.5">
                                        {/* CV */}
                                        <a
                                            href={selectedApp.curriculum_vitae_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-750 text-[10px] font-black transition-colors"
                                        >
                                            <FiDownload /> Curriculum Vitae (CV)
                                        </a>

                                        {/* Secondary credentials */}
                                        {selectedApp.credentialing_packet_urls && selectedApp.credentialing_packet_urls.map((docUrl: string, idx: number) => (
                                            <a
                                                key={idx}
                                                href={docUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-650 text-[10px] font-black transition-colors"
                                            >
                                                <FiFileText /> Credential Pack #{idx + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Close Trigger */}
                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                                >
                                    Dismiss Audit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
