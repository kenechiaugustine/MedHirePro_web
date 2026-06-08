import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostPermanentJobMutation } from '../../../redux/apis/jobsApi';
import { CLIENT_ROUTES } from '../routes.enum';
import { 
    FiArrowLeft, 
    FiLoader, 
    FiCheckCircle, 
    FiBriefcase,
    FiMapPin,
    FiDollarSign,
    FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
    ClinicalSpecialty, 
    ClinicalSetting, 
    RateType 
} from '../../../redux/apis/jobsApi/interface';
import { SearchableSelect } from '../../../components/app';

export default function PostPermanentJobPage() {
    const navigate = useNavigate();
    const [postPermanentJob, { isLoading }] = usePostPermanentJobMutation();

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
    const [rateType, setRateType] = useState<RateType>('MONTHLY');
    const [rateAmountMin, setRateAmountMin] = useState<number>(0);
    const [rateAmountMax, setRateAmountMax] = useState<number>(0);
    const [acceptsInterns, setAcceptsInterns] = useState(false);
    const [rotationSchedule, setRotationSchedule] = useState('');
    const [fringeBenefitsInput, setFringeBenefitsInput] = useState('');

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
            toast.error("Please enter a valid compensation rate greater than zero.");
            return;
        }

        if (rateAmountMin > rateAmountMax) {
            toast.error("Minimum rate cannot exceed the maximum rate amount.");
            return;
        }

        // Process credentials & benefits inputs
        const required_credentials = requiredCredentialsInput
            ? requiredCredentialsInput.split(',').map(item => item.trim()).filter(Boolean)
            : [];
            
        const fringe_benefits = fringeBenefitsInput
            ? fringeBenefitsInput.split(',').map(item => item.trim()).filter(Boolean)
            : [];

        try {
            await postPermanentJob({
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
                accepts_interns: acceptsInterns,
                rotation_schedule: rotationSchedule || null,
                fringe_benefits
            }).unwrap();

            toast.success("Permanent job vacancy successfully published!");
            navigate(CLIENT_ROUTES.JOBS);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to publish job vacancy.");
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
                        <FiBriefcase className="text-indigo-600" /> Post a Permanent Clinical Job
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Fill structural vacancies with qualified permanent healthcare practitioners.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. SECTION: BASIC JOB INFO */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiBriefcase className="text-indigo-500" /> 1. Professional Role & Department
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Position Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={positionTitle}
                                onChange={(e) => setPositionTitle(e.target.value)}
                                placeholder="e.g. Senior Pediatric Cardiologist, Staff Nurse"
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
                                placeholder="e.g. ICU, ICU Department, Cardiology Unit"
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

                {/* 2. SECTION: COMPENSATION & LOCATION */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiDollarSign className="text-indigo-500" /> 2. Compensation & Facility Location
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
                                <option value="MONTHLY">Monthly Salary</option>
                                <option value="ANNUALLY">Annual Salary</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Minimum Amount ($) <span className="text-red-500">*</span></label>
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
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Maximum Amount ($) <span className="text-red-500">*</span></label>
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
                                placeholder="e.g. Ikeja, Wuse"
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
                                placeholder="e.g. Lagos, FCT"
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

                {/* 3. SECTION: DESCRIPTION & QUALIFICATIONS */}
                <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <FiFileText className="text-indigo-500" /> 3. Detailed Description & Credentials
                    </h3>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Role Description <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a detailed job description including daily duties, responsibilities, clinical focus, and team structures..."
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
                                placeholder="e.g. MBBS, MDCN Board License, Pediatric Fellowship"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Fringe Benefits</label>
                                <span className="text-[9px] text-slate-400 font-semibold italic">Separate with commas (optional)</span>
                            </div>
                            <input
                                type="text"
                                value={fringeBenefitsInput}
                                onChange={(e) => setFringeBenefitsInput(e.target.value)}
                                placeholder="e.g. Health Insurance, Pension Plan, Paid Leave, Relocation Allowance"
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
                        Publish Permanent Vacancy
                    </button>
                </div>
            </form>
        </div>
    );
}
