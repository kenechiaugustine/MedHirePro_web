import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    useGetJobListingsQuery, 
    useGetMyJobListingsQuery
} from '../../../redux/apis/jobsApi';
import { USER_ROUTES } from '../routes.enum';
import { 
    FiSearch, 
    FiMapPin, 
    FiClock, 
    FiFilter, 
    FiLoader, 
    FiFileText, 
    FiCalendar, 
    FiShield,
    FiPlus
} from 'react-icons/fi';
import { 
    ClinicalSpecialty, 
    ClinicalSetting
} from '../../../redux/apis/jobsApi/interface';

export default function ProfessionalLocumSearchPage() {
    const navigate = useNavigate();

    // Fetch only open locum shifts
    const { data: jobs, isLoading: isJobsLoading, error: jobsError } = useGetJobListingsQuery({
        job_type: 'LOCUM',
        status: 'OPEN'
    });

    // Fetch current user's posted locum shifts
    const { data: myJobs, isLoading: isMyJobsLoading } = useGetMyJobListingsQuery({
        job_type: 'LOCUM'
    });

    const isLoading = isJobsLoading || isMyJobsLoading;
    const error = jobsError;

    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
    const [settingFilter, setSettingFilter] = useState<string>('ALL');
    const [originFilter, setOriginFilter] = useState<'ALL' | 'POSTED_BY_ME' | 'AVAILABLE'>('ALL');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    // Merge listings and append ownership boolean flag
    const mergedJobs = useMemo(() => {
        const map = new Map<string, any>();
        
        (jobs || []).forEach(job => {
            map.set(job._id, { ...job, isOwner: false });
        });
        
        (myJobs || []).forEach(job => {
            map.set(job._id, { ...job, isOwner: true });
        });
        
        return Array.from(map.values());
    }, [jobs, myJobs]);

    // Filter job results
    const filteredJobs = (mergedJobs || []).filter(job => {
        const matchesSearch = (job.position_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.department_unit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSpecialty = specialtyFilter === 'ALL' || job.clinical_specialty === specialtyFilter;
        const matchesSetting = settingFilter === 'ALL' || job.clinical_setting === settingFilter;

        const matchesOrigin = originFilter === 'ALL' || 
            (originFilter === 'POSTED_BY_ME' && job.isOwner) ||
            (originFilter === 'AVAILABLE' && !job.isOwner);

        return matchesSearch && matchesSpecialty && matchesSetting && matchesOrigin;
    });

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-650" />
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

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            
            {/* Header section with rich gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiClock className="w-3.5 h-3.5" /> Locum Shifts
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Locum Registry & Placements</h1>
                    <p className="text-teal-200 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Fill immediate shifts, temporary clinical gaps, or explore short-term postings with high daily/hourly rates.
                    </p>
                </div>
                <button
                    onClick={() => navigate(USER_ROUTES.POST_LOCUM)}
                    className="flex-shrink-0 px-5 py-3 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-slate-900 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-400/10 hover:shadow-teal-400/20 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-center"
                >
                    <FiPlus className="w-4 h-4 font-black" /> Post Locum Shift
                </button>
            </div>

            {/* Shift Origin Filter Tabs */}
            <div className="flex border-b border-slate-100 gap-6 pt-2">
                <button
                    onClick={() => setOriginFilter('ALL')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                        originFilter === 'ALL'
                            ? 'border-teal-600 text-teal-650 font-black'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    All Shifts ({mergedJobs.length})
                </button>
                <button
                    onClick={() => setOriginFilter('AVAILABLE')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                        originFilter === 'AVAILABLE'
                            ? 'border-teal-600 text-teal-650 font-black'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Available Placements ({mergedJobs.filter(j => !j.isOwner).length})
                </button>
                <button
                    onClick={() => setOriginFilter('POSTED_BY_ME')}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                        originFilter === 'POSTED_BY_ME'
                            ? 'border-teal-600 text-teal-650 font-black'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Posted by Me ({mergedJobs.filter(j => j.isOwner).length})
                </button>
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
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex-shrink-0"><FiFilter className="inline mr-1" />Specialty</span>
                        <select
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-600 cursor-pointer"
                        >
                            <option value="ALL">All Specialties</option>
                            {Object.values(ClinicalSpecialty).map(spec => (
                                <option key={spec} value={spec}>{spec.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    {/* Setting Filter */}
                    <div className="relative flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider flex-shrink-0">Setting</span>
                        <select
                            value={settingFilter}
                            onChange={(e) => setSettingFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-600 cursor-pointer"
                        >
                            <option value="ALL">All Settings</option>
                            {Object.values(ClinicalSetting).map(set => (
                                <option key={set} value={set}>{set.replace(/_/g, ' ')}</option>
                            ))}
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
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700">
                                                {(job.clinical_specialty || '').replace(/_/g, ' ')}
                                            </span>
                                            {job.isOwner && (
                                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                                                    Posted by you
                                                </span>
                                            )}
                                        </div>
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
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[11px] font-semibold text-slate-655">
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

                                    {job.isOwner ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(USER_ROUTES.EDIT_LOCUM.replace(':jobId', job._id))}
                                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black cursor-pointer shadow-sm transition-all duration-150"
                                            >
                                                Edit Shift
                                            </button>
                                            <button
                                                onClick={() => navigate(USER_ROUTES.JOB_APPLICANTS.replace(':jobId', job._id))}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-1"
                                            >
                                                Manage ({job.total_applicants || 0})
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => navigate(USER_ROUTES.JOB_DETAILS.replace(':id', job._id))}
                                            className="px-4 py-2 bg-teal-655 bg-teal-700 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm hover:shadow-md transition-all duration-150"
                                        >
                                            Apply for Shift
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
