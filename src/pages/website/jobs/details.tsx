import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/website/Navbar';
import Footer from '../../../components/website/Footer';
import { useGetJobListingDetailsQuery } from '../../../redux/apis/jobsApi';
import { 
    useCheckAppliedQuery, 
    useSubmitApplicationMutation 
} from '../../../redux/apis/applicationsApi';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import { useAuth } from '../../../hooks/useAuth';
import { useGetOnboardingStatusQuery } from '../../../redux/apis/onboardingApi';
import { WEBSITE_ROUTES } from '../routes.enum';
import { 
    FiArrowLeft, 
    FiBriefcase, 
    FiClock, 
    FiMapPin, 
    FiDollarSign, 
    FiCheckCircle, 
    FiShare2, 
    FiLoader, 
    FiFileText, 
    FiLock, 
    FiUserCheck, 
    FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import ShareJobModal from '../../../components/app/ShareJobModal';

export default function PublicJobDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isProfessional, isInstitute, isAdmin } = useAuth();

    // Job details query
    const { data: job, isLoading, isError } = useGetJobListingDetailsQuery(id || '', { skip: !id });

    // Application query (only run if authenticated as professional)
    const { data: checkAppliedData } = useCheckAppliedQuery(
        { vacancy_id: id || '' },
        { skip: !id || !isAuthenticated || !isProfessional }
    );

    // Onboarding query
    const { data: onboarding } = useGetOnboardingStatusQuery(undefined, {
        skip: !isAuthenticated || !isProfessional,
    });

    // Mutations
    const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
    const [uploadMedia] = useUploadMediaMutation();

    // Modals & form state
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isAuthRequiredModalOpen, setIsAuthRequiredModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    // Form fields
    const [clinicalSummary, setClinicalSummary] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [credentialsFiles, setCredentialsFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const hasApplied = checkAppliedData?.applied || false;
    const activeApplication = checkAppliedData?.application || null;

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            setIsAuthRequiredModalOpen(true);
            return;
        }

        if (isInstitute || isAdmin) {
            toast.error("Only clinical professionals can apply for job vacancies. Institutes and admins cannot submit applications.");
            return;
        }

        if (isProfessional && onboarding?.onboarding_status !== 'approved') {
            toast.error("Your practitioner profile is unverified. Please complete verification to apply.");
            navigate('/user/onboarding');
            return;
        }

        if (hasApplied) {
            toast("You have already submitted an application for this vacancy.", { icon: 'ℹ️' });
            return;
        }

        setIsApplyModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'credential') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedExtensions = ['pdf', 'docx', 'jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            toast.error("Only PDF, DOCX, JPG, and PNG files are allowed.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size cannot exceed 10MB.");
            return;
        }

        if (type === 'cv') {
            setCvFile(file);
            toast.success(`Attached CV: ${file.name}`);
        } else {
            setCredentialsFiles(prev => [...prev, file]);
            toast.success(`Attached document: ${file.name}`);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        if (!clinicalSummary.trim()) {
            toast.error("Please provide a clinical summary / cover note.");
            return;
        }

        try {
            setIsUploading(true);

            let cv_url = '';
            if (cvFile) {
                const cvFormData = new FormData();
                cvFormData.append('file', cvFile);
                cvFormData.append('upload_type', 'document');
                const cvRes = await uploadMedia(cvFormData).unwrap();
                cv_url = cvRes.media.url;
            }

            const supporting_docs: string[] = [];
            for (const docFile of credentialsFiles) {
                const docFormData = new FormData();
                docFormData.append('file', docFile);
                docFormData.append('upload_type', 'document');
                const docRes = await uploadMedia(docFormData).unwrap();
                supporting_docs.push(docRes.media.url);
            }

            setIsUploading(false);

            await submitApplication({
                vacancy_id: id,
                clinical_summary: clinicalSummary,
                curriculum_vitae_url: cv_url,
                credentialing_packet_urls: supporting_docs,
            }).unwrap();

            toast.success("Application submitted successfully!");
            setIsApplyModalOpen(false);
            setClinicalSummary('');
            setCvFile(null);
            setCredentialsFiles([]);
        } catch (err: any) {
            setIsUploading(false);
            toast.error(err?.data?.detail || "Failed to submit application. Please try again.");
        }
    };

    const posterObj = job && typeof job.posted_by === 'object' ? job.posted_by : null;
    const facilityName = posterObj?.facility_name || posterObj?.full_name || 'Medical Institution';
    const isLocum = job?.job_type === 'LOCUM';

    const redirectPath = `/jobs/${id}`;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* HEADER NAVIGATION */}
            <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        to={WEBSITE_ROUTES.JOBS}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
                    >
                        <FiArrowLeft /> Back to Public Jobs
                    </Link>

                    {job && (
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition cursor-pointer"
                        >
                            <FiShare2 /> Share Job
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <FiLoader className="text-4xl text-blue-600 animate-spin mb-3" />
                        <p className="text-sm font-medium text-gray-600">Loading vacancy details...</p>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center my-8">
                        <p className="text-red-700 font-semibold text-base">Job Listing Not Found</p>
                        <p className="text-red-500 text-xs mt-1">This job post may have expired, been removed, or does not exist.</p>
                        <Link
                            to={WEBSITE_ROUTES.JOBS}
                            className="inline-block mt-4 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl"
                        >
                            Browse Available Jobs
                        </Link>
                    </div>
                )}

                {job && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT 2 COLUMNS: JOB DETAILS */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* MAIN HEADER CARD */}
                            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        isLocum 
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    }`}>
                                        {isLocum ? 'Locum Shift' : 'Permanent Position'}
                                    </span>

                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                        Status: {job.status}
                                    </span>

                                    {posterObj?.is_verified && (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                            <FiCheckCircle className="text-blue-600" /> Verified Host
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                                    {job.position_title}
                                </h1>

                                <p className="text-sm font-semibold text-gray-600 mt-1">
                                    Posted by <span className="text-gray-900 font-bold">{facilityName}</span>
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-gray-700">
                                    <div className="flex items-center gap-2.5">
                                        <FiMapPin className="text-blue-600 text-base shrink-0" />
                                        <div>
                                            <span className="block font-semibold text-gray-500 uppercase text-[10px]">Location</span>
                                            <span className="font-bold text-gray-900">{job.city}, {job.state}, {job.country}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <FiDollarSign className="text-emerald-600 text-base shrink-0" />
                                        <div>
                                            <span className="block font-semibold text-gray-500 uppercase text-[10px]">Compensation ({job.rate_type})</span>
                                            <span className="font-bold text-emerald-800">
                                                {job.currency_symbol || '₦'}{job.rate_amount_min.toLocaleString()} - {job.currency_symbol || '₦'}{job.rate_amount_max.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <FiBriefcase className="text-blue-600 text-base shrink-0" />
                                        <div>
                                            <span className="block font-semibold text-gray-500 uppercase text-[10px]">Specialty & Setting</span>
                                            <span className="font-bold text-gray-900">{job.clinical_specialty} • {job.clinical_setting}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <FiClock className="text-blue-600 text-base shrink-0" />
                                        <div>
                                            <span className="block font-semibold text-gray-500 uppercase text-[10px]">Department / Unit</span>
                                            <span className="font-bold text-gray-900">{job.department_unit || 'General'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DESCRIPTION & REQUIREMENTS */}
                            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                                        <FiFileText className="text-blue-600" /> Job Overview & Role Scope
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {job.description}
                                    </p>
                                </div>

                                {/* Credentials */}
                                {job.required_credentials && job.required_credentials.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-2.5">Required Credentials & Certifications</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.required_credentials.map((cred, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-gray-800">
                                                    ✓ {cred}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Locum specific features */}
                                {isLocum && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">Locum Shift Parameters</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {job.coverage_start_date && (
                                                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                                                    <span className="block font-bold text-amber-900">Coverage Window</span>
                                                    <span>{new Date(job.coverage_start_date).toLocaleDateString()} to {job.coverage_end_date ? new Date(job.coverage_end_date).toLocaleDateString() : 'Ongoing'}</span>
                                                </div>
                                            )}
                                            {job.shift_hours && (
                                                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                                                    <span className="block font-bold text-amber-900">Shift Schedule</span>
                                                    <span>{job.shift_hours}</span>
                                                </div>
                                            )}
                                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                                                <span className="block font-bold text-amber-900">Malpractice Insurance</span>
                                                <span>{job.malpractice_insurance_provided ? 'Provided by Facility' : 'Practitioner Responsible'}</span>
                                            </div>
                                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                                                <span className="block font-bold text-amber-900">Travel & Housing</span>
                                                <span>{job.travel_housing_reimbursement ? 'Reimbursed' : 'Not Included'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Permanent specific features */}
                                {!isLocum && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">Permanent Role Features</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                                                <span className="block font-bold text-emerald-900">Internship Acceptance</span>
                                                <span>{job.accepts_interns ? 'Accepts Interns / Fresh Graduates' : 'Requires Experienced Professionals'}</span>
                                            </div>
                                            {job.rotation_schedule && (
                                                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                                                    <span className="block font-bold text-emerald-900">Rotation Schedule</span>
                                                    <span>{job.rotation_schedule}</span>
                                                </div>
                                            )}
                                        </div>

                                        {job.fringe_benefits && job.fringe_benefits.length > 0 && (
                                            <div className="mt-3">
                                                <span className="block text-xs font-bold text-gray-800 mb-1.5">Fringe Benefits & Perks</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.fringe_benefits.map((benefit, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium">
                                                            + {benefit}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ACTION SIDEBAR */}
                        <div className="space-y-6">
                            {/* APPLY / AUTH STATUS CARD */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg sticky top-28">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Apply for this Vacancy</h3>
                                <p className="text-xs text-gray-500 mb-6">
                                    {!isAuthenticated 
                                        ? 'An account is required to submit job applications.'
                                        : (isInstitute || isAdmin)
                                        ? 'Logged in as an Institution/Admin account.'
                                        : 'Review parameters and submit your application.'}
                                </p>

                                {/* If logged in as Institute or Admin */}
                                {isAuthenticated && (isInstitute || isAdmin) && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium mb-4">
                                        ⚠️ Only registered clinical professionals can submit applications for job vacancies.
                                    </div>
                                )}

                                {/* If logged in as Professional but Unverified */}
                                {isAuthenticated && isProfessional && onboarding?.onboarding_status !== 'approved' && !hasApplied && (
                                    <div className="space-y-3 mb-4">
                                        <button
                                            disabled
                                            className="w-full py-3.5 px-4 bg-gray-200 text-gray-400 font-bold text-sm rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <FiLock /> Apply for Vacancy
                                        </button>

                                        <Link
                                            to="/user/onboarding"
                                            className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition hover:underline"
                                        >
                                            Verify your profile to enable applying →
                                        </Link>
                                    </div>
                                )}

                                {/* If user has already applied */}
                                {hasApplied && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center mb-4">
                                        <FiCheckCircle className="text-2xl text-emerald-600 mx-auto mb-1" />
                                        <p className="text-sm font-bold text-emerald-900">Application Submitted</p>
                                        <p className="text-xs text-emerald-700 mt-1">
                                            Status: <span className="font-semibold uppercase">{activeApplication?.application_status || 'PENDING'}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Main Apply Action Button (Active) */}
                                {!hasApplied && (!isAuthenticated || (isProfessional && onboarding?.onboarding_status === 'approved')) && (
                                    <button
                                        onClick={handleApplyClick}
                                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {!isAuthenticated ? (
                                            <>
                                                <FiLock /> Sign In to Apply
                                            </>
                                        ) : (
                                            <>
                                                <FiUserCheck /> Submit Application
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Share Button */}
                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="w-full mt-3 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FiShare2 /> Share Public Job Link
                                </button>

                                {/* Institution Info */}
                                <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
                                    <span className="block font-bold text-gray-900 mb-1">Host Information</span>
                                    <p className="font-semibold text-gray-800">{facilityName}</p>
                                    <p className="text-gray-500 mt-0.5">{job.city}, {job.state}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL: AUTH REQUIRED TO APPLY */}
            {isAuthRequiredModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 text-center">
                        <button
                            onClick={() => setIsAuthRequiredModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiX className="text-xl" />
                        </button>

                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                            <FiLock />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900">Account Required to Apply</h3>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                            You must log in with a verified MedHirePro professional account to submit an application for <strong className="text-gray-900">"{job?.position_title}"</strong>.
                        </p>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                            >
                                Sign In to Apply
                            </button>

                            <button
                                onClick={() => navigate(`/signup?as=professional&redirect=${encodeURIComponent(redirectPath)}`)}
                                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                                Create New Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SUBMIT APPLICATION FORM */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Application Form</h3>
                                <p className="text-xs text-gray-500">{job?.position_title}</p>
                            </div>
                            <button onClick={() => setIsApplyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    CLINICAL SUMMARY & COVER NOTE <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Briefly state your clinical experience and availability for this position..."
                                    value={clinicalSummary}
                                    onChange={(e) => setClinicalSummary(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>

                            {/* CV Upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    CURRICULUM VITAE (CV / RESUME)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.jpg,.png"
                                    onChange={(e) => handleFileChange(e, 'cv')}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            {/* Supporting Docs */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    SUPPORTING DOCUMENTS (OPTIONAL)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.jpg,.png"
                                    onChange={(e) => handleFileChange(e, 'credential')}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                                {credentialsFiles.length > 0 && (
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Attached {credentialsFiles.length} file(s)
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-6"
                            >
                                {isSubmitting || isUploading ? (
                                    <>
                                        <FiLoader className="animate-spin text-sm" /> Submitting Application...
                                    </>
                                ) : (
                                    "Confirm & Submit Application"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* REUSABLE SHARE MODAL */}
            {job && (
                <ShareJobModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    jobId={job._id || job.id}
                    jobTitle={job.position_title}
                    facilityName={facilityName}
                    location={`${job.city}, ${job.state}`}
                />
            )}

            <Footer />
        </div>
    );
}
