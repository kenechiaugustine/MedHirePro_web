import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useGetOnboardingStatusQuery,
    useSubmitOnboardingMutation
} from '../../../redux/apis/onboardingApi';
import type { IInstituteOnboardingSubmit } from '../../../redux/apis/onboardingApi/interface';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import {
    FiShield,
    FiCheckCircle,
    FiClock,
    FiAlertTriangle,
    FiUploadCloud,
    FiArrowLeft,
    FiLoader,
    FiBriefcase,
    FiMapPin,
    FiCheck,
    FiExternalLink,
    FiHome
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function InstituteOnboardingPage() {
    const navigate = useNavigate();

    // Fetch onboarding status
    const { data: statusData, isLoading: isStatusLoading, refetch: refetchStatus } = useGetOnboardingStatusQuery();
    const [submitOnboarding, { isLoading: isSubmitting }] = useSubmitOnboardingMutation();
    const [uploadMedia] = useUploadMediaMutation();

    const submissionDetails = statusData?.submission?.details
        ? (statusData.submission.details as IInstituteOnboardingSubmit)
        : null;

    // Form fields state
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
    const [facilityType, setFacilityType] = useState('');

    // Address fields
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('Nigeria');

    // Document URL states
    const [licenseUrl, setLicenseUrl] = useState('');
    const [proofAddressUrl, setProofAddressUrl] = useState('');
    const [repIdUrl, setRepIdUrl] = useState('');

    // Uploading states per file type
    const [uploadingLicense, setUploadingLicense] = useState(false);
    const [uploadingProofAddress, setUploadingProofAddress] = useState(false);
    const [uploadingRepId, setUploadingRepId] = useState(false);

    // Sync form values on rejected state for corrections
    useEffect(() => {
        if (submissionDetails) {
            const details = submissionDetails;
            setBusinessRegistrationNumber(details.business_registration_number || '');
            setFacilityType(details.facility_type || '');

            if (details.facility_address) {
                setStreet(details.facility_address.street || '');
                setCity(details.facility_address.city || '');
                setState(details.facility_address.state || '');
                setZip(details.facility_address.zip || '');
                setCountry(details.facility_address.country || 'Nigeria');
            }

            setLicenseUrl(details.business_license_url || '');
            setProofAddressUrl(details.proof_of_address_url || '');
            setRepIdUrl(details.representative_id_url || '');
        }
    }, [statusData, submissionDetails]);

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

        if (!businessRegistrationNumber) {
            toast.error('Please enter your business registration number.');
            return;
        }
        if (!facilityType) {
            toast.error('Please select your facility type.');
            return;
        }
        if (!street || !city || !state || !zip) {
            toast.error('Please complete your facility address details.');
            return;
        }
        if (!licenseUrl) {
            toast.error('Business License document is required.');
            return;
        }
        if (!proofAddressUrl) {
            toast.error('Proof of Address document is required.');
            return;
        }
        if (!repIdUrl) {
            toast.error('Representative Identity Document is required.');
            return;
        }

        try {
            const payload = {
                business_registration_number: businessRegistrationNumber,
                facility_type: facilityType,
                business_license_url: licenseUrl,
                proof_of_address_url: proofAddressUrl,
                representative_id_url: repIdUrl,
                facility_address: {
                    street,
                    city,
                    state,
                    zip,
                    country
                }
            };

            await submitOnboarding(payload).unwrap();
            toast.success('Corporate verification successfully uploaded for review!');
            refetchStatus();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || 'Failed to submit corporate credentials.');
        }
    };

    // Calculate completion metrics
    const getCompletionPercentage = () => {
        const total = 8; // Business Reg, Facility Type, Address details, License file, Address file, Rep ID file
        let completed = 0;

        if (businessRegistrationNumber) completed++;
        if (facilityType) completed++;
        if (street) completed++;
        if (city && state && zip) completed++;
        if (licenseUrl) completed++;
        if (proofAddressUrl) completed++;
        if (repIdUrl) completed++;
        if (street && city) completed++; // Sub Address complete

        return Math.min(100, Math.round((completed / total) * 100));
    };

    if (isStatusLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <FiLoader className="animate-spin h-10 w-10 text-indigo-600" />
                    <p className="text-slate-500 font-semibold text-sm">Validating corporate registry...</p>
                </div>
            </div>
        );
    }

    const currentStatus = statusData?.onboarding_status || 'not_started';

    // RENDER: Approved / Verified Recruiter Screen
    if (currentStatus === 'approved') {
        return (
            <div className="max-w-2xl mx-auto space-y-6 py-8 animate-fadeIn duration-500">
                <button
                    onClick={() => navigate('/client/dashboard')}
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
                            <FiShield className="w-3.5 h-3.5" /> VERIFIED PARTNER
                        </span>
                        <h1 className="text-3xl font-black text-slate-800">Corporate Approved!</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            Congratulations! Your corporate entity credentials and business address have been successfully verified by our enterprise registry. You now have full permission to post medical vacancies and hire practitioners.
                        </p>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left bg-slate-50/80 p-4 rounded-xl border border-slate-100 max-w-lg mx-auto text-xs">
                        <div>
                            <span className="text-slate-400 font-bold uppercase block tracking-wider">Facility Type</span>
                            <span className="font-extrabold text-slate-700 text-sm">{facilityType || submissionDetails?.facility_type}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase block tracking-wider">EIN / Registration No.</span>
                            <span className="font-mono font-extrabold text-slate-800 text-sm">{businessRegistrationNumber || submissionDetails?.business_registration_number}</span>
                        </div>
                        <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                            <span className="text-slate-400 font-bold uppercase block tracking-wider">Business Address</span>
                            <span className="font-extrabold text-slate-600 text-sm">
                                {street}, {city}, {state}, {zip}, {country}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={() => navigate('/client/dashboard')}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                            Post Open Position
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
                    onClick={() => navigate('/client/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4" /> Dashboard
                </button>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 border-4 border-indigo-100">
                        <FiClock className="w-10 h-10 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                            <FiClock className="w-3.5 h-3.5" /> SUBMISSION UNDER AUDIT
                        </span>
                        <h1 className="text-2xl font-black text-slate-800">Business Verification in Progress</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            Your corporate documents and registration details are currently in queue for audit by our compliance officer. This process typically completes within 24 hours.
                        </p>
                    </div>

                    {/* Visual Review Timeline */}
                    <div className="max-w-md mx-auto pt-6 pb-2 text-xs">
                        <div className="flex justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-10">
                                <div className="h-full bg-indigo-600 w-1/2"></div>
                            </div>

                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-indigo-500 font-extrabold">1</span>
                                <span className="font-extrabold text-slate-700">Submitted</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border-2 border-indigo-300 font-extrabold animate-pulse">2</span>
                                <span className="font-extrabold text-slate-600">Compliance Audit</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-slate-200 font-extrabold">3</span>
                                <span className="font-bold text-slate-400">Portal Open</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-md mx-auto space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Facility Type:</span>
                            <span className="font-extrabold text-slate-700">{facilityType || submissionDetails?.facility_type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Registration Number:</span>
                            <span className="font-mono text-slate-700 font-extrabold">{businessRegistrationNumber || submissionDetails?.business_registration_number}</span>
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
                onClick={() => navigate('/client/dashboard')}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
            >
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            {/* Rejection Alert */}
            {currentStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 text-red-800">
                    <FiAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                        <h4 className="font-black text-sm">Corporate Entity Verification Rejected</h4>
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
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="relative z-10 max-w-xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-md">
                        <FiShield className="w-3.5 h-3.5" /> Corporate Audit Portal
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Facility Verification Registry</h1>
                    <p className="text-indigo-100 text-xs md:text-sm font-medium leading-relaxed">
                        Verify your corporate EIN / Registration numbers, physical facility locations, and business permits. Audit approvals unlock clinical recruitment campaigns.
                    </p>
                </div>
            </div>

            {/* Redesigned Dual Panel Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: COMPLIANCE CHECKLIST PANEL */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-6">
                        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                            Enterprise Audit Checklist
                        </h3>

                        {/* Progress Meter */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">Audit Completeness</span>
                                <span className="text-lg font-black text-indigo-600">{completion}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${completion}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Document Checklist Items */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${businessRegistrationNumber ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {businessRegistrationNumber ? <FiCheck className="w-3.5 h-3.5" /> : '1'}
                                </span>
                                <span className={`text-xs font-semibold ${businessRegistrationNumber ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Business Reg No. (EIN)
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${facilityType ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {facilityType ? <FiCheck className="w-3.5 h-3.5" /> : '2'}
                                </span>
                                <span className={`text-xs font-semibold ${facilityType ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Facility Type Classification
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${street && city && state ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {street && city && state ? <FiCheck className="w-3.5 h-3.5" /> : '3'}
                                </span>
                                <span className={`text-xs font-semibold ${street && city && state ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Physical Business Location
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${licenseUrl ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {licenseUrl ? <FiCheck className="w-3.5 h-3.5" /> : '4'}
                                </span>
                                <span className={`text-xs font-semibold ${licenseUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Corporate Practice Permit
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${proofAddressUrl ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {proofAddressUrl ? <FiCheck className="w-3.5 h-3.5" /> : '5'}
                                </span>
                                <span className={`text-xs font-semibold ${proofAddressUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Corporate Proof of Address
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${repIdUrl ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-50 text-slate-300'
                                    }`}>
                                    {repIdUrl ? <FiCheck className="w-3.5 h-3.5" /> : '6'}
                                </span>
                                <span className={`text-xs font-semibold ${repIdUrl ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Representative Legal ID
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: MAIN INTERACTIVE FORM BLOCK */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* SECTION 1: Corporate Registry */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <FiBriefcase className="text-indigo-600 text-lg" />
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                                        1. Corporate Credentials
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-450 uppercase block">Corporate Registration No. (EIN/CAC) <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={businessRegistrationNumber}
                                            onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                                            placeholder="e.g. RC-1849202 or EIN-984204"
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-450 uppercase block">Healthcare Facility Type <span className="text-red-500">*</span></label>
                                        <select
                                            value={facilityType}
                                            onChange={(e) => setFacilityType(e.target.value)}
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled>Select facility type...</option>
                                            <option value="Acute Care Hospital">Acute Care Hospital</option>
                                            <option value="Outpatient Clinic">Outpatient Clinic</option>
                                            <option value="Rehabilitation Facility">Rehabilitation Facility</option>
                                            <option value="Long-Term Care Facility">Long-Term Care Facility</option>
                                            <option value="Skilled Nursing Facility">Skilled Nursing Facility</option>
                                            <option value="Urgent Care Center">Urgent Care Center</option>
                                            <option value="Community Health Center">Community Health Center</option>
                                            <option value="Telehealth">Telehealth Portal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: Physical Corporate Location */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <FiMapPin className="text-indigo-600 text-lg" />
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                                        2. Corporate Facility Location
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5 md:col-span-3">
                                        <label className="text-xs font-bold text-slate-455 block">Street Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            placeholder="e.g. 15, Admiralty Way, Lekki Phase 1"
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-455 block">City <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Lagos"
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-455 block">State / Province <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="Lagos State"
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-455 block">Zip / Postal Code <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                            placeholder="100001"
                                            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-800 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Mandated Credentials Dossier */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <FiShield className="text-indigo-600 text-lg" />
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                                        3. Mandated Enterprise Credentials
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Business License */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-455 block">Business Licensure or Medical Practice Permit Document <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                <FiUploadCloud className={`w-8 h-8 ${licenseUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                <span className="text-xs font-bold text-slate-700 text-center">
                                                    {uploadingLicense ? 'Uploading permit...' : licenseUrl ? 'License document loaded!' : 'Select Corporate License'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, setLicenseUrl, setUploadingLicense)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {licenseUrl && (
                                                <a href={licenseUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                    <FiExternalLink className="w-5 h-5 text-indigo-600" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Proof of Corporate Address */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-455 block">Official Proof of Corporate Address (Utility Bill, Tenancy Agreement) <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                <FiUploadCloud className={`w-8 h-8 ${proofAddressUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                <span className="text-xs font-bold text-slate-700 text-center">
                                                    {uploadingProofAddress ? 'Uploading address proof...' : proofAddressUrl ? 'Address proof loaded!' : 'Select Proof of Address'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, setProofAddressUrl, setUploadingProofAddress)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {proofAddressUrl && (
                                                <a href={proofAddressUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                    <FiExternalLink className="w-5 h-5 text-indigo-600" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Representative ID */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-455 block">Representative Legal ID (Passport, National ID or Recruiter License Card) <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex flex-col items-center justify-center flex-grow p-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 rounded-2xl cursor-pointer transition-all">
                                                <FiUploadCloud className={`w-8 h-8 ${repIdUrl ? 'text-emerald-500' : 'text-slate-400'} mb-2`} />
                                                <span className="text-xs font-bold text-slate-700 text-center">
                                                    {uploadingRepId ? 'Uploading ID...' : repIdUrl ? 'ID document loaded!' : 'Select Representative ID'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, setRepIdUrl, setUploadingRepId)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {repIdUrl && (
                                                <a href={repIdUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
                                                    <FiExternalLink className="w-5 h-5 text-indigo-600" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT ROW */}
                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex gap-2 text-slate-400 text-[10px] max-w-sm">
                                    <FiHome className="w-4.5 h-4.5 text-slate-350 flex-shrink-0 mt-0.5" />
                                    <p className="font-semibold leading-normal">
                                        By executing submission, you attest that this organization is a legitimate, fully licensed healthcare clinical entity.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploadingLicense || uploadingProofAddress || uploadingRepId}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-800 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiLoader className="animate-spin w-4 h-4" /> Submitting Dossier...
                                        </>
                                    ) : (
                                        'Submit Corporate Dossier'
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
