import { useState } from 'react';
import {
    useGetJobListingsQuery,
    usePostLocumJobMutation,
    useReassignJobMutation,
    useDeleteJobListingMutation
} from '../../../redux/apis/jobsApi';
import { useReadAllUsersQuery } from '../../../redux/apis/adminApi';
import {
    FiLoader,
    FiSearch,
    FiPlus,
    FiX,
    FiClock,
    FiCalendar,
    FiTrash2,
    FiUsers,
    FiSettings
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
    ClinicalSpecialty,
    ClinicalSetting,
    RateType,
    JobStatus
} from '../../../redux/apis/jobsApi/interface';

export default function AdminLocumJobsPage() {

    // Query parameters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
    const [selectedSetting, setSelectedSetting] = useState<string>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'ALL'>('ALL');
    const page = 1;

    // Dialog / Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [newOwnerId, setNewOwnerId] = useState('');

    // Form inputs for locum creation
    const [createForm, setCreateForm] = useState({
        position_title: '',
        clinical_specialty: ClinicalSpecialty.GENERAL_PRACTICE as ClinicalSpecialty,
        clinical_setting: ClinicalSetting.OUTPATIENT_CLINIC as ClinicalSetting,
        department_unit: '',
        description: '',
        required_credentials_raw: '',
        minimum_experience_years: 1,
        city: '',
        state: '',
        country: 'Nigeria',
        rate_type: 'HOURLY' as RateType,
        rate_amount_min: 0,
        rate_amount_max: 0,
        coverage_start_date: '',
        coverage_end_date: '',
        shift_hours: '',
        malpractice_insurance_provided: false,
        travel_housing_reimbursement: false,
        on_call_requirements: ''
    });

    // API hooks
    const jobParams: any = {
        job_type: 'LOCUM',
        page,
        limit: 100,
    };
    if (selectedSpecialty !== 'ALL') jobParams.clinical_specialty = selectedSpecialty;
    if (selectedSetting !== 'ALL') jobParams.clinical_setting = selectedSetting;
    if (selectedStatus !== 'ALL') jobParams.status = selectedStatus;

    const { data: jobs, isLoading: isJobsLoading, refetch: refetchJobs } = useGetJobListingsQuery(jobParams);
    const { data: users, isLoading: isUsersLoading } = useReadAllUsersQuery({ limit: 100 });

    const [postLocumJob, { isLoading: isCreating }] = usePostLocumJobMutation();
    const [reassignJob, { isLoading: isReassigning }] = useReassignJobMutation();
    const [deleteJob, { isLoading: isDeleting }] = useDeleteJobListingMutation();

    // Lookups
    const userMap = users?.reduce((acc: any, u: any) => {
        acc[u._id] = u.role === 'institute'
            ? (u.facility_name || 'Host Clinic')
            : (u.full_name || 'Practitioner');
        return acc;
    }, {}) || {};

    // Locum assignments can be reassigned to professionals or institutes on the backend!
    const nonAdminUsers = users?.filter((u: any) => u.role !== 'admin') || [];

    const handleConfigClick = (job: any) => {
        setSelectedJob(job);
        setNewOwnerId(job.posted_by);
        setIsConfigModalOpen(true);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (createForm.rate_amount_min <= 0 || createForm.rate_amount_max <= 0) {
            toast.error("Please specify a valid compensation rate amount.");
            return;
        }
        if (createForm.rate_amount_min > createForm.rate_amount_max) {
            toast.error("Minimum rate cannot exceed maximum rate.");
            return;
        }
        if (!createForm.coverage_start_date || !createForm.coverage_end_date) {
            toast.error("Please specify the shift coverage dates.");
            return;
        }

        const start = new Date(createForm.coverage_start_date);
        const end = new Date(createForm.coverage_end_date);
        if (start > end) {
            toast.error("Coverage start date cannot be after the end date.");
            return;
        }

        const required_credentials = createForm.required_credentials_raw
            ? createForm.required_credentials_raw.split(',').map(c => c.trim()).filter(Boolean)
            : [];

        try {
            await postLocumJob({
                position_title: createForm.position_title,
                clinical_specialty: createForm.clinical_specialty,
                clinical_setting: createForm.clinical_setting,
                department_unit: createForm.department_unit,
                description: createForm.description,
                required_credentials,
                minimum_experience_years: Number(createForm.minimum_experience_years),
                city: createForm.city,
                state: createForm.state,
                country: createForm.country,
                rate_type: createForm.rate_type,
                rate_amount_min: Number(createForm.rate_amount_min),
                rate_amount_max: Number(createForm.rate_amount_max),
                coverage_start_date: new Date(createForm.coverage_start_date).toISOString(),
                coverage_end_date: new Date(createForm.coverage_end_date).toISOString(),
                shift_hours: createForm.shift_hours,
                malpractice_insurance_provided: createForm.malpractice_insurance_provided,
                travel_housing_reimbursement: createForm.travel_housing_reimbursement,
                on_call_requirements: createForm.on_call_requirements || null
            }).unwrap();

            toast.success("Locum shift placement successfully published!");
            setIsCreateModalOpen(false);
            setCreateForm({
                position_title: '',
                clinical_specialty: ClinicalSpecialty.GENERAL_PRACTICE,
                clinical_setting: ClinicalSetting.OUTPATIENT_CLINIC,
                department_unit: '',
                description: '',
                required_credentials_raw: '',
                minimum_experience_years: 1,
                city: '',
                state: '',
                country: 'Nigeria',
                rate_type: 'HOURLY',
                rate_amount_min: 0,
                rate_amount_max: 0,
                coverage_start_date: '',
                coverage_end_date: '',
                shift_hours: '',
                malpractice_insurance_provided: false,
                travel_housing_reimbursement: false,
                on_call_requirements: ''
            });
            refetchJobs();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to publish locum shift placement.");
        }
    };

    const handleReassign = async () => {
        if (!selectedJob) return;
        if (newOwnerId === selectedJob.posted_by) {
            toast.error("Vacancy is already assigned to this user.");
            return;
        }

        try {
            await reassignJob({
                id: selectedJob._id,
                body: {
                    new_owner_id: newOwnerId,
                    job_type: 'LOCUM'
                }
            }).unwrap();

            toast.success("Locum vacancy successfully reassigned!");
            setIsConfigModalOpen(false);
            refetchJobs();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to reassign vacancy owner.");
        }
    };

    const handleDelete = async () => {
        if (!selectedJob) return;
        if (!window.confirm("Are you sure you want to delete this locum placement? This action is permanent.")) return;

        try {
            await deleteJob(selectedJob._id).unwrap();
            toast.success("Locum shift successfully deleted.");
            setIsConfigModalOpen(false);
            refetchJobs();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to remove locum listing.");
        }
    };

    // Filter local results on search term for extra responsiveness
    const filteredJobs = jobs?.filter((job: any) => {
        if (!searchTerm.trim()) return true;
        const search = searchTerm.toLowerCase();
        return (
            job.position_title.toLowerCase().includes(search) ||
            job.department_unit.toLowerCase().includes(search) ||
            job.city.toLowerCase().includes(search) ||
            (userMap[job.posted_by] || '').toLowerCase().includes(search)
        );
    }) || [];

    if (isJobsLoading || isUsersLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading clinical database listings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            {/* Elegant Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-100 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                            <FiClock className="w-3.5 h-3.5" /> Locum Shifts
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Locum Placements</h1>
                        <p className="text-slate-255 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                            Supervisory directory of locum assignments and shifts. Authorize updates, publish shifts, and reassign shift ownership.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black shadow-md shadow-teal-600/15 flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <FiPlus /> Publish Locum Shift
                    </button>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Total Placements</span>
                        <span className="text-xl font-black text-slate-800">{filteredJobs.length} Positions</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-505 flex items-center justify-center text-lg"><FiClock /></div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[9px] font-black text-emerald-400 tracking-wider uppercase block">Active Shifts</span>
                        <span className="text-xl font-black text-emerald-700">{filteredJobs.filter(j => j.status === 'OPEN').length} Open</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><FiClock /></div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[9px] font-black text-indigo-400 tracking-wider uppercase block">Completed Placements</span>
                        <span className="text-xl font-black text-indigo-700">{filteredJobs.filter(j => j.status === 'FILLED').length} Filled</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><FiClock /></div>
                </div>
            </div>

            {/* Filter controls */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                            <FiSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search title, department, city, poster..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-medium text-slate-700"
                        />
                    </div>

                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-650 cursor-pointer"
                    >
                        <option value="ALL">All Specialties</option>
                        {Object.values(ClinicalSpecialty).map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>

                    <select
                        value={selectedSetting}
                        onChange={(e) => setSelectedSetting(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-650 cursor-pointer"
                    >
                        <option value="ALL">All Settings</option>
                        {Object.values(ClinicalSetting).map(set => (
                            <option key={set} value={set}>{set}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-650 cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="DRAFT">Draft</option>
                        <option value="FILLED">Filled</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>
            </div>

            {/* Jobs Data Table */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden">
                {filteredJobs.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-2xl">
                            <FiClock />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-slate-800">No Locum Jobs Listed</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                                No locum shift placements match your search parameters.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Position Title & Clinic</th>
                                    <th className="px-6 py-4">Specialty & Department</th>
                                    <th className="px-6 py-4">Locum Compensation Rate</th>
                                    <th className="px-6 py-4">Shift & Dates</th>
                                    <th className="px-6 py-4">Job Status</th>
                                    <th className="px-6 py-4 text-right">Configure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {filteredJobs.map((job) => {
                                    const posterName = userMap[job.posted_by] || 'MedHire Host Clinic';

                                    const startStr = job.coverage_start_date
                                        ? new Date(job.coverage_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                        : '';
                                    const endStr = job.coverage_end_date
                                        ? new Date(job.coverage_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : '';

                                    return (
                                        <tr
                                            key={job._id}
                                            onClick={() => handleConfigClick(job)}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4.5 max-w-xs">
                                                <div className="space-y-0.5">
                                                    <p className="font-extrabold text-slate-800 truncate" title={job.position_title}>
                                                        {job.position_title}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold truncate flex items-center gap-1">
                                                        <FiUsers className="w-3 h-3 text-teal-650" /> {posterName}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <p className="font-extrabold text-slate-750">{job.clinical_specialty}</p>
                                                    <p className="text-[10px] text-slate-400 font-semibold">{job.clinical_setting} • {job.department_unit}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <p className="font-extrabold text-slate-800">
                                                    {job.currency_symbol || '₦'}{job.rate_amount_min.toLocaleString()} - {job.rate_amount_max.toLocaleString()}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                    Per {job.rate_type.toLowerCase()}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <p className="font-extrabold text-slate-750 flex items-center gap-1">
                                                    <FiCalendar /> {startStr} - {endStr}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold">
                                                    Hours: {job.shift_hours || 'Flexible'}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${job.status === 'OPEN'
                                                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                                        : job.status === 'FILLED'
                                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                            : 'bg-slate-100 border-slate-200 text-slate-400'
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${job.status === 'OPEN' ? 'bg-emerald-500' : job.status === 'FILLED' ? 'bg-blue-500' : 'bg-slate-350'}`} />
                                                    {job.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleConfigClick(job);
                                                    }}
                                                    className="p-2 text-slate-600 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                    title="Configure Shift"
                                                >
                                                    <FiSettings className="text-xs" />
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

            {/* CREATE LOCUM PLACEMENT MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-slideUp duration-200">
                        <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-teal-700" />

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                                        <FiPlus className="text-teal-600" /> Publish Locum Shift Placement
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                        Direct short-term shift vacancy publication.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Position Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.position_title}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, position_title: e.target.value }))}
                                        placeholder="e.g. Locum ER Registrar, Locum General Nurse"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Specialty</label>
                                        <select
                                            value={createForm.clinical_specialty}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, clinical_specialty: e.target.value as ClinicalSpecialty }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                        >
                                            {Object.values(ClinicalSpecialty).map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Setting</label>
                                        <select
                                            value={createForm.clinical_setting}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, clinical_setting: e.target.value as ClinicalSetting }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                        >
                                            {Object.values(ClinicalSetting).map(set => (
                                                <option key={set} value={set}>{set}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department / Unit</label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.department_unit}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, department_unit: e.target.value }))}
                                            placeholder="e.g. ICU, Emergency Dept"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min Experience (Years)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={createForm.minimum_experience_years}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, minimum_experience_years: Number(e.target.value) }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                                    <textarea
                                        required
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Full locum requirements and shift details..."
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.city}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, city: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State</label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.state}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, state: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Country</label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.country}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, country: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rate Compensation</label>
                                        <select
                                            value={createForm.rate_type}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, rate_type: e.target.value as RateType }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                        >
                                            <option value="HOURLY">Hourly</option>
                                            <option value="DAILY">Daily</option>
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="MONTHLY">Monthly</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min Rate</label>
                                        <input
                                            type="number"
                                            required
                                            value={createForm.rate_amount_min}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, rate_amount_min: Number(e.target.value) }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Max Rate</label>
                                        <input
                                            type="number"
                                            required
                                            value={createForm.rate_amount_max}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, rate_amount_max: Number(e.target.value) }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coverage Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={createForm.coverage_start_date}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, coverage_start_date: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coverage End Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={createForm.coverage_end_date}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, coverage_end_date: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shift Hours Description</label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.shift_hours}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, shift_hours: e.target.value }))}
                                            placeholder="e.g. 8:00 AM - 5:00 PM, 12 Hour Shifts"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On Call Requirements</label>
                                        <input
                                            type="text"
                                            value={createForm.on_call_requirements}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, on_call_requirements: e.target.value }))}
                                            placeholder="Optional on-call rules..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 cursor-pointer">
                                        <span className="text-[11px] font-extrabold text-slate-750">Malpractice Covered</span>
                                        <input
                                            type="checkbox"
                                            checked={createForm.malpractice_insurance_provided}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, malpractice_insurance_provided: e.target.checked }))}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 cursor-pointer">
                                        <span className="text-[11px] font-extrabold text-slate-750">Travel & Housing Covered</span>
                                        <input
                                            type="checkbox"
                                            checked={createForm.travel_housing_reimbursement}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, travel_housing_reimbursement: e.target.checked }))}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                                        />
                                    </label>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Credentials (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={createForm.required_credentials_raw}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, required_credentials_raw: e.target.value }))}
                                        placeholder="e.g. ACLS Certificate, ER Board Eligibility"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black shadow-md shadow-teal-600/15 flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                    {isCreating && <FiLoader className="animate-spin" />}
                                    Publish Locum Shift
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CONFIGURE LOCUM JOB MODAL / REASSIGN OWNER */}
            {isConfigModalOpen && selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-slideUp duration-200">
                        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-700" />

                        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                                        <FiSettings className="text-indigo-650" /> Configure Shift Placement
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                        Locum Shift: {selectedJob.position_title}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsConfigModalOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                    <FiX />
                                </button>
                            </div>

                            {/* Job Details Card */}
                            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3.5 text-xs text-slate-650">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Specialty & Setting</span>
                                        <p className="font-extrabold text-slate-850 pt-0.5">{selectedJob.clinical_specialty} • {selectedJob.clinical_setting}</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Department / Unit</span>
                                        <p className="font-extrabold text-slate-850 pt-0.5">{selectedJob.department_unit}</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Locum Shift Hours</span>
                                        <p className="font-extrabold text-slate-850 pt-0.5">{selectedJob.shift_hours || 'Flexible'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Compensation Rate</span>
                                        <p className="font-extrabold text-slate-850 pt-0.5">
                                            {selectedJob.currency_symbol || '₦'}{selectedJob.rate_amount_min.toLocaleString()} - {selectedJob.rate_amount_max.toLocaleString()} per {selectedJob.rate_type.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-slate-200/60 pt-3">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Shift Requirements</span>
                                    <p className="font-semibold text-slate-550 leading-relaxed text-[11px] pt-0.5">{selectedJob.description}</p>
                                </div>
                            </div>

                            {/* Reassignment Panel */}
                            <div className="border-t border-slate-100 pt-4 space-y-4">
                                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                                    <FiUsers /> Reassign Posted By (Owner)
                                </h4>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Select New Clinic / Practitioner User</label>
                                    <select
                                        value={newOwnerId}
                                        onChange={(e) => setNewOwnerId(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700 cursor-pointer"
                                    >
                                        <option value="">Choose registered user...</option>
                                        {nonAdminUsers.map((u: any) => (
                                            <option key={u._id} value={u._id}>
                                                {u.facility_name || u.full_name} ({u.role} • {u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    disabled={isReassigning || !newOwnerId || newOwnerId === selectedJob.posted_by}
                                    onClick={handleReassign}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                    {isReassigning && <FiLoader className="animate-spin" />}
                                    Reassign Shift Ownership
                                </button>
                            </div>

                            {/* Delete Vacancy Panel */}
                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-wider block">Destructive Actions</h4>
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                    className="w-full py-2.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                    {isDeleting && <FiLoader className="animate-spin" />}
                                    <FiTrash2 /> Delete Locum Placement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
