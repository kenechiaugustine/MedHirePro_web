import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/website/Navbar';
import Footer from '../../../components/website/Footer';
import { useGetJobListingsQuery } from '../../../redux/apis/jobsApi';
import { 
    ClinicalSpecialty, 
    ClinicalSetting, 
    JobType, 
    type IJobListingResponse 
} from '../../../redux/apis/jobsApi/interface';
import { 
    FiSearch, 
    FiMapPin, 
    FiBriefcase, 
    FiDollarSign, 
    FiShare2, 
    FiArrowRight, 
    FiCheckCircle, 
    FiLoader,
    FiX
} from 'react-icons/fi';
import ShareJobModal from '../../../components/app/ShareJobModal';

export default function PublicJobsPage() {
    const navigate = useNavigate();
    const { data: jobListingsRes, isLoading, isError } = useGetJobListingsQuery({ limit: 50000 });
    const jobListings = jobListingsRes?.data || [];

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobType, setSelectedJobType] = useState<string>('ALL');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
    const [selectedSetting, setSelectedSetting] = useState<string>('ALL');

    // Share modal state
    const [shareModalData, setShareModalData] = useState<{
        isOpen: boolean;
        jobId: string;
        jobTitle: string;
        facilityName?: string;
        location?: string;
    }>({
        isOpen: false,
        jobId: '',
        jobTitle: '',
    });

    const handleOpenShare = (e: React.MouseEvent, job: IJobListingResponse) => {
        e.stopPropagation();
        const posterObj = typeof job.posted_by === 'object' ? job.posted_by : null;
        const facilityName = posterObj?.facility_name || posterObj?.full_name || 'Medical Facility';
        const locationStr = `${job.city}, ${job.state}`;
        setShareModalData({
            isOpen: true,
            jobId: job._id || job.id,
            jobTitle: job.position_title,
            facilityName,
            location: locationStr,
        });
    };

    // Filter jobs logic
    const filteredJobs = useMemo(() => {
        if (!jobListings) return [];

        return jobListings.filter((job) => {
            // Only show OPEN jobs publicly
            if (job.status !== 'OPEN') return false;

            // Search query filter
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const titleMatch = job.position_title.toLowerCase().includes(term);
                const cityMatch = job.city.toLowerCase().includes(term);
                const stateMatch = job.state.toLowerCase().includes(term);
                const specMatch = job.clinical_specialty.toLowerCase().includes(term);
                const posterObj = typeof job.posted_by === 'object' ? job.posted_by : null;
                const posterMatch = (posterObj?.facility_name || posterObj?.full_name || '').toLowerCase().includes(term);

                if (!titleMatch && !cityMatch && !stateMatch && !specMatch && !posterMatch) {
                    return false;
                }
            }

            // Job Type filter
            if (selectedJobType !== 'ALL' && job.job_type !== selectedJobType) {
                return false;
            }

            // Specialty filter
            if (selectedSpecialty !== 'ALL' && job.clinical_specialty !== selectedSpecialty) {
                return false;
            }

            // Setting filter
            if (selectedSetting !== 'ALL' && job.clinical_setting !== selectedSetting) {
                return false;
            }

            return true;
        });
    }, [jobListings, searchTerm, selectedJobType, selectedSpecialty, selectedSetting]);

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedJobType('ALL');
        setSelectedSpecialty('ALL');
        setSelectedSetting('ALL');
    };

    const formatRate = (job: IJobListingResponse) => {
        const symbol = job.currency_symbol || '₦';
        const minStr = job.rate_amount_min.toLocaleString();
        const maxStr = job.rate_amount_max.toLocaleString();
        const typeStr = job.rate_type.toLowerCase();
        return `${symbol}${minStr} - ${symbol}${maxStr} / ${typeStr}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* HERO / SEARCH BANNER */}
            <div className="bg-gradient-to-br from-[#0A2540] via-[#0D47A1] to-[#0284C7] text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-sky-300/30">
                            <FiBriefcase className="text-sky-300" /> Public Job Directory
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                            Explore Medical Vacancies & Locum Shifts
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-blue-100/90 leading-relaxed">
                            Discover open healthcare positions shared publicly by verified clinics and hospitals across Nigeria. Anyone can browse and view details; create an account when you are ready to apply.
                        </p>
                    </div>

                    {/* SEARCH BAR CARD */}
                    <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 text-gray-900">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Keyword Input */}
                            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Search Keywords</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                                    <input
                                        type="text"
                                        placeholder="Title, facility, or city..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                    />
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')} 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <FiX />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Job Type Dropdown */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Job Type</label>
                                <select
                                    value={selectedJobType}
                                    onChange={(e) => setSelectedJobType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                >
                                    <option value="ALL">All Job Types</option>
                                    <option value={JobType.PERMANENT}>Permanent Position</option>
                                    <option value={JobType.LOCUM}>Locum Shift</option>
                                </select>
                            </div>

                            {/* Specialty Dropdown */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Specialty</label>
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                >
                                    <option value="ALL">All Specialties</option>
                                    {Object.values(ClinicalSpecialty).map((spec) => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Clinical Setting Dropdown */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Clinical Setting</label>
                                <select
                                    value={selectedSetting}
                                    onChange={(e) => setSelectedSetting(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                >
                                    <option value="ALL">All Settings</option>
                                    {Object.values(ClinicalSetting).map((setting) => (
                                        <option key={setting} value={setting}>{setting}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Stats & Active Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Available Open Vacancies
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'vacancy' : 'vacancies'}
                        </p>
                    </div>

                    {(searchTerm || selectedJobType !== 'ALL' || selectedSpecialty !== 'ALL' || selectedSetting !== 'ALL') && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition w-fit cursor-pointer"
                        >
                            <FiX /> Clear Filters
                        </button>
                    )}
                </div>

                {/* LOADING STATE */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FiLoader className="text-4xl text-blue-600 animate-spin mb-3" />
                        <p className="text-sm font-medium text-gray-600">Loading public job vacancies...</p>
                    </div>
                )}

                {/* ERROR STATE */}
                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center my-8">
                        <p className="text-red-700 font-semibold text-base">Unable to load job listings at this time.</p>
                        <p className="text-red-500 text-xs mt-1">Please check your network connection and refresh.</p>
                    </div>
                )}

                {/* EMPTY LIST STATE */}
                {!isLoading && !isError && filteredJobs.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center my-8 shadow-xs">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                            <FiBriefcase />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Job Listings Found</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                            We couldn't find any public job vacancies matching your selected filters. Try broadening your search or resetting filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer"
                        >
                            Reset Search Filters
                        </button>
                    </div>
                )}

                {/* JOBS GRID */}
                {!isLoading && !isError && filteredJobs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {filteredJobs.map((job) => {
                            const posterObj = typeof job.posted_by === 'object' ? job.posted_by : null;
                            const facilityName = posterObj?.facility_name || posterObj?.full_name || 'Medical Institution';
                            const isLocum = job.job_type === 'LOCUM';
                            const jobId = job._id || job.id;

                            return (
                                <div
                                    key={jobId}
                                    onClick={() => navigate(`/jobs/${jobId}`)}
                                    className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                                >
                                    {/* Card Header */}
                                    <div className="p-6">
                                        {/* Top Badges */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                isLocum 
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            }`}>
                                                {isLocum ? 'Locum Shift' : 'Permanent Role'}
                                            </span>

                                            {posterObj?.is_verified && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                    <FiCheckCircle className="text-blue-600 text-xs" /> Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* Position Title */}
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {job.position_title}
                                        </h3>

                                        {/* Institution Name */}
                                        <p className="text-xs font-semibold text-gray-600 mt-1 line-clamp-1">
                                            {facilityName}
                                        </p>

                                        {/* Meta Specs */}
                                        <div className="mt-4 space-y-2 text-xs text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FiMapPin className="text-gray-400 shrink-0" />
                                                <span className="truncate">{job.city}, {job.state}, {job.country}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FiBriefcase className="text-gray-400 shrink-0" />
                                                <span className="truncate">{job.clinical_specialty} • {job.clinical_setting}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                                <FiDollarSign className="text-emerald-600 shrink-0" />
                                                <span>{formatRate(job)}</span>
                                            </div>
                                        </div>

                                        {/* Description Snippet */}
                                        <p className="mt-4 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between gap-3">
                                        {/* Share Button */}
                                        <button
                                            onClick={(e) => handleOpenShare(e, job)}
                                            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition shadow-xs cursor-pointer"
                                            title="Share Job Post"
                                        >
                                            <FiShare2 className="text-sm" />
                                        </button>

                                        {/* View Details Link */}
                                        <Link
                                            to={`/jobs/${jobId}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs"
                                        >
                                            View Details & Apply <FiArrowRight className="text-xs" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* REUSABLE SHARE MODAL */}
            <ShareJobModal
                isOpen={shareModalData.isOpen}
                onClose={() => setShareModalData((prev) => ({ ...prev, isOpen: false }))}
                jobId={shareModalData.jobId}
                jobTitle={shareModalData.jobTitle}
                facilityName={shareModalData.facilityName}
                location={shareModalData.location}
            />

            <Footer />
        </div>
    );
}
