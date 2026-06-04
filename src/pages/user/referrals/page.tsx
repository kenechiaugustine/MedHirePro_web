import { useState } from 'react';
import { 
    useGetReferralDetailsQuery, 
    useGetReferredUsersQuery, 
    useApplyReferralMutation 
} from '../../../redux/apis/referralApi';
import { 
    FiGift, 
    FiCopy, 
    FiCheckCircle, 
    FiUserCheck, 
    FiUsers, 
    FiInfo, 
    FiLoader
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserReferralsPage() {
    const { data: details, isLoading: isDetailsLoading, refetch: refetchDetails } = useGetReferralDetailsQuery();
    const { data: referredUsers, isLoading: isUsersLoading, refetch: refetchUsers } = useGetReferredUsersQuery();
    const [applyReferral, { isLoading: isApplying }] = useApplyReferralMutation();

    const [referralInput, setReferralInput] = useState('');
    const [copied, setCopied] = useState(false);

    const isLoading = isDetailsLoading || isUsersLoading;

    const handleCopy = () => {
        if (details?.referral_code) {
            navigator.clipboard.writeText(details.referral_code);
            setCopied(true);
            toast.success("Referral code copied!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleApplyReferrer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!referralInput.trim()) {
            toast.error("Please enter a valid referral code.");
            return;
        }

        try {
            const res = await applyReferral({ referral_code: referralInput.trim() }).unwrap();
            toast.success(res.message || "Referrer code verified successfully!");
            setReferralInput('');
            refetchDetails();
            refetchUsers();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Invalid referrer code or already applied.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading referrals console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Page Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-blue-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs font-semibold backdrop-blur-md border border-blue-500/20">
                        <FiGift className="w-3.5 h-3.5" /> Rewards & Affiliates
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Referrals & Affiliation Program</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed font-sans max-w-2xl">
                        Share your unique invite code with other medical practitioners or institutions. Earn bonus credits when they sign up and get verified!
                    </p>
                </div>
            </div>

            {/* Program Details Counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* My Referral Code */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">My Invite Code</span>
                        <div className="flex items-center justify-between gap-2 mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                            <span className="font-extrabold text-sm text-slate-800 select-all tracking-wider font-mono">
                                {details?.referral_code || "CODE-PENDING"}
                            </span>
                            <button
                                onClick={handleCopy}
                                disabled={!details?.referral_code}
                                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 cursor-pointer transition-colors"
                                title="Copy Invite Code"
                            >
                                {copied ? <FiCheckCircle className="text-emerald-600" /> : <FiCopy />}
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-455 font-semibold leading-normal">
                        Invitees receive 5 registration credits instantly. You earn matching rewards.
                    </p>
                </div>

                {/* Referred Counter */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        <FiUsers />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Successful Invites</span>
                        <span className="text-2xl font-black text-slate-800 block">
                            {details?.referred_count || 0}
                        </span>
                        <span className="text-[10px] text-slate-455 font-bold block">Members verified</span>
                    </div>
                </div>

                {/* Credits Earned */}
                <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                        <FiGift />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Referral Credits Earned</span>
                        <span className="text-2xl font-black text-slate-800 block">
                            {details?.total_referral_credits_earned ?? 0} Credits
                        </span>
                    </div>
                </div>
            </div>

            {/* Split view: Verify Referrer & Referrals Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Verify Referrer Side panel */}
                <div className="lg:col-span-1 bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-6">
                    <div className="pb-3 border-b border-slate-100 space-y-1">
                        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                            <FiUserCheck className="text-blue-600" /> Verify Referrer
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Affiliate Check</p>
                    </div>

                    {details?.referred_by ? (
                        /* Already has a referrer */
                        <div className="space-y-4">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-800 space-y-2">
                                <div className="flex items-center gap-2">
                                    <FiCheckCircle className="text-base flex-shrink-0" />
                                    <span className="text-xs font-black">Referral Linked</span>
                                </div>
                                <p className="text-[10px] leading-relaxed font-semibold">
                                    Your account is verified and linked to referrer: 
                                    <span className="block mt-1 font-mono text-xs font-black select-all bg-emerald-100 px-2 py-0.5 rounded w-fit">
                                        {details.referred_by}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex gap-2.5 text-[10px] text-slate-550 leading-relaxed font-semibold">
                                <FiInfo className="flex-shrink-0 mt-0.5 text-blue-600 text-sm" />
                                <div>
                                    Referrer associations are locked once applied to preserve secure payout logs.
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Can apply referrer code */
                        <form onSubmit={handleApplyReferrer} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                    Enter Referrer Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={referralInput}
                                    onChange={(e) => setReferralInput(e.target.value)}
                                    placeholder="e.g. INCLINIC-7789"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-semibold text-slate-700 uppercase tracking-wide font-mono"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isApplying}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                                {isApplying && <FiLoader className="animate-spin" />}
                                Verify Referrer Code
                            </button>
                        </form>
                    )}
                </div>

                {/* Referred Users Table */}
                <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                            Members Invited By Me
                        </h3>
                    </div>

                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">User Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                                {!referredUsers || referredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-16 text-slate-400 font-medium">
                                            No members have registered with your referral code yet.
                                        </td>
                                    </tr>
                                ) : (
                                    referredUsers.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/40">
                                            <td className="px-6 py-3.5">
                                                <div className="font-extrabold text-slate-800 truncate max-w-[170px]">
                                                    {item.role === 'institute' ? item.facility_name : item.full_name || "New Practitioner"}
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate max-w-[170px] font-semibold">
                                                    {item.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    item.role === 'institute' 
                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' 
                                                    : 'bg-blue-50 text-blue-700 border border-blue-150'
                                                }`}>
                                                    {item.role === 'institute' ? 'Client' : item.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-400 font-bold text-[10px]">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-3.5 text-right whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    item.is_active 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                                                    : 'bg-slate-50 text-slate-500 border border-slate-200'
                                                }`}>
                                                    {item.is_active ? 'Active' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
