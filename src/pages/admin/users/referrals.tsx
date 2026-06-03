import { useParams, useNavigate } from 'react-router-dom';
import { 
    useReadUserByIdQuery, 
    useReadUserReferralsQuery 
} from '../../../redux/apis/adminApi';
import { Avatar } from '../../../components/app';
import { 
    FiArrowLeft, 
    FiUsers, 
    FiLoader, 
    FiAlertCircle, 
    FiCalendar
} from 'react-icons/fi';

export default function AdminUserReferralsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Queries
    const { data: user, isLoading: isUserLoading, error: userError } = useReadUserByIdQuery(id || '', { skip: !id });
    const { data: referrals, isLoading: isRefLoading, error: refError } = useReadUserReferralsQuery({ user_id: id || '', limit: 100 }, { skip: !id });

    if (isUserLoading || isRefLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-600" />
                    <p className="text-slate-500 font-medium text-xs">Fetching supervisor database logs...</p>
                </div>
            </div>
        );
    }

    if (userError || refError || !user) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto text-2xl">
                    <FiAlertCircle />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Referrals Resolution Failed</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                        Could not resolve invite logs or profile details for the requested user account.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/admin/users')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors"
                >
                    Back to User Management
                </button>
            </div>
        );
    }

    const displayName = user.role === 'institute' 
        ? (user.facility_name || 'Host Clinic') 
        : (user.full_name || 'Candidate Practitioner');

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

    return (
        <div className="space-y-6 animate-fadeIn duration-200">
            {/* Header & Back Action */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-teal-600 transition-colors cursor-pointer w-fit"
                >
                    <FiArrowLeft /> Back to User Management
                </button>

                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10 mt-2">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-100 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                            <FiUsers className="w-3.5 h-3.5" /> Referrals Logs
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">User Referrals Ledger</h1>
                        <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                            List of system users referred by **{displayName}** • Referral Code: <span className="text-teal-200 font-extrabold uppercase">{user.referral_code || 'None'}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="bg-white rounded-xl p-5 border border-slate-150 shadow-xs flex items-center justify-between">
                <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Total Referral Invites</span>
                    <span className="text-2xl font-black text-slate-800 flex items-center gap-1.5">
                        <FiUsers className="text-teal-600" /> {referrals?.length || 0} Successful Invites
                    </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    ID: #{user._id.slice(-6).toUpperCase()}
                </span>
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden">
                <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <FiCalendar className="text-teal-500" /> Referred Accounts List ({referrals?.length || 0})
                    </h3>
                </div>

                {!referrals || referrals.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-2xl">
                            <FiUsers />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-extrabold text-slate-800">No Referrals Registered</h3>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto font-medium">
                                This user has not referred any medical practitioners or host institutions to MedHirePro yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table Layout */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Referred Profile Details</th>
                                        <th className="px-6 py-4">Access Role</th>
                                        <th className="px-6 py-4">Joined Date</th>
                                        <th className="px-6 py-4">Placements Vetted</th>
                                        <th className="px-6 py-4">Active State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs text-slate-750">
                                    {referrals.map((ref: any) => {
                                        const refName = ref.role === 'institute' 
                                            ? (ref.facility_name || 'Host Clinic') 
                                            : (ref.full_name || 'Practitioner Candidate');
                                            
                                        return (
                                            <tr key={ref._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4.5 max-w-xs">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar 
                                                            name={refName} 
                                                            avatarUrl={ref.avatar_url} 
                                                            size="sm" 
                                                            role={ref.role} 
                                                        />
                                                        <div className="space-y-0.5 truncate">
                                                            <p className="font-extrabold text-slate-800 truncate" title={refName}>
                                                                {refName}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400 font-bold truncate">
                                                                {ref.email} • ID: #{ref._id.slice(-6).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getRoleStyles(ref.role)}`}>
                                                        {ref.role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4.5 whitespace-nowrap text-slate-450 font-semibold">
                                                    {ref.created_at ? new Date(ref.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </td>

                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                        ref.is_verified
                                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                            : 'bg-amber-50 border-amber-200 text-amber-700'
                                                    }`}>
                                                        {ref.is_verified ? 'Verified Vetted' : 'Pending Audit'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4.5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                        ref.is_active
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                            : 'bg-slate-100 border-slate-200 text-slate-450'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full inline-block ${ref.is_active ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                                                        {ref.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards Layout */}
                        <div className="grid grid-cols-1 gap-4 lg:hidden p-4 bg-slate-50/50">
                            {referrals.map((ref: any) => {
                                const refName = ref.role === 'institute' 
                                    ? (ref.facility_name || 'Host Clinic') 
                                    : (ref.full_name || 'Practitioner Candidate');
                                    
                                return (
                                    <div key={ref._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                name={refName} 
                                                avatarUrl={ref.avatar_url} 
                                                size="sm" 
                                                role={ref.role} 
                                            />
                                            <div className="space-y-0.5 truncate flex-grow">
                                                <h4 className="font-extrabold text-slate-800 text-xs truncate">
                                                    {refName}
                                                </h4>
                                                <p className="text-[9px] text-slate-400 font-bold truncate">
                                                    {ref.email}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider flex-shrink-0 ${getRoleStyles(ref.role)}`}>
                                                {ref.role}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[11px] font-semibold text-slate-650">
                                            <div>
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Join Date</span>
                                                <p className="font-bold text-slate-750 pt-0.5 flex items-center gap-1">
                                                    <FiCalendar /> {ref.created_at ? new Date(ref.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Placement Status</span>
                                                <p className={`inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-full text-[9px] font-black uppercase border ${
                                                    ref.is_verified
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                                }`}>
                                                    {ref.is_verified ? 'Verified Vetted' : 'Pending Audit'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                ID: #{ref._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                ref.is_active
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                    : 'bg-slate-100 border-slate-200 text-slate-450'
                                            }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full inline-block ${ref.is_active ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                                                {ref.is_active ? 'Active' : 'Deactivated'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
