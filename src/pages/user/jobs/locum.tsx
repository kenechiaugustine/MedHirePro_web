import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetJobListingsQuery } from '../../../redux/apis/jobsApi';
import { USER_ROUTES } from '../routes.enum';
import { 
    FiSearch, 
    FiMapPin, 
    FiClock, 
    FiFilter, 
    FiLoader, 
    FiFileText, 
    FiCalendar, 
    FiShield
} from 'react-icons/fi';
import { 
    ClinicalSpecialty, 
    ClinicalSetting 
} from '../../../redux/apis/jobsApi/interface';

export default function ProfessionalLocumSearchPage() {
    const navigate = useNavigate();
    
    // Fetch only open locum shifts
    const { data: jobs, isLoading, error } = useGetJobListingsQuery({
        job_type: 'LOCUM',
        status: 'OPEN'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
    const [settingFilter, setSettingFilter] = useState<string>('ALL');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-600" />
                    <p className="text-slate-500 font-medium text-xs">Scanning active shift rosters...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="text-red-500 text-3xl">⚠️</div>
                <h3 className="font-extrabold text-slate-800">Connection Error</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                    Failed to communicate with the medical registry. Please check your network.
                </p>
            </div>
        );
    }

    // Filter job results
    const filteredJobs = (jobs || []).filter(job => {
        const matchesSearch = (job.position_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.department_unit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSpecialty = specialtyFilter === 'ALL' || job.clinical_specialty === specialtyFilter;
        const matchesSetting = settingFilter === 'ALL' || job.clinical_setting === settingFilter;

        return matchesSearch && matchesSpecialty && matchesSetting;
    });

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            
            {/* Header section with rich gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10">
                <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiClock className="w-3.5 h-3.5" /> Locum Shifts
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Locum Registry & Placements</h1>
                    <p className="text-teal-200 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Fill immediate shifts, temporary clinical gaps, or explore short-term healthcare postings with high daily/hourly rates.
                    </p>
                </div>
            </div>

            {/* Advanced search and filter controls */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Text Search */}
                    <div className="relative md:col-span-1">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                            <FiSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search title, department, city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                        />
                    </div>

                    {/* Specialty Filter */}
                    <div className="relative flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0"><FiFilter className="inline mr-1" />Specialty</span>
                        <select
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-600 cursor-pointer"
                        >
                            <option value="ALL">All Specialties</option>
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

                    {/* Setting Filter */}
                    <div className="relative flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Setting</span>
                        <select
                            value={settingFilter}
                            onChange={(e) => setSettingFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-600 cursor-pointer"
                        >
                            <option value="ALL">All Settings</option>
                            <option value={ClinicalSetting.ACUTE_CARE_HOSPITAL}>Acute Care Hospital</option>
                            <option value={ClinicalSetting.OUTPATIENT_CLINIC}>Outpatient Clinic</option>
                            <option value={ClinicalSetting.REHABILITATION_FACILITY}>Rehabilitation Facility</option>
                            <option value={ClinicalSetting.LONG_TERM_CARE}>Long-Term Care</option>
                            <option value={ClinicalSetting.SKILLED_NURSING_FACILITY}>Skilled Nursing</option>
                            <option value={ClinicalSetting.URGENT_CARE_CENTER}>Urgent Care</option>
                            <option value={ClinicalSetting.COMMUNITY_HEALTH_CENTER}>Community Health</option>
                            <option value={ClinicalSetting.TELEHEALTH}>Telehealth</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Vacancies Display */}
            {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 mx-auto text-2xl">
                        <FiFileText />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-slate-800">No Shifts Available</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                            {searchTerm || specialtyFilter !== 'ALL' || settingFilter !== 'ALL'
                                ? "No locum shifts match your search filters. Try clearing your parameters."
                                : "There are currently no active temporary shifts posted in the registry."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => {
                        const minFormatted = formatCurrency(job.rate_amount_min);
                        const maxFormatted = formatCurrency(job.rate_amount_max);
                        
                        return (
                            <div key={job._id} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-350 hover:shadow-md transition-all duration-200">
                                <div className="space-y-3.5">
                                    {/* Specialty and Type Tag Header */}
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700">
                                            {(job.clinical_specialty || '').replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">
                                            Locum Shift
                                        </span>
                                    </div>

                                    {/* Title and Dept */}
                                    <div className="space-y-0.5">
                                        <h4 className="font-extrabold text-slate-850 text-sm hover:text-teal-650 transition-colors truncate" title={job.position_title}>
                                            {job.position_title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-bold truncate">
                                            {job.department_unit} • {(job.clinical_setting || '').replace(/_/g, ' ')}
                                        </p>
                                    </div>

                                    {/* Timeframe Card */}
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[11px] font-semibold text-slate-600">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 flex items-center gap-0.5"><FiCalendar /> Coverage:</span>
                                            <span className="font-extrabold text-slate-750">
                                                {job.coverage_start_date ? new Date(job.coverage_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'} - {job.coverage_end_date ? new Date(job.coverage_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 flex items-center gap-0.5"><FiClock /> Shift Hours:</span>
                                            <span className="font-bold text-slate-700 truncate max-w-[120px]">{job.shift_hours || 'Standard'}</span>
                                        </div>
                                    </div>

                                    {/* Budget / Compensation Row */}
                                    <div className="flex justify-between items-center border-t border-slate-50 pt-2 text-xs">
                                        <span className="text-slate-400 font-bold">Billing Rate:</span>
                                        <span className="font-black text-teal-700">{minFormatted} - {maxFormatted} <span className="text-[9px] font-semibold text-slate-400 uppercase">/ {job.rate_type.toLowerCase()}</span></span>
                                    </div>

                                    {/* Perks Tags */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {job.malpractice_insurance_provided && (
                                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                                                <FiShield className="text-[8px]" /> Insurance
                                            </span>
                                        )}
                                        {job.travel_housing_reimbursement && (
                                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                                                ✈️ Housing Reimbursed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                                        <FiMapPin className="text-[11px] text-slate-400" /> {job.city}, {job.state}
                                    </span>

                                    <button
                                        onClick={() => navigate(USER_ROUTES.JOB_DETAILS.replace(':id', job._id))}
                                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm hover:shadow-md transition-all duration-150"
                                    >
                                        Apply for Shift
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
