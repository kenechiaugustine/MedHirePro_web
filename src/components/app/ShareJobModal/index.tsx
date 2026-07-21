import { useState } from 'react';
import { 
    FiX, 
    FiCopy, 
    FiCheck, 
    FiShare2, 
    FiMail 
} from 'react-icons/fi';
import { FaWhatsapp, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ShareJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    facilityName?: string;
    location?: string;
}

export default function ShareJobModal({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    facilityName,
    location,
}: ShareJobModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/jobs/${jobId}`;
    const shareText = `Check out this job vacancy for "${jobTitle}" ${
        facilityName ? `at ${facilityName}` : ''
    } on MedHirePro!`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Job link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            toast.error("Failed to copy link.");
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: jobTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or share failed silently
            }
        } else {
            handleCopy();
        }
    };

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText}\n${shareUrl}`
    )}`;

    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
    )}`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
    )}&url=${encodeURIComponent(shareUrl)}`;

    const mailUrl = `mailto:?subject=${encodeURIComponent(
        `Job Opening: ${jobTitle}`
    )}&body=${encodeURIComponent(`${shareText}\n\nApply or view details here: ${shareUrl}`)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div 
                className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                            <FiShare2 />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Share Job Vacancy</h3>
                            <p className="text-xs text-gray-500">Public share link accessible by anyone</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
                        aria-label="Close"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                {/* Job Card Preview */}
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 mb-2">
                        PUBLIC JOB LINK
                    </span>
                    <h4 className="text-base font-bold text-gray-900 line-clamp-1">{jobTitle}</h4>
                    {(facilityName || location) && (
                        <p className="text-xs text-gray-600 mt-0.5">
                            {[facilityName, location].filter(Boolean).join(' • ')}
                        </p>
                    )}
                </div>

                {/* Link Copy Box */}
                <div className="mt-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        DIRECT LINK
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                                copied
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="text-sm" /> Copied!
                                </>
                            ) : (
                                <>
                                    <FiCopy className="text-sm" /> Copy
                                    </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Social Share Buttons */}
                <div className="mt-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-3">
                        SHARE VIA SOCIAL PLATFORMS
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition group cursor-pointer"
                        >
                            <FaWhatsapp className="text-2xl mb-1 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">WhatsApp</span>
                        </a>

                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/60 transition group cursor-pointer"
                        >
                            <FaLinkedinIn className="text-2xl mb-1 text-sky-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">LinkedIn</span>
                        </a>

                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition group cursor-pointer"
                        >
                            <FaTwitter className="text-2xl mb-1 text-slate-800 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">X / Twitter</span>
                        </a>

                        <a
                            href={mailUrl}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 transition group cursor-pointer"
                        >
                            <FiMail className="text-2xl mb-1 text-purple-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold">Email</span>
                        </a>
                    </div>
                </div>

                {/* Native Device Share Button (if supported) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <div className="mt-4">
                        <button
                            onClick={handleNativeShare}
                            className="w-full py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                            <FiShare2 className="text-sm" /> Share using device apps
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
