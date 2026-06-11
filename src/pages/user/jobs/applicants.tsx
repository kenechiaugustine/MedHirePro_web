import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobListingDetailsQuery } from '../../../redux/apis/jobsApi';
import { 
    useGetApplicationsQuery,
    useShortlistApplicationMutation,
    useAcceptApplicationMutation,
    useUpdateApplicationStatusMutation
} from '../../../redux/apis/applicationsApi';
import { USER_ROUTES } from '../routes.enum';
import { 
    FiArrowLeft,
    FiLoader, 
    FiFileText, 
    FiCheckCircle, 
    FiX,
    FiUser,
    FiExternalLink
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Avatar } from '../../../components/app';

export default function ProfessionalLocumApplicantsPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();

    // Queries
    const { data: job, isLoading: isJobLoading } = useGetJobListingDetailsQuery(jobId || '', { skip: !jobId });
    const { data: applicants, isLoading: isApplicantsLoading, refetch: refetchApplicants } = useGetApplicationsQuery(
        jobId ? { vacancy_id: jobId } : undefined,
        { skip: !jobId }
    );

    // Mutations
    const [shortlistApplication] = useShortlistApplicationMutation();
    const [acceptApplication] = useAcceptApplicationMutation();
    const [updateStatus] = useUpdateApplicationStatusMutation();
    const [processingAppId, setProcessingAppId] = useState<string | null>(null);

    const handleShortlist = async (appId: string, currentShortlisted: boolean) => {
        setProcessingAppId(appId);
        try {
            await shortlistApplication({
                id: appId,
                body: { is_shortlisted: !currentShortlisted }
            }).unwrap();
            toast.success(currentShortlisted ? "Removed candidate from shortlist." : "Successfully shortlisted candidate for credential review!");
            refetchApplicants();
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
            refetchApplicants();
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
            refetchApplicants();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to decline application.");
        } finally {
            setProcessingAppId(null);
        }
    };

    if (isJobLoading || isApplicantsLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading placement applicants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Header section with back button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(USER_ROUTES.LOCUM_JOBS)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-600 transition-colors cursor-pointer mb-2"
                    >
                        <FiArrowLeft /> Back to Registry
                    </button>
                    <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                        <FiUser className="text-indigo-650" /> Manage Job Applicants
                    </h1>
                    {job && (
                        <p className="text-xs text-slate-400 font-semibold">
                            Applicants for <span className="font-extrabold text-slate-600">{job.position_title}</span> • {job.department_unit} ({job.city}, {job.state})
                        </p>
                    )}
                </div>
            </div>

            {/* Applicants List */}
            {!applicants || applicants.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-150 p-16 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-650 mx-auto text-2xl">
                        <FiUser />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-slate-800">No Applicants Yet</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                            There are currently no practitioners who have submitted shift request sheets for this vacancy.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {applicants.map((app) => {
                        const candidate = app.candidate_details;
                        const name = candidate?.full_name || `Practitioner ID: ${app.candidate_id.substring(0, 8)}`;
                        const specialty = candidate?.specialty || app.vacancy_type;
                        const email = candidate?.email || 'N/A';
                        
                        return (
                            <div key={app._id} className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar 
                                            name={name}
                                            avatarUrl={candidate?.avatar_url}
                                            size="md"
                                            role="professional"
                                        />
                                        <div>
                                            <h4 className="font-extrabold text-slate-850 text-sm flex items-center gap-1.5">
                                                {name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-bold">
                                                {specialty} • {email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                            app.application_status === 'ACCEPTED'
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                : app.application_status === 'DECLINED'
                                                    ? 'bg-red-50 border-red-100 text-red-700'
                                                    : app.application_status === 'CREDENTIALING_REVIEW'
                                                        ? 'bg-blue-50 border-blue-100 text-blue-700'
                                                        : 'bg-slate-50 border-slate-100 text-slate-500'
                                        }`}>
                                            {app.application_status.replace(/_/g, ' ')}
                                        </span>
                                        {app.is_shortlisted && (
                                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700">
                                                Shortlisted
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-650 leading-relaxed">
                                    <span className="font-black text-slate-750 block text-[9px] uppercase tracking-wider mb-1">Clinical Work Summary</span>
                                    {app.clinical_summary}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-50 text-[11px]">
                                    <div className="flex flex-wrap gap-3">
                                        <a 
                                            href={app.curriculum_vitae_url}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-extrabold"
                                        >
                                            <FiFileText className="text-sm" /> View Curriculum Vitae (CV) <FiExternalLink />
                                        </a>

                                        {app.credentialing_packet_urls && app.credentialing_packet_urls.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-400">• Supporting docs:</span>
                                                {app.credentialing_packet_urls.map((url, idx) => (
                                                    <a 
                                                        key={idx}
                                                        href={url}
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="text-indigo-650 hover:underline font-bold"
                                                    >
                                                        Doc_{idx + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <button
                                            disabled={processingAppId !== null}
                                            onClick={() => handleShortlist(app._id, app.is_shortlisted)}
                                            className={`px-3.5 py-2 rounded-xl border font-black text-xs transition-colors cursor-pointer ${
                                                app.is_shortlisted
                                                    ? 'bg-amber-50 border-amber-250 text-amber-700 hover:bg-amber-100'
                                                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                                            }`}
                                        >
                                            {app.is_shortlisted ? 'Unshortlist' : 'Shortlist'}
                                        </button>

                                        {app.application_status !== 'ACCEPTED' && (
                                            <button
                                                disabled={processingAppId !== null}
                                                onClick={() => handleAccept(app._id, app.is_accepted)}
                                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                                <FiCheckCircle /> Accept / Hire
                                            </button>
                                        )}

                                        {app.application_status !== 'DECLINED' && (
                                            <button
                                                disabled={processingAppId !== null}
                                                onClick={() => handleDecline(app._id)}
                                                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                                <FiX /> Decline
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
