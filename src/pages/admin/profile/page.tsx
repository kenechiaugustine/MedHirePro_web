import { useState, useEffect } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '../../../redux/apis/userApi';
import { useUploadMediaMutation } from '../../../redux/apis/mediaApi';
import { Avatar } from '../../../components/app';
import { 
    FiShield, 
    FiLoader, 
    FiCamera, 
    FiLock, 
    FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    // API queries & mutations
    const { data: user, isLoading: isUserLoading, refetch } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadMedia] = useUploadMediaMutation();

    // Local form states
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (user) {
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
            toast.error("Profile image size cannot exceed 5MB.");
            return;
        }

        setAvatarFile(file);
        toast.success(`Selected profile image: ${file.name}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error("Please enter a valid full name.");
            return;
        }

        try {
            let finalAvatarUrl = avatarUrl;
            if (avatarFile) {
                setIsUploading(true);
                toast.loading('Uploading profile picture...', { id: 'profile-upload' });
                const formData = new FormData();
                formData.append('file', avatarFile);
                const res = await uploadMedia(formData).unwrap();
                finalAvatarUrl = res.media.url;
                setAvatarUrl(finalAvatarUrl);
                setAvatarFile(null); // Clear selected file after successful upload
            }

            toast.loading('Saving profile changes...', { id: 'profile-upload' });
            await updateProfile({
                full_name: fullName.trim(),
                avatar_url: finalAvatarUrl || null
            }).unwrap();

            toast.success("Administrator profile updated successfully!", { id: 'profile-upload' });
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
                    <FiLoader className="animate-spin h-8 w-8 text-teal-650" />
                    <p className="text-slate-500 font-medium text-xs">Loading secure supervisor logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Control Header banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-100 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiShield className="w-3.5 h-3.5" /> High Clearance profile
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Supervisor Profile Settings</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed">
                        Manage security profile configurations, avatar image files, and supervisor access credentials.
                    </p>
                </div>
            </div>

            {/* Profile Configurations Details Card */}
            <div className="bg-white border border-slate-150 rounded-2xl shadow-md overflow-hidden p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Avatar Upload Container */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                        <div className="relative group">
                            <Avatar 
                                name={user?.full_name || 'Admin'} 
                                avatarUrl={avatarPreview} 
                                size="lg" 
                                role="admin" 
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white">
                                    <FiLoader className="animate-spin h-5 w-5" />
                                </div>
                            )}
                            <label className="absolute right-0 bottom-0 p-2 bg-teal-650 hover:bg-teal-700 text-white rounded-full cursor-pointer shadow-md transition-colors border border-white">
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
                            <h3 className="font-extrabold text-slate-800 text-base">Profile Image</h3>
                            <p className="text-xs text-slate-400 font-semibold max-w-sm">
                                Upload a clinical passport photo or logo. Supports JPG, PNG formats up to 5MB.
                            </p>
                            {avatarUrl && (
                                <p className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-150 w-fit mx-auto sm:mx-0">
                                    Image URL Synced
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Inputs panel */}
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Administrator Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Chief Administrator"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Administrative Email (Read-Only)</label>
                                <p className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-500 select-all truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Clearance Level (Read-Only)</label>
                                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-500 flex items-center gap-1.5 uppercase">
                                    <FiLock className="text-teal-650" /> LEVEL 3 (Global Admin)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security notification card */}
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3 text-xs text-slate-500 leading-relaxed font-medium">
                        <FiInfo className="flex-shrink-0 mt-0.5 text-teal-650 text-base" />
                        <div>
                            <span className="font-extrabold text-slate-700 block">Supervisor Security Policy</span>
                            To preserve audit trails, administrative emails and root authorization clearance levels cannot be modified without system engineering console bypass credentials.
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={isUpdating || isUploading}
                            className="px-6 py-3 bg-teal-650 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-teal-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isUpdating && <FiLoader className="animate-spin" />}
                            Save Profile Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
