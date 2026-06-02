import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    useGetMyJobListingsQuery, 
    useDeleteJobListingMutation 
} from '../../../redux/apis/jobsApi';
import { CLIENT_ROUTES } from '../routes.enum';
import { 
    FiPlus, 
    FiBriefcase, 
    FiClock, 
    FiTrash2, 
    FiEye, 
    FiSearch, 
    FiMapPin, 
    FiLoader,
    FiFileText,
    FiFilter,
    FiAlertTriangle,
    FiEdit2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ClientJobListingsPage() {
    const navigate = useNavigate();
    const { data: jobs, isLoading, refetch } = useGetMyJobListingsQuery();
    const [deleteJobListing, { isLoading: isDeleting }] = useDeleteJobListingMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<'ALL' | 'PERMANENT' | 'LOCUM'>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

    // Custom delete modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<{ id: string; title: string } | null>(null);

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;

        try {
            await deleteJobListing(jobToDelete.id).unwrap();
            toast.success("Job listing successfully deleted.");
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
            refetch();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to delete job listing.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading your job listings...</p>
                </div>
            </div>
        );
    }

    // Filter listings
    const filteredJobs = (jobs || []).filter(job => {
        const matchesSearch = (job.position_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.department_unit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = selectedType === 'ALL' || job.job_type === selectedType;
        const matchesStatus = selectedStatus === 'ALL' || job.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-8 animate-fadeIn duration-300">
            {/* Header section with CTAs */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-indigo-500/20">
                        <FiBriefcase className="w-3.5 h-3.5" /> Client Vacancies
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Job Listings Manager</h1>
                    <p className="text-indigo-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Publish and maintain active placement listings. Hire permanent clinical experts or fill immediate shifts with locum practitioners.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate(CLIENT_ROUTES.POST_LOCUM)}
                        className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-teal-350 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                    >
                        <FiClock className="text-sm text-teal-400" /> Fill Locum Placements
                    </button>
                    <button
                        onClick={() => navigate(CLIENT_ROUTES.POST_PERMANENT)}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/20"
                    >
                        <FiPlus className="text-sm" /> Post Permanent Job
                    </button>
                </div>
            </div>

            {/* Search and filter row */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by position title, department, city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-medium text-slate-700"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-450 font-bold">
                        <FiFilter /> Filters:
                    </div>
                    {/* Job Type Filter */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-600 cursor-pointer"
                    >
                        <option value="ALL">All Types</option>
                        <option value="PERMANENT">Permanent Only</option>
                        <option value="LOCUM">Locum Only</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-600 cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="FILLED">Filled</option>
                        <option value="DRAFT">Draft</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>
            </div>

            {/* Tabular Job Listings Card — Desktop Only */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
                {filteredJobs.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto text-2xl">
                            <FiFileText />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-slate-800">No Job Listings Found</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                                {searchTerm || selectedType !== 'ALL' || selectedStatus !== 'ALL'
                                    ? "No active vacancies match your current filter settings. Try adjusting your query."
                                    : "You haven't posted any job listings yet. Get started by selecting one of the posting triggers above."
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Position Title & Clinic Detail</th>
                                    <th className="px-6 py-4">Job Type</th>
                                    <th className="px-6 py-4">Compensation / Rate</th>
                                    <th className="px-6 py-4 text-center">Applicants</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs">
                                {filteredJobs.map((job) => {
                                    const formattedRate = `${formatCurrency(job.rate_amount_min)} - ${formatCurrency(job.rate_amount_max)}`;
                                    
                                    return (
                                        <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-5 space-y-1.5 max-w-xs">
                                                <div>
                                                    <p className="font-extrabold text-slate-850 hover:text-indigo-600 transition-colors truncate">
                                                        {job.position_title}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-semibold truncate">
                                                        {job.department_unit} • {(job.clinical_setting || '').replace(/_/g, ' ')}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                                                        <FiMapPin className="text-[8px]" /> {job.city}, {job.state}
                                                    </span>
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                                                        {(job.clinical_specialty || '').replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                                                    job.job_type === 'PERMANENT'
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-teal-50 border-teal-200 text-teal-700'
                                                }`}>
                                                    {job.job_type === 'PERMANENT' ? (
                                                        <>
                                                            <FiBriefcase className="text-[10px]" /> Permanent
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiClock className="text-[10px]" /> Locum Placements
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <p className="font-extrabold text-slate-800">{formattedRate}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{job.rate_type}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-center whitespace-nowrap">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                                    (job.total_applicants || 0) > 0
                                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                        : 'bg-slate-50 border-slate-150 text-slate-400'
                                                }`}>
                                                    {job.total_applicants || 0} Applied
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    job.status === 'OPEN'
                                                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                                        : job.status === 'FILLED'
                                                        ? 'bg-blue-50 border-blue-250 text-blue-700'
                                                        : job.status === 'DRAFT'
                                                        ? 'bg-amber-50 border-amber-250 text-amber-700'
                                                        : 'bg-red-50 border-red-250 text-red-700'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                                        job.status === 'OPEN' ? 'bg-emerald-500' :
                                                        job.status === 'FILLED' ? 'bg-blue-500' :
                                                        job.status === 'DRAFT' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`} />
                                                    {job.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 whitespace-nowrap text-slate-450 font-semibold">
                                                {new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>

                                            <td className="px-6 py-5 text-right whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => navigate(CLIENT_ROUTES.DETAILS.replace(':id', job._id))}
                                                    className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                    title="View Details"
                                                >
                                                    <FiEye className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(CLIENT_ROUTES.EDIT.replace(':id', job._id))}
                                                    className="p-2 text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                    title="Edit Listing"
                                                >
                                                    <FiEdit2 className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setJobToDelete({ id: job._id, title: job.position_title });
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    disabled={isDeleting}
                                                    className="p-2 text-red-650 hover:text-red-800 bg-red-50 hover:bg-red-150 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                    title="Delete Listing"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Responsive Cards for Mobile screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto text-xl">
                            <FiFileText />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-extrabold text-slate-800">No Job Listings Found</h3>
                            <p className="text-[11px] text-slate-455 font-medium leading-relaxed">
                                {searchTerm || selectedType !== 'ALL' || selectedStatus !== 'ALL'
                                    ? "No active vacancies match your current filter settings."
                                    : "You haven't posted any job listings yet."
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredJobs.map((job) => {
                        const formattedRate = `${formatCurrency(job.rate_amount_min)} - ${formatCurrency(job.rate_amount_max)}`;
                        return (
                            <div key={job._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 max-w-[70%]">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                            job.status === 'OPEN'
                                                ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                                : job.status === 'FILLED'
                                                ? 'bg-blue-50 border-blue-250 text-blue-700'
                                                : job.status === 'DRAFT'
                                                ? 'bg-amber-50 border-amber-250 text-amber-700'
                                                : 'bg-red-50 border-red-250 text-red-700'
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                                                job.status === 'OPEN' ? 'bg-emerald-500' :
                                                job.status === 'FILLED' ? 'bg-blue-500' :
                                                job.status === 'DRAFT' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                            {job.status}
                                        </span>
                                        <h4 className="font-extrabold text-slate-850 text-sm hover:text-indigo-600 transition-colors pt-1 truncate">
                                            {job.position_title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-semibold truncate">
                                            {job.department_unit} • {(job.clinical_setting || '').replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                                        job.job_type === 'PERMANENT'
                                            ? 'bg-blue-50 border-blue-250 text-blue-750'
                                            : 'bg-teal-50 border-teal-250 text-teal-750'
                                    }`}>
                                        {job.job_type === 'PERMANENT' ? 'Permanent' : 'Locum'}
                                    </span>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2 text-[11px] font-semibold text-slate-650">
                                    <div className="flex justify-between items-center">
                                        <span>Rate:</span>
                                        <span className="font-extrabold text-slate-850">{formattedRate} <span className="text-[9px] uppercase tracking-wider">({job.rate_type})</span></span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Location:</span>
                                        <span className="font-bold text-slate-700">{job.city}, {job.state}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Applicants:</span>
                                        <span className="font-extrabold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md text-[10px]">{job.total_applicants || 0} Applied</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[10px] text-slate-400 font-bold">
                                        Posted: {new Date(job.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => navigate(CLIENT_ROUTES.DETAILS.replace(':id', job._id))}
                                            className="px-3.5 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-850 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => navigate(CLIENT_ROUTES.EDIT.replace(':id', job._id))}
                                            className="px-3 py-1.5 text-[10px] font-bold text-amber-600 hover:text-amber-850 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setJobToDelete({ id: job._id, title: job.position_title });
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                        >
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {isDeleteModalOpen && jobToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slideUp duration-200">
                        {/* Red Accent Accent Bar */}
                        <div className="h-2 w-full bg-red-500" />
                        
                        <div className="p-6 space-y-6">
                            {/* Icon & Title */}
                            <div className="flex items-start gap-4">
                                <span className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-red-50 text-red-600">
                                    <FiAlertTriangle />
                                </span>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-slate-800">
                                        Delete Job Listing
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Are you sure you want to delete this active vacancy?
                                    </p>
                                </div>
                            </div>

                            {/* Job Info Card */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-bold">Position Title</span>
                                    <span className="font-extrabold text-slate-750 truncate max-w-[200px]" title={jobToDelete.title}>
                                        {jobToDelete.title}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-bold">Action Mode</span>
                                    <span className="font-bold text-red-650 uppercase">
                                        Permanent Deletion
                                    </span>
                                </div>
                            </div>

                            {/* Warning Box */}
                            <div className="p-3.5 rounded-xl border bg-red-50/50 border-red-100 text-red-850 text-[11px] font-semibold leading-relaxed flex gap-2">
                                <FiAlertTriangle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p>
                                    <strong>System Impact:</strong> Deleting this listing is irreversible. It will immediately withdraw the vacancy from the search engine and cancel all submitted practitioner applications.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setJobToDelete(null);
                                    }}
                                    className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-red-600/15 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
                                >
                                    {isDeleting ? (
                                        <FiLoader className="animate-spin text-sm" />
                                    ) : (
                                        <FiTrash2 className="text-sm" />
                                    )}
                                    Delete Listing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

