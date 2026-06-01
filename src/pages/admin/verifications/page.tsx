import React, { useState } from 'react';
import { 
    useGetPendingOnboardingsQuery, 
    useReviewOnboardingMutation 
} from '../../../redux/apis/onboardingApi';
import type { 
    IOnboardingSubmissionResponse,
    IProfessionalOnboardingSubmit,
    IInstituteOnboardingSubmit
} from '../../../redux/apis/onboardingApi/interface';
import { 
    FiShield, 
    FiCheckCircle, 
    FiXCircle, 
    FiAlertTriangle, 
    FiEye, 
    FiUser, 
    FiHome, 
    FiBriefcase, 
    FiLoader,
    FiFileText,
    FiX,
    FiMapPin
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminVerificationsPage() {
    const { data, isLoading, refetch } = useGetPendingOnboardingsQuery();
    const [reviewOnboarding, { isLoading: isReviewing }] = useReviewOnboardingMutation();

    const [selectedSubmission, setSelectedSubmission] = useState<IOnboardingSubmissionResponse | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionForm, setShowRejectionForm] = useState(false);

    // Custom confirmation modal states
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmMode, setConfirmMode] = useState<'approve' | 'reject'>('approve');

    const handleApproveClick = () => {
        if (!selectedSubmission) return;
        setConfirmMode('approve');
        setIsConfirmOpen(true);
    };

    const handleRejectClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission) return;

        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejecting the credentials.");
            return;
        }

        setConfirmMode('reject');
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedSubmission) return;

        try {
            if (confirmMode === 'approve') {
                await reviewOnboarding({
                    submission_id: selectedSubmission._id,
                    action: 'approve'
                }).unwrap();
                toast.success("Practitioner credentials successfully approved and verified!");
            } else {
                await reviewOnboarding({
                    submission_id: selectedSubmission._id,
                    action: 'reject',
                    rejection_reason: rejectionReason
                }).unwrap();
                toast.success("Practitioner credentials successfully rejected.");
                setRejectionReason('');
                setShowRejectionForm(false);
            }
            setSelectedSubmission(null);
            setIsConfirmOpen(false);
            refetch();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || `Failed to ${confirmMode} credentials.`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-650" />
                    <p className="text-slate-500 font-medium text-xs">Loading supervisor review queue...</p>
                </div>
            </div>
        );
    }

    const pendingSubmissions = data?.submissions || [];

    // Cast details safely based on user role
    const getProfessionalDetails = (details: any) => details as IProfessionalOnboardingSubmit;
    const getInstituteDetails = (details: any) => details as IInstituteOnboardingSubmit;

    return (
        <div className="space-y-8 animate-fadeIn text-slate-750">
            {/* Header Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-teal-500/10">
                <div className="relative z-10 max-w-xl space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiShield className="w-3.5 h-3.5" /> Registry Supervisors
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Credentials Audit Dashboard</h1>
                    <p className="text-slate-350 text-xs font-medium">
                        Audit, approve, and verify practitioner licenses or corporate recruitment credentials submitted by clinics and institutes.
                    </p>
                </div>
            </div>

            {/* Split Auditing Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* QUEUE SIDEBAR (Left 1/3) */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                            Pending Audit Queue ({pendingSubmissions.length})
                        </h3>

                        {pendingSubmissions.length === 0 ? (
                            <div className="py-12 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <FiCheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-700">Dossier Queue Clear</p>
                                    <p className="text-[10px] text-slate-400 font-medium">No pending credential audits.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                {pendingSubmissions.map((sub) => {
                                    const isSelected = selectedSubmission?._id === sub._id;
                                    const userName = (sub as any).user_info?.full_name || "Enterprise Clinic";
                                    const userEmail = (sub as any).user_info?.email || sub.user_id;

                                    return (
                                        <button
                                            key={sub._id}
                                            onClick={() => {
                                                setSelectedSubmission(sub);
                                                setShowRejectionForm(false);
                                                setRejectionReason('');
                                            }}
                                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                                                isSelected 
                                                ? 'bg-teal-50/50 border-teal-500 shadow-sm' 
                                                : 'bg-white border-slate-100 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                                                sub.role === 'professional' 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {sub.role === 'professional' ? <FiUser /> : <FiHome />}
                                            </span>
                                            <div className="overflow-hidden space-y-1 flex-grow">
                                                <p className="text-xs font-black text-slate-800 truncate">{userName}</p>
                                                <p className="text-[10px] text-slate-400 font-semibold truncate">{userEmail}</p>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block uppercase ${
                                                    sub.role === 'professional' 
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-150' 
                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-150'
                                                }`}>
                                                    {sub.role === 'professional' ? 'Clinician' : 'Hospital'}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* AUDIT WORKSPACE DETAIL BLOCK (Right 2/3) */}
                <div className="lg:col-span-2">
                    {!selectedSubmission ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-16 text-center text-slate-400 space-y-3">
                            <FiEye className="w-12 h-12 mx-auto text-slate-300" />
                            <p className="text-sm font-extrabold text-slate-600">Audit Dossier Inspector</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Select a pending credential submission from the queue sidebar to begin auditing their professional certifications.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 md:p-8 space-y-8 animate-fadeIn duration-200">
                            
                            {/* Inspection Header */}
                            <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                                <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-extrabold uppercase">
                                        Sub ID: {selectedSubmission._id}
                                    </span>
                                    <h2 className="text-xl font-black text-slate-800">
                                        {(selectedSubmission as any).user_info?.full_name || "Institution Partner"}
                                    </h2>
                                    <p className="text-xs font-semibold text-slate-450">
                                        Email: {(selectedSubmission as any).user_info?.email}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>

                            {/* AUDITING SECTION: PROFESSIONAL */}
                            {selectedSubmission.role === 'professional' && (
                                <div className="space-y-6">
                                    {/* 1. Licensure details */}
                                    <div className="space-y-3">
                                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                            <FiBriefcase className="text-blue-500" /> Professional Practice Credentials
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <span className="text-slate-400 font-bold block">Practitioner Specialty</span>
                                                <span className="font-extrabold text-slate-700">{getProfessionalDetails(selectedSubmission.details).specialty}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 font-bold block">Employment Preference</span>
                                                <span className="font-extrabold text-slate-700">{getProfessionalDetails(selectedSubmission.details).employment_status || 'Full Time'}</span>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                                <span className="text-slate-400 font-bold block">Internship Status</span>
                                                <span className="font-extrabold text-slate-700">
                                                    {getProfessionalDetails(selectedSubmission.details).is_intern 
                                                        ? 'Clinical Intern Account' 
                                                        : 'Licensed Professional Clinician'
                                                    }
                                                </span>
                                            </div>

                                            {!getProfessionalDetails(selectedSubmission.details).is_intern && (
                                                <>
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <span className="text-slate-400 font-bold block">Licence Number</span>
                                                        <span className="font-mono font-extrabold text-slate-800 text-sm">
                                                            {getProfessionalDetails(selectedSubmission.details).licence_number}
                                                        </span>
                                                    </div>
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <span className="text-slate-400 font-bold block">Licence Expiration</span>
                                                        <span className="font-extrabold text-slate-700">
                                                            {getProfessionalDetails(selectedSubmission.details).licence_expiry}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Documents inspect grid */}
                                    <div className="space-y-3">
                                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                            <FiFileText className="text-blue-500" /> Mandatory Document Auditing
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* ID Document */}
                                            {getProfessionalDetails(selectedSubmission.details).id_document_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 font-bold block">Government Issued ID</span>
                                                        <span className="font-extrabold text-slate-600 block truncate">Passport / Driver's Licence</span>
                                                    </div>
                                                    <a 
                                                        href={getProfessionalDetails(selectedSubmission.details).id_document_url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View Document ID
                                                    </a>
                                                </div>
                                            )}

                                            {/* Degree Certificate */}
                                            {getProfessionalDetails(selectedSubmission.details).degree_document_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 font-bold block">Academic Degree</span>
                                                        <span className="font-extrabold text-slate-600 block truncate">Diploma / MBBS Certificates</span>
                                                    </div>
                                                    <a 
                                                        href={getProfessionalDetails(selectedSubmission.details).degree_document_url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View Degree Certificate
                                                    </a>
                                                </div>
                                            )}

                                            {/* Licence Document (Standard) */}
                                            {!getProfessionalDetails(selectedSubmission.details).is_intern && getProfessionalDetails(selectedSubmission.details).licence_document_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs sm:col-span-2">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="text-slate-400 font-bold block">Practitioner License Card</span>
                                                            <span className="font-extrabold text-slate-600 block">MDCN / Pharmaceutical Board Certificate</span>
                                                        </div>
                                                        <span className="font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-200">
                                                            {getProfessionalDetails(selectedSubmission.details).licence_number}
                                                        </span>
                                                    </div>
                                                    <a 
                                                        href={getProfessionalDetails(selectedSubmission.details).licence_document_url || undefined} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View Practitioner License
                                                    </a>
                                                </div>
                                            )}

                                            {/* School Placement Letter (Interns) */}
                                            {getProfessionalDetails(selectedSubmission.details).is_intern && getProfessionalDetails(selectedSubmission.details).school_or_placement_letter_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs sm:col-span-2">
                                                    <div>
                                                        <span className="text-slate-400 font-bold block">Internship Placement Attestation</span>
                                                        <span className="font-extrabold text-slate-600 block">Hospital Residency / Placement Assign Letter</span>
                                                    </div>
                                                    <a 
                                                        href={getProfessionalDetails(selectedSubmission.details).school_or_placement_letter_url || undefined} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View Placement Letter
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AUDITING SECTION: INSTITUTE */}
                            {selectedSubmission.role === 'institute' && (
                                <div className="space-y-6">
                                    {/* 1. Corporate details */}
                                    <div className="space-y-3">
                                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                            <FiHome className="text-indigo-500" /> Corporate Entity Credentials
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                            <div>
                                                <span className="text-slate-400 font-bold block">Facility Classification</span>
                                                <span className="font-extrabold text-slate-700">{getInstituteDetails(selectedSubmission.details).facility_type}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 font-bold block">Business Registration (EIN/CAC)</span>
                                                <span className="font-mono font-extrabold text-slate-800">{getInstituteDetails(selectedSubmission.details).business_registration_number}</span>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                                <span className="text-slate-400 font-bold block"><FiMapPin className="inline w-3.5 h-3.5 mr-1" /> Registered Physical Address</span>
                                                <span className="font-extrabold text-slate-700 block mt-1">
                                                    {getInstituteDetails(selectedSubmission.details).facility_address?.street}, {getInstituteDetails(selectedSubmission.details).facility_address?.city}, {getInstituteDetails(selectedSubmission.details).facility_address?.state}, {getInstituteDetails(selectedSubmission.details).facility_address?.zip}, {getInstituteDetails(selectedSubmission.details).facility_address?.country}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Documents inspect grid */}
                                    <div className="space-y-3">
                                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                            <FiFileText className="text-indigo-500" /> Mandatory Document Auditing
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {/* Business License */}
                                            {getInstituteDetails(selectedSubmission.details).business_license_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 font-bold block">Practice Permit</span>
                                                        <span className="font-extrabold text-slate-600 block truncate">Practice Licence Card</span>
                                                    </div>
                                                    <a 
                                                        href={getInstituteDetails(selectedSubmission.details).business_license_url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View License
                                                    </a>
                                                </div>
                                            )}

                                            {/* Proof of Address */}
                                            {getInstituteDetails(selectedSubmission.details).proof_of_address_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 font-bold block">Address Verification</span>
                                                        <span className="font-extrabold text-slate-600 block truncate">Utility bill/agreement</span>
                                                    </div>
                                                    <a 
                                                        href={getInstituteDetails(selectedSubmission.details).proof_of_address_url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View Address Proof
                                                    </a>
                                                </div>
                                            )}

                                            {/* Representative ID */}
                                            {getInstituteDetails(selectedSubmission.details).representative_id_url && (
                                                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 font-bold block">Recruiter ID Card</span>
                                                        <span className="font-extrabold text-slate-600 block truncate">Passport / National ID</span>
                                                    </div>
                                                    <a 
                                                        href={getInstituteDetails(selectedSubmission.details).representative_id_url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold transition-colors cursor-pointer"
                                                    >
                                                        <FiEye /> View ID Card
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <hr className="border-slate-100" />

                            {/* DECISION AUDITING ROW */}
                            <div className="space-y-4 pt-2">
                                {!showRejectionForm ? (
                                    <div className="flex justify-end items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowRejectionForm(true)}
                                            className="px-5 py-3 border border-red-200 bg-red-50/30 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-colors"
                                        >
                                            <FiXCircle className="text-sm" /> Reject Credentials
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleApproveClick}
                                            disabled={isReviewing}
                                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-teal-600/10 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                        >
                                            {isReviewing ? <FiLoader className="animate-spin" /> : <FiCheckCircle className="text-sm" />} Approve & Verify Account
                                        </button>
                                    </div>
                                ) : (
                                    /* REJECTION DECISION FORM FORM */
                                    <form onSubmit={handleRejectClick} className="bg-red-50/40 border border-red-100 rounded-2xl p-5 space-y-4 animate-slideDown">
                                        <div className="flex gap-2.5 text-xs text-red-800">
                                            <FiAlertTriangle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h5 className="font-extrabold">Credentials Flag Rejection Audit</h5>
                                                <p className="text-red-750 font-semibold opacity-90">
                                                    State why these credentials are being rejected. This comment will be logged on their portal so they can resolve the issues.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-red-750 uppercase tracking-wide block">Audit Rejection Comment</label>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="e.g. Licence card upload is blurred. Please upload a high-resolution JPG or PDF certificate where license details and date of expiry are visible."
                                                rows={3}
                                                className="w-full bg-white border border-red-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-400 font-medium text-slate-800 leading-relaxed"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowRejectionForm(false);
                                                    setRejectionReason('');
                                                }}
                                                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold bg-white border border-slate-200 rounded-lg cursor-pointer transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isReviewing}
                                                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-extrabold flex items-center gap-1.5 shadow disabled:opacity-50 cursor-pointer transition-colors"
                                            >
                                                {isReviewing ? <FiLoader className="animate-spin" /> : <FiXCircle />} Log Rejection & Flag Dossier
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Modal Confirmation Overlay */}
            {isConfirmOpen && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slideUp duration-200">
                        {/* Header Accent Bar */}
                        <div className={`h-2 w-full ${confirmMode === 'approve' ? 'bg-teal-500' : 'bg-red-500'}`} />
                        
                        <div className="p-6 space-y-6">
                            {/* Icon & Title */}
                            <div className="flex items-start gap-4">
                                <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                                    confirmMode === 'approve' ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {confirmMode === 'approve' ? <FiCheckCircle /> : <FiAlertTriangle />}
                                </span>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-slate-800">
                                        {confirmMode === 'approve' ? 'Confirm Credentials Approval' : 'Confirm Credentials Rejection'}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        {confirmMode === 'approve' 
                                            ? 'Are you sure you want to verify and activate this applicant?' 
                                            : 'Are you sure you want to flag and reject this submission?'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Submitter Info Card */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-bold">Applicant</span>
                                    <span className="font-extrabold text-slate-700">
                                        {(selectedSubmission as any).user_info?.full_name || 'Institution Partner'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-bold">Account Type</span>
                                    <span className="font-bold text-slate-700 capitalize">
                                        {selectedSubmission.role === 'professional' ? 'Clinician Practitioner' : 'Hospital / Corporate'}
                                    </span>
                                </div>
                                {confirmMode === 'reject' && rejectionReason && (
                                    <div className="pt-3 border-t border-slate-200/60 space-y-1">
                                        <span className="text-red-500 font-bold block">Reason for Rejection</span>
                                        <p className="text-slate-650 font-medium bg-red-50/50 border border-red-100 rounded-lg p-2.5 leading-relaxed break-words italic">
                                            "{rejectionReason}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Impact Warning Notice */}
                            <div className={`p-3.5 rounded-xl border text-[11px] font-semibold leading-relaxed flex gap-2 ${
                                confirmMode === 'approve' 
                                    ? 'bg-teal-50/50 border-teal-100 text-teal-850' 
                                    : 'bg-red-50/50 border-red-100 text-red-850'
                            }`}>
                                {confirmMode === 'approve' ? (
                                    <>
                                        <FiCheckCircle className="w-4.5 h-4.5 text-teal-600 flex-shrink-0 mt-0.5" />
                                        <p>
                                            <strong>System Impact:</strong> Approving this will immediately change the applicant's status to verified, allowing them to search/apply for jobs or publish active job listings.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <FiAlertTriangle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p>
                                            <strong>System Impact:</strong> Rejecting this will flag their account. The reason will be sent to the user, and they must re-submit updated documents for verification.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmOpen(false)}
                                    className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmAction}
                                    disabled={isReviewing}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer ${
                                        confirmMode === 'approve'
                                            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/15'
                                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/15'
                                    }`}
                                >
                                    {isReviewing ? (
                                        <FiLoader className="animate-spin text-sm" />
                                    ) : confirmMode === 'approve' ? (
                                        <FiCheckCircle className="text-sm" />
                                    ) : (
                                        <FiXCircle className="text-sm" />
                                    )}
                                    {confirmMode === 'approve' ? 'Verify & Activate' : 'Flag & Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
