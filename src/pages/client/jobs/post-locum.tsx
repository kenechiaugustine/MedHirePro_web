import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostLocumJobMutation } from '../../../redux/apis/jobsApi';
import { CLIENT_ROUTES } from '../routes.enum';
import { 
    FiArrowLeft, 
    FiLoader, 
    FiCheckCircle, 
    FiClock,
    FiMapPin,
    FiDollarSign,
    FiFileText,
    FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
    ClinicalSpecialty, 
    ClinicalSetting, 
    RateType 
} from '../../../redux/apis/jobsApi/interface';
import { SearchableSelect } from '../../../components/app';

export default function PostLocumJobPage() {
    const navigate = useNavigate();
    const [postLocumJob, { isLoading }] = usePostLocumJobMutation();

    // Form states
    const [positionTitle, setPositionTitle] = useState('');
    const [clinicalSpecialty, setClinicalSpecialty] = useState<ClinicalSpecialty>(ClinicalSpecialty.GENERAL_PRACTICE);
    const [clinicalSetting, setClinicalSetting] = useState<ClinicalSetting>(ClinicalSetting.OUTPATIENT_CLINIC);
    const [departmentUnit, setDepartmentUnit] = useState('');
    const [description, setDescription] = useState('');
    const [requiredCredentialsInput, setRequiredCredentialsInput] = useState('');
    const [minimumExperienceYears, setMinimumExperienceYears] = useState(1);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('Nigeria');
    const [rateType, setRateType] = useState<RateType>('HOURLY');
    const [rateAmountMin, setRateAmountMin] = useState<number>(0);
    const [rateAmountMax, setRateAmountMax] = useState<number>(0);
    const [coverageStartDate, setCoverageStartDate] = useState('');
    const [coverageEndDate, setCoverageEndDate] = useState('');
    const [shiftHours, setShiftHours] = useState('');
    const [malpracticeInsuranceProvided, setMalpracticeInsuranceProvided] = useState(false);
    const [travelHousingReimbursement, setTravelHousingReimbursement] = useState(false);
    const [onCallRequirements, setOnCallRequirements] = useState('');

    const specialtyOptions = Object.values(ClinicalSpecialty).map(spec => ({
        label: spec,
        value: spec,
        group: 'Clinical Specialties'
    }));

    const settingOptions = Object.values(ClinicalSetting).map(set => ({
        label: set,
        value: set,
        group: 'Clinical Settings'
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rateAmountMin <= 0 || rateAmountMax <= 0) {
            toast.error("Please enter a valid rate amount greater than zero.");
            return;
        }

        if (rateAmountMin > rateAmountMax) {
            toast.error("Minimum rate cannot exceed the maximum rate amount.");
            return;
        }

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

        // Process credentials split
        const required_credentials = requiredCredentialsInput
            ? requiredCredentialsInput.split(',').map(item => item.trim()).filter(Boolean)
            : [];

        try {
            await postLocumJob({
                position_title: positionTitle,
                clinical_specialty: clinicalSpecialty,
                clinical_setting: clinicalSetting,
                department_unit: departmentUnit,
                description,
                required_credentials,
                minimum_experience_years: Number(minimumExperienceYears),
                city,
                state,
                country,
                rate_type: rateType,
                rate_amount_min: Number(rateAmountMin),
                rate_amount_max: Number(rateAmountMax),
                coverage_start_date: new Date(coverageStartDate).toISOString(),
                coverage_end_date: new Date(coverageEndDate).toISOString(),
                shift_hours: shiftHours,
                malpractice_insurance_provided: malpracticeInsuranceProvided,
                travel_housing_reimbursement: travelHousingReimbursement,
                on_call_requirements: onCallRequirements || null
            }).unwrap();

            toast.success("Locum job vacancy successfully published!");
            navigate(CLIENT_ROUTES.JOBS);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to publish locum job vacancy.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn duration-200">
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
                        <FiClock className="text-indigo-600" /> Post a Locum Placement
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Fill immediate shifts or short-term clinical gaps with certified locum practitioners.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. SECTION: BASIC JOB INFO */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiClock className="text-indigo-500" /> 1. Professional Role & Department
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Position Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={positionTitle}
                                onChange={(e) => setPositionTitle(e.target.value)}
                                placeholder="e.g. Locum Emergency Physician, Locum Nurse Practitioner"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <SearchableSelect
                                label="Clinical Specialty"
                                placeholder="Select clinical specialty..."
                                options={specialtyOptions}
                                value={clinicalSpecialty}
                                onChange={(val) => setClinicalSpecialty(val as ClinicalSpecialty)}
                                required={true}
                                focusColor="#4f46e5"
                                id="clinical-specialty"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <SearchableSelect
                                label="Clinical Setting"
                                placeholder="Select clinical setting..."
                                options={settingOptions}
                                value={clinicalSetting}
                                onChange={(val) => setClinicalSetting(val as ClinicalSetting)}
                                required={true}
                                focusColor="#4f46e5"
                                id="clinical-setting"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Department Unit <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={departmentUnit}
                                onChange={(e) => setDepartmentUnit(e.target.value)}
                                placeholder="e.g. Accident & Emergency, ICU Unit"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Minimum Experience (Years) <span className="text-red-500">*</span></label>
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

                {/* 2. SECTION: LOCUM COVERAGE & TIMEFRAME */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiCalendar className="text-indigo-500" /> 2. Placement Coverage Dates & Hours
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Coverage Start Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                required
                                value={coverageStartDate}
                                onChange={(e) => setCoverageStartDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-750 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Coverage End Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                required
                                value={coverageEndDate}
                                onChange={(e) => setCoverageEndDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-750 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Shift Hours Details <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={shiftHours}
                                onChange={(e) => setShiftHours(e.target.value)}
                                placeholder="e.g. 08:00 - 17:00, 12-hour Night shift"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">On-Call Requirements</label>
                            <input
                                type="text"
                                value={onCallRequirements}
                                onChange={(e) => setOnCallRequirements(e.target.value)}
                                placeholder="e.g. 1 in 3 weekend calls, night phone calls only"
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

                {/* 3. SECTION: COMPENSATION & LOCATION */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiDollarSign className="text-indigo-500" /> 3. Compensation & Facility Location
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Locum Rate Type</label>
                            <select
                                value={rateType}
                                onChange={(e) => setRateType(e.target.value as RateType)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 cursor-pointer"
                            >
                                <option value="HOURLY">Hourly Rate</option>
                                <option value="DAILY">Daily Rate</option>
                                <option value="WEEKLY">Weekly Rate</option>
                                <option value="MONTHLY">Monthly Rate</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide font-extrabold text-slate-700">Minimum Rate ($) <span className="text-red-500">*</span></label>
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
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide font-extrabold text-slate-700">Maximum Rate ($) <span className="text-red-500">*</span></label>
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
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide"><FiMapPin className="inline mr-0.5" /> City <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Ikeja, Lekki, Garki"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">State <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="e.g. Lagos, Abuja"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Country <span className="text-red-500">*</span></label>
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

                {/* 4. SECTION: DESCRIPTION & QUALIFICATIONS */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiFileText className="text-indigo-500" /> 4. Detailed Description & Credentials
                    </h3>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Role Description <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a detailed locum description including specific shift structures, clinical workload expectations, caseload details, and other parameters..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 leading-relaxed"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Required Credentials <span className="text-red-500">*</span></label>
                                <span className="text-[9px] text-slate-400 font-semibold italic">Separate with commas</span>
                            </div>
                            <input
                                type="text"
                                required
                                value={requiredCredentialsInput}
                                onChange={(e) => setRequiredCredentialsInput(e.target.value)}
                                placeholder="e.g. MBBS, MDCN Board License, ACLS Certification"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(CLIENT_ROUTES.JOBS)}
                        className="px-5 py-3 text-xs text-slate-500 hover:text-slate-800 font-bold bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50 transition-all"
                    >
                        {isLoading ? (
                            <FiLoader className="animate-spin text-sm" />
                        ) : (
                            <FiCheckCircle className="text-sm" />
                        )}
                        Publish Locum Placement
                    </button>
                </div>
            </form>
        </div>
    );
}
