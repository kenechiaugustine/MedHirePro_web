import { useParams, useNavigate } from 'react-router-dom';
import { 
    useReadUserByIdQuery, 
    useReadUserCreditsHistoryQuery 
} from '../../../redux/apis/adminApi';
import { 
    FiArrowLeft, 
    FiCreditCard, 
    FiLoader, 
    FiAlertCircle, 
    FiDollarSign, 
    FiCalendar, 
    FiInfo 
} from 'react-icons/fi';

export default function AdminUserCreditHistoryPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Queries
    const { data: user, isLoading: isUserLoading, error: userError } = useReadUserByIdQuery(id || '', { skip: !id });
    const { data: transactions, isLoading: isTxLoading, error: txError } = useReadUserCreditsHistoryQuery({ user_id: id || '', limit: 100 }, { skip: !id });

    if (isUserLoading || isTxLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-teal-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading supervisor ledger logs...</p>
                </div>
            </div>
        );
    }

    if (userError || txError || !user) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto text-2xl">
                    <FiAlertCircle />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-800">Ledger Resolution Failed</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                        Could not resolve credits history or profile logs for the requested user account.
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
                            <FiCreditCard className="w-3.5 h-3.5" /> Financial Credit Logs
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Credit History Ledger</h1>
                        <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                            Transactional credits log for **{displayName}** • role: <span className="uppercase text-teal-200">{user.role}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Balances Summary panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Current Balance</span>
                        <span className="text-2xl font-black text-slate-800 flex items-center gap-0.5">
                            <FiDollarSign className="text-teal-600 text-lg" /> {user.credit_balance} Credits
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        UID: #{user._id.slice(-6).toUpperCase()}
                    </span>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-150 shadow-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase block">Daily System Cap</span>
                        <span className="text-2xl font-black text-teal-700">
                            {user.daily_credit_cap} <span className="text-xs font-bold text-slate-400">daily cap</span>
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Email: {user.email}
                    </span>
                </div>
            </div>

            {/* Transactions Ledger */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-md overflow-hidden">
                <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <FiCalendar className="text-teal-500" /> Transaction Logs ({transactions?.length || 0})
                    </h3>
                </div>

                {!transactions || transactions.length === 0 ? (
                    <div className="p-16 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto text-2xl">
                            <FiDollarSign />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-extrabold text-slate-800">No Transactions Found</h3>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto font-medium">
                                This user has not earned or spent any transactional credits on the platform.
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
                                        <th className="px-6 py-4">Transaction Ref</th>
                                        <th className="px-6 py-4">Operation Type</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Credit Source</th>
                                        <th className="px-6 py-4">Allocation Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                    {transactions.map((tx: any) => (
                                        <tr key={tx._id || tx.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <p className="font-extrabold text-slate-800">
                                                    Ref: #{String(tx._id || tx.id || '').slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold">
                                                    {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    tx.type === 'earn'
                                                        ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                                                        : 'bg-indigo-50 border-indigo-150 text-indigo-700'
                                                }`}>
                                                    {tx.type}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                                    {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 whitespace-nowrap">
                                                <span className="font-extrabold text-slate-750 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] uppercase">
                                                    {String(tx.source || '').replace(/_/g, ' ')}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4.5 text-slate-550 font-medium max-w-xs truncate" title={tx.description}>
                                                {tx.description || 'System credits adjustment.'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards Layout */}
                        <div className="grid grid-cols-1 gap-4 lg:hidden p-4 bg-slate-50/50">
                            {transactions.map((tx: any) => (
                                <div key={tx._id || tx.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                            tx.type === 'earn'
                                                ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                                                : 'bg-indigo-50 border-indigo-150 text-indigo-700'
                                        }`}>
                                            {tx.type}
                                        </span>
                                        <span className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                            {tx.type === 'earn' ? '+' : '-'}{tx.amount} Credits
                                        </span>
                                    </div>

                                    <div className="text-[11px] font-semibold text-slate-650 space-y-1">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400">Ref:</span>
                                            <span className="font-bold text-slate-800">#{String(tx._id || tx.id || '').slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-400">Source:</span>
                                            <span className="font-extrabold text-slate-750 uppercase text-[9px]">{String(tx.source || '').replace(/_/g, ' ')}</span>
                                        </div>
                                        {tx.created_at && (
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-slate-400">Date:</span>
                                                <span className="text-slate-500 font-bold">{new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[10px] text-slate-500 flex gap-1 items-start">
                                        <FiInfo className="flex-shrink-0 mt-0.5 text-slate-400" />
                                        <p className="font-medium leading-relaxed">{tx.description || 'Platform transaction.'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
