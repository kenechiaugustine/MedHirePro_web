import { useState, useEffect } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '../../../redux/apis/userApi';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import { Avatar } from '../../../components/app';
import { 
    FiShield, 
    FiLoader, 
    FiCamera, 
    FiInfo,
    FiUser,
    FiHome,
    FiCreditCard,
    FiMail
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ClientProfilePage() {
    // API queries & mutations
    const { data: user, isLoading: isUserLoading, refetch } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadMedia] = useUploadMediaMutation();

    // Local form states
    const [facilityName, setFacilityName] = useState('');
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFacilityName(user.facility_name || '');
            setFullName(user.full_name || '');
            setAvatarUrl(user.avatar_url || '');
            setAvatarPreview(user.avatar_url || '');
        }
    }, [user]);

    useEffect(() => {
        if (!avatarFile) return;
        const objectUrl = URL.createObjectURL(avatarFile);
        setAvatarPreview(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [avatarFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check: limit to 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Logo size cannot exceed 5MB.");
            return;
        }

        setAvatarFile(file);
        toast.success(`Selected facility logo: ${file.name}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!facilityName.trim()) {
            toast.error("Please enter a valid facility name.");
            return;
        }

        try {
            let finalAvatarUrl = avatarUrl;
            if (avatarFile) {
                setIsUploading(true);
                toast.loading('Uploading facility logo...', { id: 'profile-upload' });
                const formData = new FormData();
                formData.append('file', avatarFile);
                const res = await uploadMedia(formData).unwrap();
                finalAvatarUrl = res.media.url;
                setAvatarUrl(finalAvatarUrl);
                setAvatarFile(null); // Clear selected file after successful upload
            }

            toast.loading('Saving profile changes...', { id: 'profile-upload' });
            await updateProfile({
                facility_name: facilityName.trim(),
                full_name: fullName.trim() || null,
                avatar_url: finalAvatarUrl || null
            }).unwrap();

            toast.success("Institute profile updated successfully!", { id: 'profile-upload' });
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to update profile settings.", { id: 'profile-upload' });
        } finally {
            setIsUploading(false);
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-655" />
                    <p className="text-slate-500 font-medium text-xs">Loading institute credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Control Header banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-indigo-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-100 text-xs font-semibold backdrop-blur-md border border-indigo-500/20">
                        <FiShield className="w-3.5 h-3.5" /> Institute Account
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Facility Profile Settings</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Configure your institutional identity, upload branding logos, and manage recruiter profile credentials.
                    </p>
                </div>
            </div>

            {/* Main Content Layout - Grid to separate balance card & form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Balance & Status Widget Column */}
                <div className="md:col-span-1 space-y-6">
                    {/* Recruiter Wallet Card */}
                    <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-55/10 text-indigo-600 flex items-center justify-center text-lg">
                                <FiCreditCard />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Recruiter Wallet</h3>
                                <p className="text-[10px] text-slate-400 font-bold">Billing & Post Credits</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <span className="text-3xl font-black text-slate-800 block">
                                {user?.credit_balance ?? 0} Credits
                            </span>
                            <span className="text-xs text-indigo-600 font-bold">
                                {user?.credit_balance ?? 0} Credits Available
                            </span>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 text-[11px] text-indigo-700 leading-normal font-semibold">
                            Credits are required to search clinician directories, screen credentials, and launch locum or permanent hiring campaigns.
                        </div>
                    </div>

                    {/* Verified/Onboarding Status info */}
                    <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Onboarding Verification</h4>
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                                user?.onboarding_status === 'approved' 
                                ? 'bg-emerald-500 animate-pulse' 
                                : user?.onboarding_status === 'pending'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`} />
                            <span className="text-xs font-extrabold text-slate-700 uppercase">
                                {user?.onboarding_status || 'not_started'}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            {user?.onboarding_status === 'approved' 
                            ? 'Your clinical institute status has been verified. You have full access to recruit candidates.'
                            : 'Your institute verification is pending credential audit checks. Features may be restricted.'}
                        </p>
                    </div>
                </div>

                {/* Profile Edit Form Column */}
                <div className="md:col-span-2 bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Logo Upload Container */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="relative group">
                                <Avatar 
                                    name={user?.facility_name || user?.full_name || 'Institute'} 
                                    avatarUrl={avatarPreview} 
                                    size="lg" 
                                    role="institute" 
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white">
                                        <FiLoader className="animate-spin h-5 w-5" />
                                    </div>
                                )}
                                <label className="absolute right-0 bottom-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer shadow-md transition-colors border border-white">
                                    <FiCamera className="w-3.5 h-3.5" />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>

                            <div className="space-y-1 text-center sm:text-left flex-grow">
                                <h3 className="font-extrabold text-slate-800 text-base">Facility Logo / Image</h3>
                                <p className="text-xs text-slate-400 font-semibold max-w-sm">
                                    Upload institute brand identity logo. Supports JPG, PNG formats up to 5MB.
                                </p>
                            </div>
                        </div>

                        {/* Inputs panel */}
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Facility/Institute Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <FiHome className="text-xs" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={facilityName}
                                        onChange={(e) => setFacilityName(e.target.value)}
                                        placeholder="e.g. St. Nicholas Hospital"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contact Person Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <FiUser className="text-xs" />
                                    </span>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. Dr. Jane Doe"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Institutional Email (Read-Only)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <FiMail className="text-xs" />
                                    </span>
                                    <p className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-semibold text-slate-500 select-all truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security notification card */}
                        <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3 text-xs text-slate-500 leading-relaxed font-medium">
                            <FiInfo className="flex-shrink-0 mt-0.5 text-indigo-600 text-base" />
                            <div>
                                <span className="font-extrabold text-slate-700 block">Facility Policy Agreement</span>
                                Registered institute login email addresses cannot be modified. If your corporate organization undergoes a domain migration, please contact customer care operations support.
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isUpdating || isUploading}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isUpdating && <FiLoader className="animate-spin" />}
                                Save Facility Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
