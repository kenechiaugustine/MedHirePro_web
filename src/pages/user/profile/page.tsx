import { useState, useEffect } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '../../../redux/apis/userApi';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import { ClinicalSpecialty } from '../../../redux/apis/jobsApi/interface';
import { Avatar } from '../../../components/app';
import {
    FiShield,
    FiLoader,
    FiCamera,
    FiInfo,
    FiUser,
    FiBriefcase,
    FiCreditCard,
    FiMail
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
    // API queries & mutations
    const { data: user, isLoading: isUserLoading, refetch } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

    // Local form states
    const [fullName, setFullName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setSpecialty(user.specialty || '');
            setAvatarUrl(user.avatar_url || '');
        }
    }, [user]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadMedia(formData).unwrap();
            setAvatarUrl(res.media.url);
            toast.success("Profile picture uploaded successfully!");
        } catch (err: any) {
            toast.error(err?.data?.detail || "Image upload failed.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error("Please enter your full name.");
            return;
        }
        if (!specialty) {
            toast.error("Please select a clinical specialty.");
            return;
        }

        try {
            await updateProfile({
                full_name: fullName.trim(),
                specialty: specialty,
                avatar_url: avatarUrl || null
            }).unwrap();

            toast.success("Professional profile updated successfully!");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.detail || "Failed to update profile settings.");
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
                    <p className="text-slate-500 font-medium text-xs">Loading clinician profile dossier...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Control Header banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-blue-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs font-semibold backdrop-blur-md border border-blue-500/20">
                        <FiShield className="w-3.5 h-3.5" /> Professional Account
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Practitioner Profile Settings</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Customize your clinical details, verify specialty board credentials, and build your digital hiring profile.
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Balance & Verification Column */}
                <div className="md:col-span-1 space-y-6">
                    {/* Professional Wallet Card */}
                    <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                                <FiCreditCard />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Clinician Balance</h3>
                                <p className="text-[10px] text-slate-400 font-bold">Search & Match Wallet</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <span className="text-3xl font-black text-slate-800 block">
                                {user?.credit_balance ?? 0} Credits
                            </span>
                            <span className="text-xs text-blue-600 font-bold">
                                {user?.credit_balance ?? 0} Credits Available
                            </span>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 text-[11px] text-blue-700 leading-normal font-semibold">
                            Credits are utilized to apply for premium vacancies, boost match indexing, and message recruiters.
                        </div>
                    </div>

                    {/* Onboarding & Verification Status */}
                    <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Verification Dossier</h4>
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${user?.onboarding_status === 'approved'
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
                                ? 'Your credentials have been audited and verified. You have full access to locum matching.'
                                : 'Onboarding certificates are in review. Premium features activate once verified.'}
                        </p>
                    </div>
                </div>

                {/* Form Inputs Column */}
                <div className="md:col-span-2 bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Avatar Upload Container */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="relative group">
                                <Avatar
                                    name={user?.full_name || 'Professional'}
                                    avatarUrl={avatarUrl}
                                    size="lg"
                                    role="professional"
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white">
                                        <FiLoader className="animate-spin h-5 w-5" />
                                    </div>
                                )}
                                <label className="absolute right-0 bottom-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-colors border border-white">
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
                                <h3 className="font-extrabold text-slate-800 text-base">Clinician Photograph</h3>
                                <p className="text-xs text-slate-400 font-semibold max-w-sm">
                                    Upload a high-quality passport photo. Supports JPG, PNG formats up to 5MB.
                                </p>
                            </div>
                        </div>

                        {/* Inputs panel */}
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <FiUser className="text-xs" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. Dr. Jane Smith"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-semibold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Primary Clinical Specialty</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                                        <FiBriefcase className="text-xs" />
                                    </span>
                                    <select
                                        required
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-semibold text-slate-700 appearance-none"
                                    >
                                        <option value="">Select your medical specialty</option>
                                        {Object.values(ClinicalSpecialty).map((spec) => (
                                            <option key={spec} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Registration Email (Read-Only)</label>
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
                            <FiInfo className="flex-shrink-0 mt-0.5 text-blue-600 text-base" />
                            <div>
                                <span className="font-extrabold text-slate-700 block">Licensing Regulations</span>
                                If you need to modify your licensing ID or registered email, please file a support ticket to ensure compliance with clinical regulatory boards.
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isUpdating || isUploading}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isUpdating && <FiLoader className="animate-spin" />}
                                Save Profile Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
