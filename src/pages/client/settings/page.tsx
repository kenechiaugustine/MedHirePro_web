import { useState, useEffect } from 'react';
import { 
    FiSettings, 
    FiBell, 
    FiShield, 
    FiSliders, 
    FiInfo,
    FiLoader,
    FiBriefcase
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ClientSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    // Notification states
    const [dummyNotifications, setDummyNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [messageAlerts, setMessageAlerts] = useState(true);

    // Recruiting states
    const [autoArchive, setAutoArchive] = useState(true);
    const [licenseCheck, setLicenseCheck] = useState(true);
    const [publicVisibility, setPublicVisibility] = useState(true);

    // System states
    const [language, setLanguage] = useState('en');

    // Load from localStorage on mount
    useEffect(() => {
        const savedDummy = localStorage.getItem('medhire_client_dummy_notifications');
        const savedEmail = localStorage.getItem('medhire_client_email_alerts');
        const savedMessage = localStorage.getItem('medhire_client_message_alerts');
        const savedArchive = localStorage.getItem('medhire_client_auto_archive');
        const savedLicense = localStorage.getItem('medhire_client_license_check');
        const savedVisibility = localStorage.getItem('medhire_client_public_visibility');
        const savedLang = localStorage.getItem('medhire_client_language');

        if (savedDummy !== null) setDummyNotifications(savedDummy === 'true');
        if (savedEmail !== null) setEmailAlerts(savedEmail === 'true');
        if (savedMessage !== null) setMessageAlerts(savedMessage === 'true');
        if (savedArchive !== null) setAutoArchive(savedArchive === 'true');
        if (savedLicense !== null) setLicenseCheck(savedLicense === 'true');
        if (savedVisibility !== null) setPublicVisibility(savedVisibility === 'true');
        if (savedLang !== null) setLanguage(savedLang);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate save delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        localStorage.setItem('medhire_client_dummy_notifications', String(dummyNotifications));
        localStorage.setItem('medhire_client_email_alerts', String(emailAlerts));
        localStorage.setItem('medhire_client_message_alerts', String(messageAlerts));
        localStorage.setItem('medhire_client_auto_archive', String(autoArchive));
        localStorage.setItem('medhire_client_license_check', String(licenseCheck));
        localStorage.setItem('medhire_client_public_visibility', String(publicVisibility));
        localStorage.setItem('medhire_client_language', language);

        setIsSaving(false);
        toast.success("Recruiter settings saved successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-indigo-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-100 text-xs font-semibold backdrop-blur-md border border-indigo-500/20">
                        <FiSettings className="w-3.5 h-3.5" /> Workspace Panel
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Recruiting Workspace Settings</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed font-sans">
                        Configure candidate vetting guidelines, email alerting schedules, visibilities, and dummy notifications.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Column 1: Notification Settings */}
                    <div className="space-y-6">
                        
                        {/* Section Card: Notifications */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                                    <FiBell className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Notifications & Alerts</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alerting Policies</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Dummy Notifications Toggle */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="dummy-alerts">
                                            Enable Dummy Notifications
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Fires simulated screen popups when mock candidates apply for job vacancies.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="dummy-alerts"
                                        onClick={() => setDummyNotifications(!dummyNotifications)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            dummyNotifications ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            dummyNotifications ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Email Alerts Toggle */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="email-alerts">
                                            New Applicant Email Alerts
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Send immediate email notices to recruiters whenever a clinician submits their CV.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="email-alerts"
                                        onClick={() => setEmailAlerts(!emailAlerts)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            emailAlerts ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            emailAlerts ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Chat / Message Alerts Toggle */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="message-alerts">
                                            Direct Message Alerts
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Send system push notifications when candidates message your recruitment team.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="message-alerts"
                                        onClick={() => setMessageAlerts(!messageAlerts)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            messageAlerts ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            messageAlerts ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section Card: General Settings */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                                    <FiSliders className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">General Preferences</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interface Settings</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-700 block">Workspace Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 font-semibold text-slate-700"
                                >
                                    <option value="en">English (UK / US)</option>
                                    <option value="fr">French (Français)</option>
                                    <option value="de">German (Deutsch)</option>
                                    <option value="es">Spanish (Español)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Recruiting Controls */}
                    <div className="space-y-6">
                        
                        {/* Section Card: Job Vetting & Rules */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                                    <FiBriefcase className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Job Campaign Preferences</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Options</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Auto Archive */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="auto-archive">
                                            Auto-Archive Expired Postings
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Automatically archive locum shifts and jobs when matching deadlines pass.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="auto-archive"
                                        onClick={() => setAutoArchive(!autoArchive)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            autoArchive ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            autoArchive ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Candidate Vetting */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="license-vetting">
                                            Strict License Vetting Check
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Only allow clinicians with verified board certificates to apply to postings.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="license-vetting"
                                        onClick={() => setLicenseCheck(!licenseCheck)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            licenseCheck ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            licenseCheck ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Visibility */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="public-visibility">
                                            Public Workspace Profile
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Allow candidates searching the job boards to view facility profile reviews.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="public-visibility"
                                        onClick={() => setPublicVisibility(!publicVisibility)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            publicVisibility ? 'bg-indigo-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            publicVisibility ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security notice widget */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                                    <FiShield className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Security Controls</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dossier Access</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-slate-500 leading-normal font-semibold">
                                <FiInfo className="flex-shrink-0 mt-0.5 text-indigo-600 text-sm" />
                                <div>
                                    Workspace modifications require verified clearance level parameters. Some settings are regulated by clinical employment guidelines.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSaving && <FiLoader className="animate-spin" />}
                        Save Workspace Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
