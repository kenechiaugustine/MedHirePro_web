import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobListingDetailsQuery } from '../../../redux/apis/jobsApi';
import { 
    useCheckAppliedQuery,
    useSubmitApplicationMutation
} from '../../../redux/apis/applicationsApi';
import { useGetOnboardingStatusQuery } from '../../../redux/apis/onboardingApi';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import { USER_ROUTES } from '../routes.enum';
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
    FiUploadCloud,
    FiX,
    FiAlertCircle,
    FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfessionalJobDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Queries
    const { data: job, isLoading: isJobLoading, error: jobError } = useGetJobListingDetailsQuery(id || '', { skip: !id });
    const { data: checkAppliedData, isLoading: isCheckAppliedLoading } = useCheckAppliedQuery({ vacancy_id: id || '' }, { skip: !id });
    const { data: onboarding } = useGetOnboardingStatusQuery();

    // Mutations
    const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
    const [uploadMedia] = useUploadMediaMutation();

    // Application Form States
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [clinicalSummary, setClinicalSummary] = useState('');
    
    // Selected files holding states
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [credentialsFiles, setCredentialsFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const hasApplied = checkAppliedData?.applied || false;
    const activeApplication = checkAppliedData?.application || null;

    const resetForm = () => {
        setClinicalSummary('');
        setCvFile(null);
        setCredentialsFiles([]);
        setIsUploading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'credential') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check: limit to 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Document size cannot exceed 10MB.");
            return;
        }

        if (type === 'cv') {
            setCvFile(file);
            toast.success(`Selected CV: ${file.name}`);
        } else {
            setCredentialsFiles(prev => [...prev, file]);
            toast.success(`Selected supporting document: ${file.name}`);
        }
    };

    const handleRemoveCredential = (indexToRemove: number) => {
        setCredentialsFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !job) return;

        if (!cvFile) {
            toast.error("Please select your Curriculum Vitae (CV) to proceed.");
            return;
        }

        if (clinicalSummary.trim().length < 10) {
            toast.error("Clinical summary must be at least 10 characters long.");
            return;
        }

        try {
            setIsUploading(true);
            toast.loading("Uploading CV...", { id: 'job-apply-upload' });

            // Upload CV
            const cvFormData = new FormData();
            cvFormData.append('file', cvFile);
            const cvRes = await uploadMedia(cvFormData).unwrap();
            const finalCvUrl = cvRes.media.url;

            // Upload all credentials
            const finalCredentialUrls: string[] = [];
            for (let i = 0; i < credentialsFiles.length; i++) {
                toast.loading(`Uploading supporting document ${i + 1}/${credentialsFiles.length}...`, { id: 'job-apply-upload' });
                const credFormData = new FormData();
                credFormData.append('file', credentialsFiles[i]);
                const credRes = await uploadMedia(credFormData).unwrap();
                finalCredentialUrls.push(credRes.media.url);
            }

            toast.loading("Submitting your clinical application...", { id: 'job-apply-upload' });

            await submitApplication({
                vacancy_id: id,
                curriculum_vitae_url: finalCvUrl,
                clinical_summary: clinicalSummary,
                credentialing_packet_urls: finalCredentialUrls
            }).unwrap();

            toast.success("Clinical placement application successfully submitted!", { id: 'job-apply-upload' });
            setIsApplyModalOpen(false);
            resetForm();
            navigate(USER_ROUTES.APPLICATIONS);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to submit clinical placement request.", { id: 'job-apply-upload' });
        } finally {
            setIsUploading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    if (isJobLoading || isCheckAppliedLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Fetching clinical specifications...</p>
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
                        The requested clinical listing could not be resolved. It may have been archived or deleted.
                    </p>
                </div>
                <button
                    onClick={() => navigate(USER_ROUTES.JOBS)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                >
                    <FiArrowLeft /> Back to Search
                </button>
            </div>
        );
    }

    const backPath = job.job_type === 'LOCUM' ? USER_ROUTES.LOCUM_JOBS : USER_ROUTES.JOBS;
    const formattedRate = `${formatCurrency(job.rate_amount_min)} - ${formatCurrency(job.rate_amount_max)}`;

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            {/* Header & Back Action */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => navigate(backPath)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-600 transition-colors cursor-pointer w-fit"
                >
                    <FiArrowLeft /> Back to Clinical Roster
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
                                {job.job_type === 'PERMANENT' ? 'Permanent Career Posting' : 'Locum Shift Vacancy'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-emerald-50 border-emerald-200 text-emerald-700">
                                Matching Openings
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                            {job.position_title}
                        </h1>
                        <p className="text-xs text-slate-400 font-semibold">
                            {job.department_unit} • {(job.clinical_setting || '').replace(/_/g, ' ')}
                        </p>
                    </div>

                    <div className="text-[10px] text-slate-400 font-bold md:text-right">
                        <p>Published: {new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 2 COLS: VACANCY SPECIFICATIONS */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Vacancy Core Specifications */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <FiFileText className="text-indigo-500" /> Vacancy Core Specifications
                            </h3>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Overview</h4>
                            <div className="text-slate-650 text-xs leading-relaxed font-medium whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                {job.description}
                            </div>
                        </div>

                        {/* Credentials Required */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Licensing Credentials</h4>
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
                                <span className="font-extrabold text-slate-750 bg-white border border-slate-150 px-2 py-0.5 rounded-md text-[10px]">
                                    {(job.clinical_specialty || '').replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold">Minimum Experience:</span>
                                <span className="font-extrabold text-slate-750 bg-white border border-slate-150 px-2 py-0.5 rounded-md text-[10px]">
                                    {job.minimum_experience_years} {job.minimum_experience_years === 1 ? 'Year' : 'Years'} Required
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
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Shift Schedule</span>
                                    <span className="text-[11px] font-black text-slate-750 block mt-1 truncate" title={job.shift_hours || undefined}>
                                        {job.shift_hours || 'N/A'}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Weekend / On-Call</span>
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
                                    <span className="text-slate-500 font-semibold">Travel & Lodging Reimbursed:</span>
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
                                    <span className="text-slate-500 font-semibold">Shift Rotation Schedule:</span>
                                    <span className="font-extrabold text-slate-750">
                                        {job.rotation_schedule || 'Standard Hours'}
                                    </span>
                                </div>
                            </div>

                            {/* Fringe Benefits */}
                            <div className="space-y-2 border-t border-slate-100 pt-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fringe Facility Benefits Offered</h4>
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

                {/* RIGHT 1 COL: BUDGET & ACTION CONTROL PANEL */}
                <div className="space-y-6">
                    
                    {/* Location & Compensation card */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                            <FiDollarSign className="text-indigo-500" /> Facility & Budget Details
                        </h4>

                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Target Compensation</span>
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

                    {/* HIRE ACTION / CAMPAIGN STATUS BOX */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Placement Status</span>
                        
                        {hasApplied ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-center space-y-1">
                                    <span className="text-emerald-800 text-[10px] font-extrabold flex items-center justify-center gap-1">
                                        <FiCheckCircle /> APPLIED SUCCESSFULLY
                                    </span>
                                    <span className="text-[9px] font-bold text-emerald-600 bg-white border border-emerald-100 px-2 py-0.5 rounded-full inline-block uppercase">
                                        {activeApplication?.application_status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(USER_ROUTES.APPLICATIONS)}
                                    className="w-full py-2.5 text-[10px] font-black text-indigo-600 hover:text-indigo-850 bg-indigo-50 border border-indigo-150 rounded-xl cursor-pointer text-center transition-colors"
                                >
                                    Track My Application
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {onboarding?.onboarding_status !== 'approved' ? (
                                    <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-850 text-[10px] font-semibold leading-relaxed flex gap-2">
                                        <FiAlertCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p>
                                            <strong>Verification Required:</strong> Your profile onboarding dossier is not approved yet. Only certified practitioners can apply for openings.
                                        </p>
                                    </div>
                                ) : null}

                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    disabled={onboarding?.onboarding_status !== 'approved'}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-black shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <FiCheckCircle className="text-sm" /> Apply for Placement
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* APPLICATION MODAL POPUP */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-slideUp duration-200">
                        {/* Elegant Header Accent */}
                        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-700" />
                        
                        <form onSubmit={handleApplySubmit} className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                                        <FiBriefcase className="text-indigo-600" /> Clinical Placement Request
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                        Submit your credentials directly to the recruiting facility.
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsApplyModalOpen(false); resetForm(); }}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
                                  >
                                    <FiX />
                                </button>
                            </div>
 
                            {/* Alert/Guidelines */}
                            <div className="p-3 rounded-xl border bg-indigo-50/50 border-indigo-100 text-indigo-850 text-[10px] font-semibold leading-relaxed flex gap-2">
                                <FiInfo className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <p>
                                    <strong>Credentials Vault:</strong> All documents are uploaded securely and processed via Cloudinary encryption. Verify the license requirements match your profile.
                                </p>
                            </div>
 
                            <div className="space-y-4 text-xs font-semibold text-slate-700">
                                {/* CV / Resume Upload */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">1. Upload Curriculum Vitae (CV)</label>
                                    
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-55 hover:bg-indigo-100 border border-indigo-150 hover:border-indigo-200 text-indigo-600 rounded-xl text-xs font-black cursor-pointer transition-colors">
                                            {isUploading ? <FiLoader className="animate-spin text-sm" /> : <FiUploadCloud className="text-sm" />}
                                            {cvFile ? 'CV Selected' : 'Select PDF/Doc File'}
                                            <input 
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleFileChange(e, 'cv')}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                        {cvFile && (
                                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 truncate max-w-[240px]">
                                                {cvFile.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
 
                                {/* Supporting Documents */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">2. Supporting Board Licences / Degree pack (Optional)</label>
                                    
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                                            {isUploading ? <FiLoader className="animate-spin text-sm" /> : <FiUploadCloud className="text-sm" />}
                                            Add Supporting Doc
                                            <input 
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'credential')}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>
 
                                    {/* selected pack list */}
                                    {credentialsFiles.length > 0 && (
                                        <div className="grid grid-cols-1 gap-2 pt-1.5">
                                            {credentialsFiles.map((file, index) => (
                                                <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-[10px]">
                                                    <span className="truncate max-w-[300px] text-slate-500 font-bold">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCredential(index)}
                                                        className="p-1 text-red-500 hover:text-red-700 bg-white border border-slate-150 rounded-lg cursor-pointer"
                                                        title="Remove document"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
 
                                {/* Summary */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">3. Clinical Work Capabilities Summary</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={clinicalSummary}
                                        onChange={(e) => setClinicalSummary(e.target.value)}
                                        placeholder="Outline your background, certifications matching, clinical interests, or other reasons you are ideal for this medical placement..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 leading-relaxed"
                                    />
                                </div>
                            </div>
 
                            {/* Submit Buttons */}
                            <div className="flex justify-end items-center gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsApplyModalOpen(false); resetForm(); }}
                                    className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploading || !cvFile}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
                                >
                                    {isSubmitting || isUploading ? (
                                        <FiLoader className="animate-spin text-sm" />
                                    ) : (
                                        <FiCheckCircle className="text-sm" />
                                    )}
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
