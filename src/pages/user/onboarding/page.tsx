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
    FiEye,
    FiEdit2,
    FiTrash2,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const getTrimmedFileName = (file: File | null, url: string, maxLength = 22) => {
    let name = '';
    if (file) {
        name = file.name;
    } else if (url) {
        try {
            const decoded = decodeURIComponent(url);
            name = decoded.substring(decoded.lastIndexOf('/') + 1);
            if (name.includes('?')) {
                name = name.split('?')[0];
            }
        } catch (e) {
            name = 'document.pdf';
        }
    }
    if (!name) return 'document';
    if (name.length <= maxLength) return name;
    
    const dotIdx = name.lastIndexOf('.');
    if (dotIdx !== -1 && name.length - dotIdx <= 8) {
        const ext = name.substring(dotIdx);
        const nameWithoutExt = name.substring(0, dotIdx);
        const keepLen = maxLength - ext.length - 3;
        if (keepLen > 0) {
            return nameWithoutExt.substring(0, keepLen) + '...' + ext;
        }
    }
    return name.substring(0, maxLength - 3) + '...';
};

const isImageFile = (file: File | null, url: string) => {
    if (file) {
        return file.type.startsWith('image/');
    }
    if (url) {
        const lowercaseUrl = url.toLowerCase();
        return lowercaseUrl.includes('.png') || 
               lowercaseUrl.includes('.jpg') || 
               lowercaseUrl.includes('.jpeg') || 
               lowercaseUrl.includes('.webp') || 
               lowercaseUrl.includes('.gif') || 
               lowercaseUrl.includes('image');
    }
    return false;
};

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

    // Selected local files
    const [degreeFile, setDegreeFile] = useState<File | null>(null);
    const [idFile, setIdFile] = useState<File | null>(null);
    const [licenceFile, setLicenceFile] = useState<File | null>(null);
    const [schoolLetterFile, setSchoolLetterFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Local previews
    const [degreePreview, setDegreePreview] = useState('');
    const [idPreview, setIdPreview] = useState('');
    const [licencePreview, setLicencePreview] = useState('');
    const [schoolLetterPreview, setSchoolLetterPreview] = useState('');

    // Active wizard step
    const [activeStep, setActiveStep] = useState(0);
    // Checklist collapsible state on mobile
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);

    useEffect(() => {
        setDegreePreview(degreeUrl);
    }, [degreeUrl]);

    useEffect(() => {
        setIdPreview(idUrl);
    }, [idUrl]);

    useEffect(() => {
        setLicencePreview(licenceUrl);
    }, [licenceUrl]);

    useEffect(() => {
        setSchoolLetterPreview(schoolLetterUrl);
    }, [schoolLetterUrl]);

    useEffect(() => {
        if (!degreeFile) return;
        const objectUrl = URL.createObjectURL(degreeFile);
        setDegreePreview(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [degreeFile]);

    useEffect(() => {
        if (!idFile) return;
        const objectUrl = URL.createObjectURL(idFile);
        setIdPreview(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [idFile]);

    useEffect(() => {
        if (!licenceFile) return;
        const objectUrl = URL.createObjectURL(licenceFile);
        setLicencePreview(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [licenceFile]);

    useEffect(() => {
        if (!schoolLetterFile) return;
        const objectUrl = URL.createObjectURL(schoolLetterFile);
        setSchoolLetterPreview(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [schoolLetterFile]);

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

    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: (file: File | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Format check: PDF, DOCX, JPG, PNG only
        const allowedExtensions = ['pdf', 'docx', 'jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            toast.error("Only PDF, DOCX, JPG, and PNG files are allowed for documents.");
            return;
        }

        // Size check: Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size exceeds the 10MB limit.');
            return;
        }

        setFile(file);
        toast.success(`Selected file: ${file.name}`);
    };

    const uploadSingleFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_type', 'document');
        const res = await uploadMedia(formData).unwrap();
        return res.media.url;
    };

    // Step navigation and validation
    const handleNextStep = () => {
        if (activeStep === 0) {
            if (!specialty) {
                toast.error('Please select your specialty.');
                return;
            }
            setActiveStep(1);
        } else if (activeStep === 1) {
            if (isIntern) {
                const currentSchoolLetter = schoolLetterFile || schoolLetterUrl;
                if (!currentSchoolLetter) {
                    toast.error('Internship/School Placement letter is required.');
                    return;
                }
            } else {
                if (!licenceNumber.trim()) {
                    toast.error('Professional Licence Number is required.');
                    return;
                }
                if (!licenceExpiry) {
                    toast.error('Licence Expiry date is required.');
                    return;
                }
                const currentLicence = licenceFile || licenceUrl;
                if (!currentLicence) {
                    toast.error('Licence Document is required.');
                    return;
                }
            }
            setActiveStep(2);
        }
    };

    const handlePrevStep = () => {
        setActiveStep(prev => Math.max(0, prev - 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!specialty) {
            toast.error('Please select your specialty.');
            setActiveStep(0);
            return;
        }

        const currentDegree = degreeFile || degreeUrl;
        if (!currentDegree) {
            toast.error('Degree Certificate is required.');
            setActiveStep(2);
            return;
        }

        const currentId = idFile || idUrl;
        if (!currentId) {
            toast.error('Identity Document is required.');
            setActiveStep(2);
            return;
        }

        if (isIntern) {
            const currentSchoolLetter = schoolLetterFile || schoolLetterUrl;
            if (!currentSchoolLetter) {
                toast.error('Internship/School Placement letter is required.');
                setActiveStep(1);
                return;
            }
        } else {
            if (!licenceNumber.trim()) {
                toast.error('Professional Licence Number is required.');
                setActiveStep(1);
                return;
            }
            if (!licenceExpiry) {
                toast.error('Licence Expiry date is required.');
                setActiveStep(1);
                return;
            }
            const currentLicence = licenceFile || licenceUrl;
            if (!currentLicence) {
                toast.error('Licence Document is required.');
                setActiveStep(1);
                return;
            }
        }

        let finalDegreeUrl = degreeUrl;
        let finalIdUrl = idUrl;
        let finalSchoolLetterUrl = schoolLetterUrl;
        let finalLicenceUrl = licenceUrl;

        try {
            setIsUploading(true);

            if (degreeFile) {
                toast.loading('Uploading Degree Certificate...', { id: 'onboarding-upload' });
                finalDegreeUrl = await uploadSingleFile(degreeFile);
            }
            if (idFile) {
                toast.loading('Uploading Identity Document...', { id: 'onboarding-upload' });
                finalIdUrl = await uploadSingleFile(idFile);
            }
            if (isIntern) {
                if (schoolLetterFile) {
                    toast.loading('Uploading Internship Letter...', { id: 'onboarding-upload' });
                    finalSchoolLetterUrl = await uploadSingleFile(schoolLetterFile);
                }
            } else {
                if (licenceFile) {
                    toast.loading('Uploading Licence Certificate...', { id: 'onboarding-upload' });
                    finalLicenceUrl = await uploadSingleFile(licenceFile);
                }
            }

            toast.loading('Submitting verification credentials...', { id: 'onboarding-upload' });

            const payload = {
                is_intern: isIntern,
                specialty,
                employment_status: employmentStatus,
                current_workplace: currentWorkplace || null,
                degree_document_url: finalDegreeUrl,
                id_document_url: finalIdUrl,
                ...(isIntern
                    ? { school_or_placement_letter_url: finalSchoolLetterUrl }
                    : { licence_number: licenceNumber, licence_expiry: licenceExpiry, licence_document_url: finalLicenceUrl }
                )
            };

            await submitOnboarding(payload).unwrap();

            // Clear selected local files
            setDegreeFile(null);
            setIdFile(null);
            setSchoolLetterFile(null);
            setLicenceFile(null);

            toast.success('Onboarding submission successfully uploaded for review!', { id: 'onboarding-upload' });
            refetchStatus();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || 'Failed to submit onboarding details.', { id: 'onboarding-upload' });
        } finally {
            setIsUploading(false);
        }
    };

    // Calculate completion metrics
    const getCompletionPercentage = () => {
        let total = 4; // Specialty, Employment, Degree, ID
        let completed = 0;

        if (specialty) completed++;
        if (employmentStatus) completed++;
        if (degreeUrl || degreeFile) completed++;
        if (idUrl || idFile) completed++;

        if (isIntern) {
            total += 1; // School placement letter
            if (schoolLetterUrl || schoolLetterFile) completed++;
        } else {
            total += 3; // Licence number, expiry, licence certificate
            if (licenceNumber) completed++;
            if (licenceExpiry) completed++;
            if (licenceUrl || licenceFile) completed++;
        }

        return Math.round((completed / total) * 100);
    };

    const completion = getCompletionPercentage();

    if (isStatusLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <FiLoader className="animate-spin h-10 w-10 text-blue-600" />
                    <p className="text-slate-500 font-bold text-sm">Validating credentials registry...</p>
                </div>
            </div>
        );
    }

    const currentStatus = statusData?.onboarding_status || 'not_started';

    // RENDER: Approved / Verified Screen
    if (currentStatus === 'approved') {
        return (
            <div className="max-w-3xl mx-auto space-y-6 py-8 animate-fadeIn duration-500 text-slate-700 px-4">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden text-center p-8 md:p-12 space-y-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                    
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-4 border-emerald-100/60 animate-bounce">
                        <FiCheckCircle className="w-12 h-12" />
                    </div>

                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-205 tracking-wider uppercase">
                            <FiShield className="w-3.5 h-3.5" /> Verified Practitioner
                        </span>
                        <h1 className="text-3xl font-black text-slate-850 tracking-tight">Credentials Approved!</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-medium">
                            Congratulations! Your professional clinician profile documents have been audited and certified by the MedHirePro Registry Board.
                        </p>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Certified Seal / Box */}
                    <div className="max-w-md mx-auto border-2 border-dashed border-emerald-200 bg-emerald-50/10 rounded-2xl p-6 text-left space-y-4 relative">
                        <div className="absolute right-4 top-4 text-emerald-500/10 text-7xl font-black select-none pointer-events-none uppercase">SEAL</div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Clinician Name</span>
                                <span className="font-extrabold text-slate-800 text-sm block mt-0.5">{userData?.full_name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Registered Specialty</span>
                                <span className="font-extrabold text-slate-800 text-sm block mt-0.5">{specialty || submissionDetails?.specialty}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Account Type</span>
                                <span className="font-extrabold text-slate-800 text-sm block mt-0.5">{isIntern ? 'Clinical Intern / Student' : 'Fully Licensed'}</span>
                            </div>
                            {!isIntern && (
                                <div>
                                    <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Licence Number</span>
                                    <span className="font-mono font-extrabold text-slate-800 text-sm block mt-0.5">{licenceNumber || submissionDetails?.licence_number}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={() => navigate('/user/dashboard')}
                            className="px-8 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                            Go to Console Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Pending Review Screen
    if (currentStatus === 'pending') {
        return (
            <div className="max-w-3xl mx-auto space-y-6 py-8 animate-fadeIn text-slate-700 px-4">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors mb-2 cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12 text-center space-y-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>

                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 border-4 border-blue-100">
                        <FiClock className="w-12 h-12 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200/50 tracking-wider uppercase">
                            <FiClock className="w-3.5 h-3.5" /> Audit Pending
                        </span>
                        <h1 className="text-3xl font-black text-slate-850 tracking-tight">Verification in Progress</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-medium">
                            Your professional credentials dossier is queued for audit by the administrative registry officers. We will review and activate your account shortly.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="max-w-md mx-auto pt-6 pb-2 text-[10px]">
                        <div className="flex justify-between relative">
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-10">
                                <div className="h-full bg-blue-600 w-1/2"></div>
                            </div>

                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-blue-500 font-extrabold shadow-sm">1</span>
                                <span className="font-extrabold text-slate-700">Dossier Sent</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border-2 border-blue-300 font-extrabold animate-pulse shadow-sm">2</span>
                                <span className="font-extrabold text-slate-600">Compliance Audit</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                                <span className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border-2 border-slate-200 font-extrabold">3</span>
                                <span className="font-bold text-slate-400">Registry Match</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Submission Metadata */}
                    <div className="text-left bg-slate-50 rounded-2xl p-5 max-w-md mx-auto space-y-3 text-xs border border-slate-150/40">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">Registered Specialty:</span>
                            <span className="font-extrabold text-slate-700">{specialty || submissionDetails?.specialty}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">Designation Status:</span>
                            <span className="font-extrabold text-slate-700">{isIntern ? 'Clinical Intern / Student' : 'Fully Licensed Clinician'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">Submission Registry ID:</span>
                            <span className="font-mono text-slate-500 font-bold tracking-tight bg-white border border-slate-200 px-2 py-0.5 rounded-md">{statusData?.submission?._id}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Helper render function for dropzones
    const renderDropzone = (inputId: string, labelText: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (
            <label
                htmlFor={inputId}
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-255 hover:border-blue-400 hover:bg-blue-50/5 rounded-2xl cursor-pointer transition-all group text-center"
            >
                <input
                    id={inputId}
                    type="file"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={onChange}
                    className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:border-blue-150 group-hover:text-blue-600 transition-all mb-3 shadow-xs">
                    <FiUploadCloud className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-slate-700 block group-hover:text-blue-600 transition-colors">
                    {labelText}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Supports PDF, DOCX, JPG, PNG up to 10MB
                </span>
            </label>
        );
    };

    // Helper render function for file previews
    const renderFilePreview = (file: File | null, url: string, previewUrl: string, onRemove: () => void, inputId: string) => {
        const isImage = isImageFile(file, url);
        const fileName = getTrimmedFileName(file, url);

        return (
            <div className="w-full flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-4 animate-fadeIn">
                {isImage && previewUrl ? (
                    <img src={previewUrl} alt={fileName} className="w-16 h-16 object-cover rounded-xl border border-slate-205 shadow-sm flex-shrink-0" />
                ) : (
                    <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-2xl flex-shrink-0">
                        <FiBookOpen />
                    </div>
                )}

                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-800 truncate" title={file?.name || url}>
                        {fileName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Cloud Registry Document'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 flex-shrink-0">
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-55 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors shadow-xs"
                    >
                        <FiEye className="w-3.5 h-3.5 text-blue-600" /> View
                    </a>
                    <label
                        htmlFor={inputId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-55 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer shadow-xs"
                    >
                        <FiEdit2 className="w-3.5 h-3.5 text-amber-600" /> Change
                    </label>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-[11px] font-bold text-red-650 transition-colors shadow-xs"
                    >
                        <FiTrash2 className="w-3.5 h-3.5 text-red-500" /> Remove
                    </button>
                </div>
            </div>
        );
    };

    // Wizard Step Configuration
    const steps = [
        { label: 'Designation', desc: 'Category & Specialty', icon: <FiUser className="w-4 h-4" /> },
        { label: 'Credentials', desc: 'Licence or Letter', icon: <FiBriefcase className="w-4 h-4" /> },
        { label: 'Identity', desc: 'Identity Documents', icon: <FiBookOpen className="w-4 h-4" /> }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 py-6 animate-fadeIn text-slate-700 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
            </div>

            {/* Rejection Alert */}
            {currentStatus === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 text-red-850 shadow-xs animate-fadeIn">
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

            {/* Portal Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-6 md:p-8 text-white shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-semibold backdrop-blur-md">
                            <FiShield className="w-3.5 h-3.5" /> Registry Verification Portal
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Clinician Dossier Upload</h1>
                        <p className="text-blue-100 text-xs md:text-sm font-medium leading-relaxed">
                            Verify your academic degrees and medical licensure credentials in a few quick steps. Completed dossiers receive priority listing access.
                        </p>
                    </div>

                    {/* Progress Meter */}
                    <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2 text-right w-full md:w-48 shadow-sm">
                        <div className="flex justify-between items-baseline md:flex-col md:items-end">
                            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wide">Dossier Completeness</span>
                            <span className="text-3xl font-black text-white">{completion}%</span>
                        </div>
                        <div className="w-full bg-white/25 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${completion}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Stepper Progress Indicator */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {steps.map((step, idx) => {
                        const isCompleted = activeStep > idx;
                        const isActive = activeStep === idx;
                        return (
                            <React.Fragment key={idx}>
                                <div className="flex flex-col sm:flex-row items-center gap-2.5 z-10 cursor-pointer" onClick={() => {
                                    if (idx < activeStep || (idx === 1 && specialty) || (idx === 2 && specialty && ((isIntern && (schoolLetterFile || schoolLetterUrl)) || (!isIntern && licenceNumber && licenceExpiry && (licenceFile || licenceUrl))))) {
                                        setActiveStep(idx);
                                    }
                                }}>
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-300 ${
                                            isCompleted
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                                : isActive
                                                ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-500/10'
                                                : 'bg-slate-50 border-slate-205 text-slate-400'
                                        }`}
                                    >
                                        {isCompleted ? <FiCheck className="w-4 h-4" /> : step.icon}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-semibold hidden md:block mt-0.5">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>

                                {idx < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 bg-slate-100 mx-2 sm:mx-4">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-500"
                                            style={{ width: activeStep > idx ? '100%' : '0%' }}
                                        ></div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Split layout (Checklist on desktop, wizard content in middle) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Collapsible checklist index on mobile, always visible on desktop */}
                <div className="lg:block">
                    <div className="bg-white rounded-2xl border border-slate-150/60 shadow-lg p-5 space-y-4">
                        <div 
                            className="flex justify-between items-center cursor-pointer lg:cursor-default" 
                            onClick={() => setIsChecklistOpen(!isChecklistOpen)}
                        >
                            <h3 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                                Required Documents Checklist
                            </h3>
                            <button className="lg:hidden text-xs text-blue-600 font-bold cursor-pointer bg-transparent border-0 outline-none">
                                {isChecklistOpen ? 'Hide Index' : 'Show Index'}
                            </button>
                        </div>
                        
                        <div className={`space-y-4 pt-2 lg:block ${isChecklistOpen ? 'block' : 'hidden'}`}>
                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${specialty ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-350'}`}>
                                    {specialty ? <FiCheck className="w-3 h-3" /> : '1'}
                                </span>
                                <span className={`text-xs font-semibold ${specialty ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Clinical Specialty Select
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${(degreeFile || degreeUrl) ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-350'}`}>
                                    {(degreeFile || degreeUrl) ? <FiCheck className="w-3 h-3" /> : '2'}
                                </span>
                                <span className={`text-xs font-semibold ${(degreeFile || degreeUrl) ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Degree Certificate Upload
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${(idFile || idUrl) ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-350'}`}>
                                    {(idFile || idUrl) ? <FiCheck className="w-3 h-3" /> : '3'}
                                </span>
                                <span className={`text-xs font-semibold ${(idFile || idUrl) ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Government ID Upload
                                </span>
                            </div>

                            {isIntern ? (
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${(schoolLetterFile || schoolLetterUrl) ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-350'}`}>
                                        {(schoolLetterFile || schoolLetterUrl) ? <FiCheck className="w-3 h-3" /> : '4'}
                                    </span>
                                    <span className={`text-xs font-semibold ${(schoolLetterFile || schoolLetterUrl) ? 'text-slate-700' : 'text-slate-400'}`}>
                                        Internship Placement Letter
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${licenceNumber && licenceExpiry ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-350'}`}>
                                            {licenceNumber && licenceExpiry ? <FiCheck className="w-3 h-3" /> : '4'}
                                        </span>
                                        <span className={`text-xs font-semibold ${licenceNumber && licenceExpiry ? 'text-slate-700' : 'text-slate-400'}`}>
                                            Licence Details (No/Expiry)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${(licenceFile || licenceUrl) ? 'bg-blue-50 text-blue-600 font-black' : 'bg-slate-50 text-slate-350'}`}>
                                            {(licenceFile || licenceUrl) ? <FiCheck className="w-3 h-3" /> : '5'}
                                        </span>
                                        <span className={`text-xs font-semibold ${(licenceFile || licenceUrl) ? 'text-slate-700' : 'text-slate-400'}`}>
                                            Licence Certificate Document
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Interactive Form Card (wizard panel) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-slate-150/60 shadow-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* STEP 0: Professional Designation & Settings */}
                            {activeStep === 0 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-slate-805 flex items-center gap-2">
                                            <FiUser className="text-blue-650" /> Professional Settings
                                        </h3>
                                        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                                            Configure your clinical category and active affiliations.
                                        </p>
                                    </div>

                                    <hr className="border-slate-100" />

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
                                            <label className="text-[12px] font-bold text-slate-500 uppercase block">Employment Category <span className="text-red-500">*</span></label>
                                            <select
                                                value={employmentStatus}
                                                onChange={(e) => setEmploymentStatus(e.target.value)}
                                                className="w-full bg-[#f4f8fc] border border-transparent rounded-xl p-3.5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-705 outline-none cursor-pointer"
                                                required
                                            >
                                                <option value="FULL_TIME">Full Time</option>
                                                <option value="PART_TIME">Part Time</option>
                                                <option value="CONTRACT">Contract Basis</option>
                                                <option value="LOCUM">Locum Placements</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[12px] font-bold text-slate-505 uppercase block">Current Workplace / Hospital Affiliation</label>
                                            <input
                                                type="text"
                                                value={currentWorkplace}
                                                onChange={(e) => setCurrentWorkplace(e.target.value)}
                                                placeholder="e.g. Saint Nicholas Hospital, Lagos"
                                                className="w-full bg-[#f4f8fc] border border-transparent rounded-xl p-3.5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 1: Clinical Licensure & Credentials */}
                            {activeStep === 1 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                                <FiBriefcase className="text-blue-650" /> Licensure & Attestations
                                            </h3>
                                            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                                                Select clinical designation (fully licensed or intern) and upload verification files.
                                            </p>
                                        </div>

                                        {/* Intern Switcher Toggle */}
                                        <label className="inline-flex items-center gap-3 cursor-pointer self-start sm:self-auto bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/50">
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
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clinical Intern?</span>
                                            <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 flex-shrink-0 animate-fadeIn"></div>
                                        </label>
                                    </div>

                                    <hr className="border-slate-100" />

                                    {isIntern ? (
                                        /* INTERN ATTESTATION UPLOAD */
                                        <div className="space-y-5 animate-fadeIn">
                                            <div className="flex gap-2 text-sky-900 bg-sky-50/50 border border-sky-100/50 rounded-2xl p-5 text-xs font-semibold leading-relaxed">
                                                <FiCheckCircle className="w-4 h-4 text-sky-605 flex-shrink-0 mt-0.5" />
                                                <p>
                                                    Intern accounts bypass state medical licenses by submitting an active Dean Letter or clinical rotation assignment document.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[12px] font-bold text-slate-500 uppercase block">School Placement / Intern Letter Document <span className="text-red-500">*</span></label>
                                                
                                                {schoolLetterFile || schoolLetterUrl ? (
                                                    renderFilePreview(schoolLetterFile, schoolLetterUrl, schoolLetterPreview, () => {
                                                        setSchoolLetterFile(null);
                                                        setSchoolLetterUrl('');
                                                        setSchoolLetterPreview('');
                                                    }, 'school-letter-upload')
                                                ) : (
                                                    renderDropzone('school-letter-upload', 'Upload Placement Letter', (e) => handleFileSelect(e, setSchoolLetterFile))
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        /* STANDARD LICENCE DETAILS */
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-bold text-slate-500 uppercase block">Licence Number <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={licenceNumber}
                                                    onChange={(e) => setLicenceNumber(e.target.value)}
                                                    placeholder="e.g. MDCN/R/12942"
                                                    className="w-full bg-[#f4f8fc] border border-transparent rounded-xl p-3.5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-700 outline-none"
                                                    required={!isIntern}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-bold text-slate-505 uppercase block">Licence Expiry Date <span className="text-red-500">*</span></label>
                                                <input
                                                    type="date"
                                                    value={licenceExpiry}
                                                    onChange={(e) => setLicenceExpiry(e.target.value)}
                                                    className="w-full bg-[#f4f8fc] border border-transparent rounded-xl p-3.5 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-700 outline-none cursor-pointer"
                                                    required={!isIntern}
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[12px] font-bold text-slate-500 uppercase block">Active Licence Certificate Document <span className="text-red-500">*</span></label>
                                                
                                                {licenceFile || licenceUrl ? (
                                                    renderFilePreview(licenceFile, licenceUrl, licencePreview, () => {
                                                        setLicenceFile(null);
                                                        setLicenceUrl('');
                                                        setLicencePreview('');
                                                    }, 'licence-upload')
                                                ) : (
                                                    renderDropzone('licence-upload', 'Upload Licence Certificate', (e) => handleFileSelect(e, setLicenceFile))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 2: Mandated Identification & Academic Credentials */}
                            {activeStep === 2 && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-slate-805 flex items-center gap-2">
                                            <FiBookOpen className="text-blue-650" /> Identity & Degrees
                                        </h3>
                                        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                                            Upload clinical academic degrees and government-issued identification cards.
                                        </p>
                                    </div>

                                    <hr className="border-slate-100" />

                                    <div className="space-y-6">
                                        {/* Degree Certificate */}
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-500 block">DEGREE / TRANSCRIPTS CERTIFICATE <span className="text-red-500">*</span></label>
                                            
                                            {degreeFile || degreeUrl ? (
                                                renderFilePreview(degreeFile, degreeUrl, degreePreview, () => {
                                                    setDegreeFile(null);
                                                    setDegreeUrl('');
                                                    setDegreePreview('');
                                                }, 'degree-upload')
                                            ) : (
                                                renderDropzone('degree-upload', 'Upload Degree Certificate', (e) => handleFileSelect(e, setDegreeFile))
                                            )}
                                        </div>

                                        {/* Government ID Document */}
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-bold text-slate-500 block">GOVERNMENT ISSUED IDENTIFICATION DOCUMENT <span className="text-red-500">*</span></label>
                                            
                                            {idFile || idUrl ? (
                                                renderFilePreview(idFile, idUrl, idPreview, () => {
                                                    setIdFile(null);
                                                    setIdUrl('');
                                                    setIdPreview('');
                                                }, 'id-upload')
                                            ) : (
                                                renderDropzone('id-upload', 'Upload ID Card Document', (e) => handleFileSelect(e, setIdFile))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WIZARD ACTIONS & SUBMIT */}
                            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                
                                {/* Attestation notice only visible on last step */}
                                {activeStep === 2 ? (
                                    <div className="flex gap-2 text-slate-400 text-[10px] max-w-sm">
                                        <FiUserCheck className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                                        <p className="font-semibold leading-relaxed">
                                            By submitting, you attest that all uploaded licensure documents and academic certificates are authentic and certified.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                        Step {activeStep + 1} of 3
                                    </div>
                                )}

                                <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
                                    {activeStep > 0 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer bg-white"
                                        >
                                            <FiChevronLeft className="w-4 h-4" /> Back
                                        </button>
                                    )}

                                    {activeStep < 2 ? (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                        >
                                            Next <FiChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isUploading}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                        >
                                            {isSubmitting || isUploading ? (
                                                <>
                                                    <FiLoader className="animate-spin w-4 h-4" /> Registering Dossier...
                                                </>
                                            ) : (
                                                <>
                                                    <FiUserCheck className="w-4 h-4" /> Submit Dossier
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
