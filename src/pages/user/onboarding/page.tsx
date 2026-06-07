import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    useGetOnboardingStatusQuery, 
    useSubmitOnboardingMutation 
} from '../../../redux/apis/onboardingApi';
import type { IProfessionalOnboardingSubmit } from '../../../redux/apis/onboardingApi/interface';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import { useGetMeQuery } from '../../../redux/apis/userApi';
import { medicalData } from '../../../data/medicalData';
import { SearchableSelect } from '../../../components/app';
import { 
    FiShield, 
    FiCheckCircle, 
    FiClock, 
    FiAlertTriangle, 
    FiUploadCloud, 
    FiArrowLeft,
    FiLoader,
    FiUserCheck,
    FiUser,
    FiBriefcase,
    FiBookOpen,
    FiCheck,
    FiExternalLink
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfessionalOnboardingPage() {
    const navigate = useNavigate();
    
    // Fetch onboarding status and user info
    const { data: statusData, isLoading: isStatusLoading, refetch: refetchStatus } = useGetOnboardingStatusQuery();
    const { data: userData } = useGetMeQuery();
    const [submitOnboarding, { isLoading: isSubmitting }] = useSubmitOnboardingMutation();
    const [uploadMedia] = useUploadMediaMutation();

    const submissionDetails = statusData?.submission?.details 
        ? (statusData.submission.details as IProfessionalOnboardingSubmit) 
        : null;

    // Form fields state
    const [isIntern, setIsIntern] = useState(false);
    const [specialty, setSpecialty] = useState('');
    const [employmentStatus, setEmploymentStatus] = useState('FULL_TIME');
    const [currentWorkplace, setCurrentWorkplace] = useState('');
    const [licenceNumber, setLicenceNumber] = useState('');
    const [licenceExpiry, setLicenceExpiry] = useState('');

    // Document URL states
    const [degreeUrl, setDegreeUrl] = useState('');
    const [idUrl, setIdUrl] = useState('');
    const [licenceUrl, setLicenceUrl] = useState('');
    const [schoolLetterUrl, setSchoolLetterUrl] = useState('');

    // Uploading states per file type
    const [uploadingDegree, setUploadingDegree] = useState(false);
    const [uploadingId, setUploadingId] = useState(false);
    const [uploadingLicence, setUploadingLicence] = useState(false);
    const [uploadingSchoolLetter, setUploadingSchoolLetter] = useState(false);

    // Get clinical specialty options from medicalData
    const specialtyOptions = useMemo(() => {
        const options = medicalData.departments.flatMap(dept => {
            if (dept.specialties.length === 0) {
                return [{
                    label: dept.name,
                    value: dept.name,
                    group: 'General Services'
                }];
            }
            return dept.specialties.map(spec => ({
                label: spec,
                value: spec,
                group: dept.name
            }));
        });

        // Ensure currently selected specialty is in options
        if (specialty && !options.some(opt => opt.value === specialty)) {
            options.push({
                label: specialty,
                value: specialty,
                group: 'Registered Specialty'
            });
        }
        return options;
    }, [specialty]);

    // Sync form values on loaded user profile / onboarding details
    useEffect(() => {
        if (submissionDetails) {
            const details = submissionDetails;
            setIsIntern(!!details.is_intern);
            setSpecialty(details.specialty || '');
            setEmploymentStatus(details.employment_status || 'FULL_TIME');
            setCurrentWorkplace(details.current_workplace || '');
            setLicenceNumber(details.licence_number || '');
            setLicenceExpiry(details.licence_expiry || '');
            setDegreeUrl(details.degree_document_url || '');
            setIdUrl(details.id_document_url || '');
            setLicenceUrl(details.licence_document_url || '');
            setSchoolLetterUrl(details.school_or_placement_letter_url || '');
        } else if (userData) {
            setSpecialty(userData.specialty || '');
        }
    }, [statusData, submissionDetails, userData]);

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setURL: (url: string) => void,
        setLoading: (loading: boolean) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check: Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size exceeds the 10MB limit.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadMedia(formData).unwrap();
            setURL(res.media.url);
            toast.success(`${file.name} uploaded successfully!`);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || 'Failed to upload document.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!specialty) {
            toast.error('Please select your specialty.');
            return;
        }
        if (!degreeUrl) {
            toast.error('Degree Certificate is required.');
            return;
        }
        if (!idUrl) {
            toast.error('Identity Document is required.');
            return;
        }

        if (isIntern) {
            if (!schoolLetterUrl) {
                toast.error('Internship/School Placement letter is required.');
                return;
            }
        } else {
            if (!licenceNumber) {
                toast.error('Professional Licence Number is required.');
                return;
            }
            if (!licenceExpiry) {
                toast.error('Licence Expiry date is required.');
                return;
            }
            if (!licenceUrl) {
                toast.error('Licence Document is required.');
                return;
            }
        }

        try {
            const payload = {
                is_intern: isIntern,
                specialty,
                employment_status: employmentStatus,
                current_workplace: currentWorkplace || null,
                degree_document_url: degreeUrl,
                id_document_url: idUrl,
                ...(isIntern 
                    ? { school_or_placement_letter_url: schoolLetterUrl }
                    : { licence_number: licenceNumber, licence_expiry: licenceExpiry, licence_document_url: licenceUrl }
                )
            };

            await submitOnboarding(payload).unwrap();
            toast.success('Onboarding submission successfully uploaded for review!');
            refetchStatus();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || 'Failed to submit onboarding details.');
        }
    };

    // Calculate completion metrics
    const getCompletionPercentage = () => {
        let total = 4; // Specialty, Employment, Degree, ID
        let completed = 0;
        
        if (specialty) completed++;
        if (employmentStatus) completed++;
        if (degreeUrl) completed++;
        if (idUrl) completed++;

        if (isIntern) {
            total += 1; // School placement letter
            if (schoolLetterUrl) completed++;
        } else {
            total += 3; // Licence number, expiry, licence certificate
            if (licenceNumber) completed++;
            if (licenceExpiry) completed++;
            if (licenceUrl) completed++;
        }

        return Math.round((completed / total) * 100);
    };

    if (isStatusLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <FiLoader className="animate-spin h-10 w-10 text-blue-600" />
                    <p className="text-slate-500 font-semibold text-sm">Validating credentials registry...</p>
                </div>
            </div>
        );
    }

    const currentStatus = statusData?.onboarding_status || 'not_started';

    // RENDER: Approved / Verified Screen
    if (currentStatus === 'approved') {
        return (
            <div className="max-w-2xl mx-auto space-y-6 py-8 animate-fadeIn duration-500">
                <button 
                    onClick={() => navigate('/user/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden text-center p-8 space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-4 border-emerald-100 animate-bounce">
                        <FiCheckCircle className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <FiShield className="w-3.5 h-3.5" /> VERIFIED PRACTITIONER
                        </span>
                        <h1 className="text-3xl font-black text-slate-800">Credentials Approved!</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            Congratulations! Your professional practitioner documents have been successfully verified by our administrative registry. You now have full access to locum placements and permanent vacancies.
                        </p>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left bg-slate-50/80 p-4 rounded-xl border border-slate-100 max-w-lg mx-auto text-xs">
                        <div>
                            <span className="text-slate-400 font-bold uppercase block tracking-wider">Registered Specialty</span>
                            <span className="font-extrabold text-slate-700 text-sm">{specialty || submissionDetails?.specialty}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase block tracking-wider">Credential Status</span>
                            <span className="font-extrabold text-emerald-600 text-sm">Active & Certified</span>
                        </div>
                        {!isIntern && (
                            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                <span className="text-slate-400 font-bold uppercase block tracking-wider">Licence Number</span>
                                <span className="font-mono font-extrabold text-slate-800 text-sm">{licenceNumber || submissionDetails?.licence_number}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={() => navigate('/user/dashboard')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                            Explore Open Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Pending Review Screen
    if (currentStatus === 'pending') {
        return (
            <div className="max-w-2xl mx-auto space-y-6 py-8 animate-fadeIn">
                <button 
                    onClick={() => navigate('/user/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4" /> Dashboard
                </button>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 border-4 border-blue-100">
                        <FiClock className="w-10 h-10 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                            <FiClock className="w-3.5 h-3.5" /> SUBMISSION UNDER REVIEW
                        </span>
                        <h1 className="text-2xl font-black text-slate-800">Verification in Progress</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            Your credentials dossier has been received and is currently in queue for review by our registry officer. We will notify you as soon as review is completed.
                        </p>
                    </div>

                    {/* Visual Review Timeline */}
                    <div className="max-w-md mx-auto pt-6 pb-2 text-xs">
                        <div className="flex justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-10">
                                <div className="h-full bg-blue-600 w-1/2"></div>
                            </div>

                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-blue-500 font-extrabold">1</span>
                                <span className="font-extrabold text-slate-700">Submitted</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border-2 border-blue-300 font-extrabold animate-pulse">2</span>
                                <span className="font-extrabold text-slate-600">Admin Review</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-slate-200 font-extrabold">3</span>
                                <span className="font-bold text-slate-400">Activation</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-md mx-auto space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Registry Specialty:</span>
                            <span className="font-extrabold text-slate-700">{specialty || submissionDetails?.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Intern Status:</span>
                            <span className="font-extrabold text-slate-700">{isIntern ? 'Yes (Clinical Intern)' : 'No (Licensed Clinician)'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Submission ID:</span>
                            <span className="font-mono text-slate-500 font-bold">{statusData?.submission?._id}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Form Screen (not_started / rejected)
    const completion = getCompletionPercentage();

    return (
        <div className="max-w-6xl mx-auto space-y-6 py-6 animate-fadeIn text-slate-750">
            <button 
                onClick={() => navigate('/user/dashboard')}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
            >
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            {/* Rejection Alert */}
            {currentStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 text-red-800">
                    <FiAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                        <h4 className="font-black text-sm">Previous Verification Rejected</h4>
                        <p className="text-xs text-red-700 leading-relaxed font-medium">
                            <strong>Reason:</strong> {statusData?.submission?.rejection_reason || 'Missing or blurred credential documentation.'}
                        </p>
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pt-1">
                            Please correct the flagged documents below and re-submit your dossier.
                        </p>
                    </div>
                </div>
            )}

            {/* Header Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-sky-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="relative z-10 max-w-xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-semibold backdrop-blur-md">
                        <FiShield className="w-3.5 h-3.5" /> Registry Verification Portal
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Clinician Dossier Upload</h1>
                    <p className="text-blue-100 text-xs md:text-sm font-medium leading-relaxed">
                        Verify your academic degrees and medical licensure credentials in a few quick steps. Completed dossiers receive priority listing access.
                    </p>
                </div>
            </div>

            {/* Redesigned Dual Panel Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: COMPLIANCE CHECKLIST PANEL */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-6">
                        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                            Verification Dossier Index
                        </h3>

                        {/* Progress Meter */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">Index Completeness</span>
                                <span className="text-lg font-black text-blue-600">{completion}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-sky-500 h-full rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${completion}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Document Checklist Items */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                    specialty ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-300'
                                }`}>
                                    {specialty ? <FiCheck className="w-3.5 h-3.5" /> : '1'}
                                </span>
                                <span className={`text-xs font-semibold ${specialty ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Clinical Specialty Select
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                    degreeUrl ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-300'
                                }`}>
                                    {degreeUrl ? <FiCheck className="w-3.5 h-3.5" /> : '2'}
                                </span>
                                <span className={`text-xs font-semibold ${degreeUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Degree Certificate Upload
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                    idUrl ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-300'
                                }`}>
                                    {idUrl ? <FiCheck className="w-3.5 h-3.5" /> : '3'}
                                </span>
                                <span className={`text-xs font-semibold ${idUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Government ID Upload
                                </span>
                            </div>

                            {isIntern ? (
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                        schoolLetterUrl ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                        {schoolLetterUrl ? <FiCheck className="w-3.5 h-3.5" /> : '4'}
                                    </span>
                                    <span className={`text-xs font-semibold ${schoolLetterUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                        Internship Placement Letter
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                            licenceNumber && licenceExpiry ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-300'
                                        }`}>
                                            {licenceNumber && licenceExpiry ? <FiCheck className="w-3.5 h-3.5" /> : '4'}
                                        </span>
                                        <span className={`text-xs font-semibold ${licenceNumber && licenceExpiry ? 'text-slate-700' : 'text-slate-400'}`}>
                                            Licence Number Details
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                            licenceUrl ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-300'
                                        }`}>
                                            {licenceUrl ? <FiCheck className="w-3.5 h-3.5" /> : '5'}
                                        </span>
                                        <span className={`text-xs font-semibold ${licenceUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                            Licence Certificate Document
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: MAIN INTERACTIVE FORM BLOCK */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* SECTION 1: Practice Categories */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <FiUser className="text-blue-600 text-lg" />
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                                        1. Professional Designation & Settings
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SearchableSelect
                                        id="prof-specialty"
                                        label="Clinical Specialty"
                                        placeholder="Select clinical specialty..."
                                        options={specialtyOptions}
                                        value={specialty}
                                        onChange={(val) => setSpecialty(val)}
                                        focusColor="#0b5cd5"
                                        required={true}
                                    />

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-450 uppercase block">Employment Category <span className="text-red-500">*</span></label>
                                        <select
                                            value={employmentStatus}
                                            onChange={(e) => setEmploymentStatus(e.target.value)}
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 outline-none cursor-pointer"
                                            required
                                        >
                                            <option value="FULL_TIME">Full Time</option>
                                            <option value="PART_TIME">Part Time</option>
                                            <option value="CONTRACT">Contract Basis</option>
                                            <option value="LOCUM">Locum Placements</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-450 uppercase block">Current Workplace / Hospital Affiliation</label>
                                        <input
                                            type="text"
                                            value={currentWorkplace}
                                            onChange={(e) => setCurrentWorkplace(e.target.value)}
                                            placeholder="e.g. Saint Nicholas Hospital, Lagos"
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Licensure details */}
                            <div className="space-y-5">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-50 pb-2">
                                    <div className="flex items-center gap-2">
                                        <FiBriefcase className="text-blue-600 text-lg" />
                                        <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                                            2. Clinical Licensure & Credentials
                                        </h4>
                                    </div>

                                    {/* Intern Switcher Toggle */}
                                    <label className="inline-flex items-center justify-between sm:justify-start gap-2.5 cursor-pointer w-full sm:w-auto bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg border border-slate-100 sm:border-0">
                                        <input 
                                            type="checkbox"
                                            checked={isIntern}
                                            onChange={(e) => {
                                                setIsIntern(e.target.checked);
                                                setLicenceUrl('');
                                                setSchoolLetterUrl('');
                                            }}
                                            className="sr-only peer"
                                        />
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Are you an intern?</span>
                                        <div className="relative w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600 flex-shrink-0"></div>
                                    </label>
                                </div>

                                {isIntern ? (
                                    /* INTERN ATTESTATION UPLOAD */
                                    <div className="bg-sky-50/30 rounded-2xl border border-sky-100/50 p-6 space-y-4">
                                        <div className="flex gap-2 text-sky-900 text-xs">
                                            <FiCheckCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                                            <p className="font-semibold leading-relaxed">
                                                Intern accounts bypass state medical licenses by submitting an active Dean Letter or clinical rotation assignment document.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-450 uppercase block">School Placement / Intern Letter Document <span className="text-red-500">*</span></label>
                                            <div className="flex items-center gap-4">
                                                <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                    <FiUploadCloud className={`w-8 h-8 ${schoolLetterUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                    <span className="text-xs font-bold text-slate-700 text-center">
                                                        {uploadingSchoolLetter ? 'Uploading attestation...' : schoolLetterUrl ? 'Attestation loaded!' : 'Select Placement Letter'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleFileUpload(e, setSchoolLetterUrl, setUploadingSchoolLetter)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {schoolLetterUrl && (
                                                    <a href={schoolLetterUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                        <FiExternalLink className="w-5 h-5 text-blue-600" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* STANDARD LICENCE DETAILS */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-450 uppercase block">Licence Number <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={licenceNumber}
                                                onChange={(e) => setLicenceNumber(e.target.value)}
                                                placeholder="e.g. MDCN/R/12942"
                                                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 outline-none"
                                                required={!isIntern}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-450 uppercase block">Licence Expiry Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={licenceExpiry}
                                                onChange={(e) => setLicenceExpiry(e.target.value)}
                                                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 outline-none"
                                                required={!isIntern}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-450 uppercase block">Active Licence Certificate Document <span className="text-red-500">*</span></label>
                                            <div className="flex items-center gap-4">
                                                <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                    <FiUploadCloud className={`w-8 h-8 ${licenceUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                    <span className="text-xs font-bold text-slate-700 text-center">
                                                        {uploadingLicence ? 'Uploading licence...' : licenceUrl ? 'Licence document loaded!' : 'Select Licence Certificate'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleFileUpload(e, setLicenceUrl, setUploadingLicence)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {licenceUrl && (
                                                    <a href={licenceUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                        <FiExternalLink className="w-5 h-5 text-blue-600" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 3: Mandated credentials */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <FiBookOpen className="text-blue-600 text-lg" />
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                                        3. Mandated Identity & Academic Credentials
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Degree Certificate */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-455 block">Degree / Transcripts Certificate <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                <FiUploadCloud className={`w-8 h-8 ${degreeUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                <span className="text-xs font-bold text-slate-700 text-center">
                                                    {uploadingDegree ? 'Uploading certificate...' : degreeUrl ? 'Degree uploaded!' : 'Select Degree Certificate'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, setDegreeUrl, setUploadingDegree)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {degreeUrl && (
                                                <a href={degreeUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                    <FiExternalLink className="w-5 h-5 text-blue-600" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Government ID Document */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-455 block">Government Issued Identification Document <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                <FiUploadCloud className={`w-8 h-8 ${idUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                <span className="text-xs font-bold text-slate-700 text-center">
                                                    {uploadingId ? 'Uploading ID...' : idUrl ? 'ID card loaded!' : 'Select ID Card'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, setIdUrl, setUploadingId)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {idUrl && (
                                                <a href={idUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                    <FiExternalLink className="w-5 h-5 text-blue-600" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT ROW */}
                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex gap-2 text-slate-400 text-[10px] max-w-sm">
                                    <FiUserCheck className="w-4.5 h-4.5 text-slate-350 flex-shrink-0" />
                                    <p className="font-semibold leading-normal">
                                        By executing submission, you attest that all professional licensure files and certificates are legally certified and authentic.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploadingDegree || uploadingId || uploadingLicence || uploadingSchoolLetter}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiLoader className="animate-spin w-4 h-4" /> Registering Dossier...
                                        </>
                                    ) : (
                                        'Submit Verification Dossier'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
