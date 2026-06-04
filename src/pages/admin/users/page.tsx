import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    useReadAllUsersQuery, 
    useAdminUpdateUserDetailsMutation 
} from '../../../redux/apis/adminApi';
import { Avatar } from '../../../components/app';
import { 
    FiShield, 
    FiLoader, 
    FiUser, 
    FiSearch, 
    FiFilter, 
    FiEdit2, 
    FiX, 
    FiDollarSign, 
    FiActivity, 
    FiAlertCircle,
    FiBriefcase
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUserManagementPage() {
    const navigate = useNavigate();
    // Search and Filter states
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<'professional' | 'institute' | 'admin' | 'ALL'>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    // Drawer/Modal States
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form inputs for edit
    const [editForm, setEditForm] = useState({
        full_name: '',
        facility_name: '',
        avatar_url: '',
        role: 'professional',
        credit_balance: 0,
        daily_credit_cap: 20,
        is_active: true,
        is_verified: false,
        specialty: '',
        employment_status: '',
        current_workplace: '',
        onboarding_status: 'pending'
    });

    const params: any = {
        page,
        limit: 100, // Fetch up to 100 users for a solid overview
    };
    if (selectedRole !== 'ALL') {
        params.role = selectedRole;
    }
    if (selectedStatus !== 'ALL') {
        params.is_active = selectedStatus === 'ACTIVE';
    }
    if (searchTerm.trim()) {
        params.search = searchTerm.trim();
    }

    // Queries & Mutations
    const { data: users, isLoading, error, refetch } = useReadAllUsersQuery(params);
    const [updateUserDetails, { isLoading: isUpdating }] = useAdminUpdateUserDetailsMutation();

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditForm({
            full_name: user.full_name || '',
            facility_name: user.facility_name || '',
            avatar_url: user.avatar_url || '',
            role: user.role || 'professional',
            credit_balance: user.credit_balance || 0,
            daily_credit_cap: user.daily_credit_cap || 20,
            is_active: user.is_active ?? true,
            is_verified: user.is_verified ?? false,
            specialty: user.specialty || '',
            employment_status: user.employment_status || '',
            current_workplace: user.current_workplace || '',
            onboarding_status: user.onboarding_status || 'pending'
        });
        setIsEditModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        // Perform basic validations
        if (editForm.role === 'professional' && !editForm.full_name.trim()) {
            toast.error("Professional candidate full name is required.");
            return;
        }
        if (editForm.role === 'institute' && !editForm.facility_name.trim()) {
            toast.error("Healthcare facility name is required.");
            return;
        }

        try {
            // Build update payload, formatting appropriate empty fields to null
            const payload: any = {
                role: editForm.role,
                credit_balance: Number(editForm.credit_balance),
                daily_credit_cap: Number(editForm.daily_credit_cap),
                is_active: editForm.is_active,
                is_verified: editForm.is_verified,
                avatar_url: editForm.avatar_url.trim() ? editForm.avatar_url : null,
                onboarding_status: editForm.onboarding_status || 'pending',
            };

            if (editForm.role === 'professional') {
                payload.full_name = editForm.full_name.trim();
                payload.facility_name = null;
                payload.specialty = editForm.specialty ? editForm.specialty : null;
                payload.employment_status = editForm.employment_status ? editForm.employment_status : null;
                payload.current_workplace = editForm.current_workplace.trim() ? editForm.current_workplace : null;
            } else if (editForm.role === 'institute') {
                payload.full_name = null;
                payload.facility_name = editForm.facility_name.trim();
                payload.specialty = null;
                payload.employment_status = null;
                payload.current_workplace = null;
            } else {
                // Admin
                payload.full_name = editForm.full_name.trim() ? editForm.full_name.trim() : 'Administrator';
                payload.facility_name = null;
                payload.specialty = null;
                payload.employment_status = null;
                payload.current_workplace = null;
            }

            await updateUserDetails({
                user_id: selectedUser._id,
                payload
            }).unwrap();

            toast.success("User account settings successfully updated!");
            setIsEditModalOpen(false);
            refetch();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.detail || "Failed to update supervisor configurations.");
        }
    };

    const getRoleStyles = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-slate-50 border-slate-200 text-slate-700';
            case 'institute':
                return 'bg-teal-50 border-teal-200 text-teal-700';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-600" />
                    <p className="text-slate-500 font-medium text-xs">Fetching supervisor database logs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto text-2xl">
                    <FiAlertCircle />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Cluster Connection Failed</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                        Could not resolve secure connection with user registers. Please check your admin network.
                    </p>
                </div>
                <button 
                    onClick={() => refetch()}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                >
                    Retry Query
                </button>
            </div>
        );
    }

    // Calculations for quick metrics
    const totalCount = users?.length || 0;
    const professionalCount = users?.filter(u => u.role === 'professional').length || 0;
    const instituteCount = users?.filter(u => u.role === 'institute').length || 0;

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            
            {/* Elegant supervisor banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-100 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiShield className="w-3.5 h-3.5" /> Supervisor Directory
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">System User Directory</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Unrestricted supervisor control over candidate dossiers, credits logs, role scopes, and clinical verification states.
                    </p>
                </div>
            </div>

            {/* Quick System Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Total Accounts</span>
                        <span className="text-xl font-black text-slate-800">{totalCount} Users</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center text-lg"><FiUser /></div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[9px] font-black text-blue-400 tracking-wider uppercase block">Practitioners</span>
                        <span className="text-xl font-black text-blue-700">{professionalCount} Professionals</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center text-lg"><FiBriefcase /></div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase block">Clinics / Host Facilities</span>
                        <span className="text-xl font-black text-teal-700">{instituteCount} Institutes</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center text-lg"><FiActivity /></div>
                </div>
            </div>

            {/* Search and Filters row */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search users by name, email, or facility..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-medium text-slate-700"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-450 font-bold">
                        <FiFilter /> Filters:
                    </div>
                    {/* User Role Filter */}
                    <select
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e.target.value as any);
                            setPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-600 cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="professional">Professionals</option>
                        <option value="institute">Institutes</option>
                        <option value="admin">Administrators</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value as any);
                            setPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-600 cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">Active Accounts</option>
                        <option value="INACTIVE">Deactivated</option>
                    </select>
                </div>
            </div>

            {/* User Directory Table Layout */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden">
                {!users || users.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-2xl">
                            <FiUser />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-slate-800">No Users Found</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                                No system registration matches your current search parameters.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">System Profile Details</th>
                                    <th className="px-6 py-4">Roles</th>
                                    <th className="px-6 py-4">Credits Balance</th>
                                    <th className="px-6 py-4">Active State</th>
                                    <th className="px-6 py-4">Placements Vetted</th>
                                    <th className="px-6 py-4 text-right">Configure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {users.map((user) => {
                                    const displayName = user.role === 'institute' 
                                        ? (user.facility_name || 'Host Clinic')
                                        : (user.full_name || 'Candidate Practitioner');
                                    
                                    return (
                                        <tr 
                                            key={user._id} 
                                            onClick={() => handleEditClick(user)}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4.5 max-w-xs">
                                                <div className="flex items-center gap-3">
                                                    <Avatar 
                                                        name={displayName} 
                                                        avatarUrl={user.avatar_url} 
                                                        size="sm" 
                                                        role={user.role} 
                                                    />
                                                    <div className="space-y-0.5 truncate">
                                                        <p className="font-extrabold text-slate-800 truncate" title={displayName}>
                                                            {displayName}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-bold truncate">
                                                            {user.email} • ID: #{user._id.slice(-6).toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getRoleStyles(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    <p className="font-extrabold text-slate-800">
                                                        {user.credit_balance} Credits
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                        Cap: {user.daily_credit_cap} daily cap
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    user.is_active
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                        : 'bg-slate-100 border-slate-200 text-slate-400'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${user.is_active ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                                                    {user.is_active ? 'Active' : 'Deactivated'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    user.is_verified
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                                }`}>
                                                    {user.is_verified ? 'Verified Vetted' : 'Dossier Audit'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(user);
                                                    }}
                                                    className="p-2 text-slate-600 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                                    title="Configure User"
                                                >
                                                    <FiEdit2 className="text-xs" />
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

            {/* SUPERVISOR PROFILE EDIT DRAWERS / MODAL */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-slideUp duration-200">
                        {/* Header color accent */}
                        <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-teal-700" />
                        
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                                        <FiShield className="text-teal-600" /> Configure User Account
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                        Direct database configuration for UID: #{selectedUser._id}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                    <FiX />
                                </button>
                            </div>

                            {/* Main configurations */}
                            <div className="space-y-4">
                                
                                {/* Dynamic name field */}
                                {editForm.role === 'institute' ? (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Facility Name</label>
                                        <input
                                            type="text"
                                            value={editForm.facility_name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, facility_name: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                )}

                                {/* Profile Image Avatar URL */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avatar Profile URL</label>
                                    <input
                                        type="text"
                                        value={editForm.avatar_url}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                                        placeholder="Optional secure image URL"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                    />
                                </div>

                                {/* Role dropdown */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Access Clearance Role</label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="institute">Institute</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {/* Onboarding Status Dropdown */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Onboarding Stage Status</label>
                                    <select
                                        value={editForm.onboarding_status}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, onboarding_status: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                </div>

                                {/* Financial credits balance / limits */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</label>
                                        <input
                                            type="number"
                                            value={editForm.credit_balance}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, credit_balance: Number(e.target.value) }))}
                                            min="0"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Credit Cap</label>
                                        <input
                                            type="number"
                                            value={editForm.daily_credit_cap}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, daily_credit_cap: Number(e.target.value) }))}
                                            min="0"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Compliance switch buttons toggles */}
                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 cursor-pointer">
                                        <span className="text-[11px] font-extrabold text-slate-750">Account Active State</span>
                                        <input
                                            type="checkbox"
                                            checked={editForm.is_active}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 cursor-pointer">
                                        <span className="text-[11px] font-extrabold text-slate-750">Placement Verified Vetted</span>
                                        <input
                                            type="checkbox"
                                            checked={editForm.is_verified}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, is_verified: e.target.checked }))}
                                            className="h-4.5 w-4.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                                        />
                                    </label>
                                </div>

                                {/* Clinical parameters ONLY for professionals */}
                                {editForm.role === 'professional' && (
                                    <div className="border-t border-slate-100 pt-4 space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Practitioner Specialty & Location</h4>
                                        
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Specialty</label>
                                            <select
                                                value={editForm.specialty}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, specialty: e.target.value }))}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                            >
                                                <option value="">None / General Placement</option>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Emergency Medicine">Emergency Medicine</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Internal Medicine">Internal Medicine</option>
                                                <option value="Anesthesiology">Anesthesiology</option>
                                                <option value="Family Practice">Family Practice</option>
                                                <option value="Pulmonology">Pulmonology</option>
                                                <option value="Critical Care">Critical Care</option>
                                                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                                                <option value="Psychiatry">Psychiatry</option>
                                                <option value="Surgery">Surgery</option>
                                                <option value="General Practice">General Practice</option>
                                                <option value="Nursing">Nursing</option>
                                                <option value="Pharmacy">Pharmacy</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Employment Status</label>
                                                <select
                                                    value={editForm.employment_status}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, employment_status: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700 cursor-pointer"
                                                >
                                                    <option value="">Unspecified</option>
                                                    <option value="unemployed">Unemployed</option>
                                                    <option value="full-time">Full Time</option>
                                                    <option value="part-time">Part Time</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Workplace</label>
                                                <input
                                                    type="text"
                                                    value={editForm.current_workplace}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, current_workplace: e.target.value }))}
                                                    placeholder="Facility / Hospital name"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Direct ledger shortcuts */}
                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audits & Activity Ledgers</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/admin/users/${selectedUser._id}/credit-history`)}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        <FiDollarSign className="text-teal-600 w-3.5 h-3.5" /> Credit History Log
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/admin/users/${selectedUser._id}/referrals`)}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        <FiUser className="text-teal-600 w-3.5 h-3.5" /> Referral Network
                                    </button>
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 transition-all cursor-pointer"
                                >
                                    Cancel Operations
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black shadow-md shadow-teal-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isUpdating && <FiLoader className="animate-spin" />}
                                    Save Configurations
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
