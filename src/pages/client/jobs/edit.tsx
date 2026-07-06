import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    useGetJobListingDetailsQuery, 
    useUpdateJobListingMutation 
} from '../../../redux/apis/jobsApi';
import { CLIENT_ROUTES } from '../routes.enum';
import { 
    FiArrowLeft, 
    FiLoader, 
    FiCheckCircle, 
    FiBriefcase,
    FiClock,
    FiMapPin,
    FiDollarSign,
    FiFileText,
    FiCalendar,
    FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
    ClinicalSpecialty, 
    ClinicalSetting, 
    RateType,
    JobStatus
} from '../../../redux/apis/jobsApi/interface';
import type { IJobListingUpdate } from '../../../redux/apis/jobsApi/interface';

export default function EditJobPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Query & Mutation
    const { data: job, isLoading: isJobLoading, error: jobError } = useGetJobListingDetailsQuery(id || '', { skip: !id });
    const [updateJobListing, { isLoading: isUpdating }] = useUpdateJobListingMutation();

    // Core states
    const [status, setStatus] = useState<JobStatus>('OPEN');
    const [positionTitle, setPositionTitle] = useState('');
    const [clinicalSpecialty, setClinicalSpecialty] = useState<ClinicalSpecialty>(ClinicalSpecialty.GENERAL_PRACTICE);
    const [clinicalSetting, setClinicalSetting] = useState<ClinicalSetting>(ClinicalSetting.OUTPATIENT_CLINIC);
    const [departmentUnit, setDepartmentUnit] = useState('');
    const [description, setDescription] = useState('');
    const [requiredCredentialsInput, setRequiredCredentialsInput] = useState('');
    const [minimumExperienceYears, setMinimumExperienceYears] = useState(1);
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [country, setCountry] = useState('Nigeria');
    const [rateType, setRateType] = useState<RateType>('MONTHLY');
    const [rateAmountMin, setRateAmountMin] = useState<number>(0);
    const [rateAmountMax, setRateAmountMax] = useState<number>(0);

    // Permanent specific states
    const [acceptsInterns, setAcceptsInterns] = useState(false);
    const [rotationSchedule, setRotationSchedule] = useState('');
    const [fringeBenefitsInput, setFringeBenefitsInput] = useState('');

    // Locum specific states
    const [coverageStartDate, setCoverageStartDate] = useState('');
    const [coverageEndDate, setCoverageEndDate] = useState('');
    const [shiftHours, setShiftHours] = useState('');
    const [malpracticeInsuranceProvided, setMalpracticeInsuranceProvided] = useState(false);
    const [travelHousingReimbursement, setTravelHousingReimbursement] = useState(false);
    const [onCallRequirements, setOnCallRequirements] = useState('');

    // Prefill form when data is loaded
    useEffect(() => {
        if (job) {
            setStatus(job.status);
            setPositionTitle(job.position_title);
            setClinicalSpecialty(job.clinical_specialty);
            setClinicalSetting(job.clinical_setting);
            setDepartmentUnit(job.department_unit);
            setDescription(job.description);
            setRequiredCredentialsInput(job.required_credentials?.join(', ') || '');
            setMinimumExperienceYears(job.minimum_experience_years);
            setCity(job.city);
            setStateName(job.state);
            setCountry(job.country);
            setRateType(job.rate_type);
            setRateAmountMin(job.rate_amount_min);
            setRateAmountMax(job.rate_amount_max);

            if (job.job_type === 'PERMANENT') {
                setAcceptsInterns(!!job.accepts_interns);
                setRotationSchedule(job.rotation_schedule || '');
                setFringeBenefitsInput(job.fringe_benefits?.join(', ') || '');
            } else {
                setCoverageStartDate(job.coverage_start_date ? job.coverage_start_date.substring(0, 10) : '');
                setCoverageEndDate(job.coverage_end_date ? job.coverage_end_date.substring(0, 10) : '');
                setShiftHours(job.shift_hours || '');
                setMalpracticeInsuranceProvided(!!job.malpractice_insurance_provided);
                setTravelHousingReimbursement(!!job.travel_housing_reimbursement);
                setOnCallRequirements(job.on_call_requirements || '');
            }
        }
    }, [job]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !job) return;

        if (rateAmountMin <= 0 || rateAmountMax <= 0) {
            toast.error("Please enter a valid rate amount greater than zero.");
            return;
        }

        if (rateAmountMin > rateAmountMax) {
            toast.error("Minimum rate cannot exceed the maximum rate amount.");
            return;
        }

        // Process lists split by comma
        const required_credentials = requiredCredentialsInput
            ? requiredCredentialsInput.split(',').map(item => item.trim()).filter(Boolean)
            : [];
            
        const fringe_benefits = fringeBenefitsInput
            ? fringeBenefitsInput.split(',').map(item => item.trim()).filter(Boolean)
            : [];

        // Build the update request body
        const body: IJobListingUpdate = {
            status,
            position_title: positionTitle,
            clinical_specialty: clinicalSpecialty,
            clinical_setting: clinicalSetting,
            department_unit: departmentUnit,
            description,
            required_credentials,
            minimum_experience_years: Number(minimumExperienceYears),
            city,
            state: stateName,
            country,
            rate_type: rateType,
            rate_amount_min: Number(rateAmountMin),
            rate_amount_max: Number(rateAmountMax),
        };

        if (job.job_type === 'PERMANENT') {
            body.accepts_interns = acceptsInterns;
            body.rotation_schedule = rotationSchedule || null;
            body.fringe_benefits = fringe_benefits;
            // set locum parameters explicitly to null/false
            body.coverage_start_date = null;
            body.coverage_end_date = null;
            body.shift_hours = null;
            body.malpractice_insurance_provided = false;
            body.travel_housing_reimbursement = false;
            body.on_call_requirements = null;
        } else {
            if (!coverageStartDate || !coverageEndDate) {
                toast.error("Please specify both the coverage start and end dates.");
                return;
            }
            const start = new Date(coverageStartDate);
            const end = new Date(coverageEndDate);
            if (start > end) {
                toast.error("Coverage start date cannot be after the end date.");
                return;
            }

            body.coverage_start_date = new Date(coverageStartDate).toISOString();
            body.coverage_end_date = new Date(coverageEndDate).toISOString();
            body.shift_hours = shiftHours || null;
            body.malpractice_insurance_provided = malpracticeInsuranceProvided;
            body.travel_housing_reimbursement = travelHousingReimbursement;
            body.on_call_requirements = onCallRequirements || null;
            // set permanent parameters explicitly to null/false
            body.accepts_interns = false;
            body.rotation_schedule = null;
            body.fringe_benefits = [];
        }

        try {
            await updateJobListing({ id, body }).unwrap();
            toast.success("Job listing updated successfully!");
            navigate(CLIENT_ROUTES.JOBS);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to update job listing.");
        }
    };

    if (isJobLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Fetching campaign details...</p>
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

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn duration-205">
            {/* Header Breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(CLIENT_ROUTES.JOBS)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-indigo-600 transition-colors cursor-pointer mb-2"
                    >
                        <FiArrowLeft /> Back to Listings
                    </button>
                    <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                        {job.job_type === 'PERMANENT' ? (
                            <FiBriefcase className="text-indigo-600" />
                        ) : (
                            <FiClock className="text-indigo-600" />
                        )}
                        Edit Clinical Campaign
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Modify listing properties and visibility states for this clinical opening.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 2 COLUMNS: DETAILED PARAMETERS FORM */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. CORE ROLE & SPECIALTY */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                            <FiBriefcase className="text-indigo-500" /> 1. Professional Role & Specialty
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Position Title</label>
                                <input
                                    type="text"
                                    required
                                    value={positionTitle}
                                    onChange={(e) => setPositionTitle(e.target.value)}
                                    placeholder="e.g. Pediatric Cardiologist, Staff Nurse"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Clinical Specialty</label>
                                <select
                                    value={clinicalSpecialty}
                                    onChange={(e) => setClinicalSpecialty(e.target.value as ClinicalSpecialty)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 cursor-pointer"
                                >
                                    <option value={ClinicalSpecialty.GENERAL_PRACTICE}>General Practice</option>
                                    <option value={ClinicalSpecialty.INTERNAL_MEDICINE}>Internal Medicine</option>
                                    <option value={ClinicalSpecialty.PEDIATRICS}>Pediatrics</option>
                                    <option value={ClinicalSpecialty.OBSTETRICS_GYNECOLOGY}>Obstetrics & Gynecology</option>
                                    <option value={ClinicalSpecialty.SURGERY}>Surgery</option>
                                    <option value={ClinicalSpecialty.ANESTHESIOLOGY}>Anesthesiology</option>
                                    <option value={ClinicalSpecialty.CARDIOLOGY}>Cardiology</option>
                                    <option value={ClinicalSpecialty.EMERGENCY_MEDICINE}>Emergency Medicine</option>
                                    <option value={ClinicalSpecialty.FAMILY_PRACTICE}>Family Practice</option>
                                    <option value={ClinicalSpecialty.PSYCHIATRY}>Psychiatry</option>
                                    <option value={ClinicalSpecialty.PULMONOLOGY}>Pulmonology</option>
                                    <option value={ClinicalSpecialty.CRITICAL_CARE}>Critical Care</option>
                                    <option value={ClinicalSpecialty.NURSING}>Nursing</option>
                                    <option value={ClinicalSpecialty.PHARMACY}>Pharmacy</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Clinical Setting</label>
                                <select
                                    value={clinicalSetting}
                                    onChange={(e) => setClinicalSetting(e.target.value as ClinicalSetting)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 cursor-pointer"
                                >
                                    <option value={ClinicalSetting.ACUTE_CARE_HOSPITAL}>Acute Care Hospital</option>
                                    <option value={ClinicalSetting.OUTPATIENT_CLINIC}>Outpatient Clinic</option>
                                    <option value={ClinicalSetting.REHABILITATION_FACILITY}>Rehabilitation Facility</option>
                                    <option value={ClinicalSetting.LONG_TERM_CARE}>Long-Term Care Facility</option>
                                    <option value={ClinicalSetting.SKILLED_NURSING_FACILITY}>Skilled Nursing Facility</option>
                                    <option value={ClinicalSetting.URGENT_CARE_CENTER}>Urgent Care Center</option>
                                    <option value={ClinicalSetting.COMMUNITY_HEALTH_CENTER}>Community Health Center</option>
                                    <option value={ClinicalSetting.TELEHEALTH}>Telehealth</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Department Unit</label>
                                <input
                                    type="text"
                                    required
                                    value={departmentUnit}
                                    onChange={(e) => setDepartmentUnit(e.target.value)}
                                    placeholder="e.g. ICU Department, Cardiology Unit"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Minimum Experience (Years)</label>
                                <input
                                    type="number"
                                    min={0}
                                    required
                                    value={minimumExperienceYears}
                                    onChange={(e) => setMinimumExperienceYears(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. DYNAMIC COVERAGE & TIME OPTIONS */}
                    {job.job_type === 'LOCUM' ? (
                        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                                <FiCalendar className="text-indigo-500" /> 2. Placement Coverage Dates & Hours
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Coverage Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={coverageStartDate}
                                        onChange={(e) => setCoverageStartDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-750 cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Coverage End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={coverageEndDate}
                                        onChange={(e) => setCoverageEndDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-750 cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Shift Hours Details</label>
                                    <input
                                        type="text"
                                        required
                                        value={shiftHours}
                                        onChange={(e) => setShiftHours(e.target.value)}
                                        placeholder="e.g. 08:00 - 17:00"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                    />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">On-Call Requirements</label>
                                    <input
                                        type="text"
                                        value={onCallRequirements}
                                        onChange={(e) => setOnCallRequirements(e.target.value)}
                                        placeholder="e.g. 1 in 3 weekend calls"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 pt-4 md:col-span-1 justify-center">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={malpracticeInsuranceProvided}
                                            onChange={(e) => setMalpracticeInsuranceProvided(e.target.checked)}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                                        />
                                        Malpractice Insurance Provided
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={travelHousingReimbursement}
                                            onChange={(e) => setTravelHousingReimbursement(e.target.checked)}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                                        />
                                        Travel & Housing Reimbursed
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                                <FiBriefcase className="text-indigo-500" /> 2. Permanent Placement Parameters
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Rotation Schedule</label>
                                    <input
                                        type="text"
                                        value={rotationSchedule}
                                        onChange={(e) => setRotationSchedule(e.target.value)}
                                        placeholder="e.g. Day shifts, 3 days on 4 days off"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                    />
                                </div>

                                <div className="flex items-center pt-5">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={acceptsInterns}
                                            onChange={(e) => setAcceptsInterns(e.target.checked)}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                                        />
                                        Accepts Clinical Responders / Interns
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. COMPENSATION & LOCATION */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                            <FiDollarSign className="text-indigo-500" /> 3. Compensation & Facility Location
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Rate Frequency</label>
                                <select
                                    value={rateType}
                                    onChange={(e) => setRateType(e.target.value as RateType)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 cursor-pointer"
                                >
                                    <option value="HOURLY">Hourly Rate</option>
                                    <option value="DAILY">Daily Rate</option>
                                    <option value="WEEKLY">Weekly Rate</option>
                                    <option value="MONTHLY">Monthly Rate / Salary</option>
                                    <option value="ANNUALLY">Annual Salary</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide font-extrabold text-slate-700">Minimum Rate (₦) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={rateAmountMin}
                                    onChange={(e) => setRateAmountMin(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide font-extrabold text-slate-700">Maximum Rate (₦) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={rateAmountMax}
                                    onChange={(e) => setRateAmountMax(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide"><FiMapPin className="inline mr-0.5" /> City</label>
                                <input
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">State</label>
                                <input
                                    type="text"
                                    required
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Country</label>
                                <input
                                    type="text"
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. DESCRIPTION & QUALIFICATIONS */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                            <FiFileText className="text-indigo-500" /> 4. Detailed Description & Credentials
                        </h3>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Role Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 leading-relaxed"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Required Credentials</label>
                                    <span className="text-[9px] text-slate-400 font-semibold italic">Separate with commas</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={requiredCredentialsInput}
                                    onChange={(e) => setRequiredCredentialsInput(e.target.value)}
                                    placeholder="e.g. MBBS, MDCN Board License, ACLS"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                />
                            </div>

                            {job.job_type === 'PERMANENT' && (
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Fringe Benefits</label>
                                        <span className="text-[9px] text-slate-400 font-semibold italic">Separate with commas (optional)</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={fringeBenefitsInput}
                                        onChange={(e) => setFringeBenefitsInput(e.target.value)}
                                        placeholder="e.g. Health Insurance, Pension Plan"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT 1 COLUMN: INDEPENDENT STATUS CONTROL & PUBLISHING ACTIONS */}
                <div className="space-y-6 lg:col-span-1">
                    
                    {/* Status widget card (completely outside the main parameters form grid) */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Active Status Control</span>
                            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <span className={`h-2.5 w-2.5 rounded-full inline-block ${
                                    status === 'OPEN' ? 'bg-emerald-500' :
                                    status === 'FILLED' ? 'bg-blue-500' :
                                    status === 'DRAFT' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                Listing Visibility: {status}
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Change Visibility</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as JobStatus)}
                                className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-extrabold text-indigo-750 cursor-pointer"
                            >
                                <option value="OPEN">Open (Active Hiring)</option>
                                <option value="FILLED">Filled (Closed / Placed)</option>
                                <option value="DRAFT">Draft (Saved / Hidden)</option>
                                <option value="EXPIRED">Expired (Hiring Suspended)</option>
                            </select>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-semibold text-slate-450 leading-relaxed space-y-2">
                            <p className="font-black text-slate-500 uppercase tracking-wide">Visibility Rules:</p>
                            <ul className="list-disc pl-3.5 space-y-1 bg-white p-2.5 border border-slate-150 rounded-lg">
                                <li><strong className="text-emerald-600">Open</strong> lists the vacancy immediately in candidate search indexes.</li>
                                <li><strong className="text-blue-600">Filled</strong> flags placement as contracted and locks applications.</li>
                                <li><strong className="text-amber-500">Draft</strong> saves modifications but hides the post from all public searches.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Campaign Action buttons card */}
                    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Campaign Publishing</span>
                        <div className="flex flex-col gap-2.5">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isUpdating ? (
                                    <FiLoader className="animate-spin text-sm" />
                                ) : (
                                    <FiCheckCircle className="text-sm" />
                                )}
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(CLIENT_ROUTES.JOBS)}
                                className="w-full py-3 text-xs text-slate-500 hover:text-slate-800 font-bold bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
