import { useState, useEffect } from 'react';
import { 
    FiSettings, 
    FiBell, 
    FiShield, 
    FiSliders, 
    FiInfo,
    FiLoader,
    FiSearch,
    FiMapPin
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    // Notification states
    const [dummyNotifications, setDummyNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);

    // Search Preferences
    const [searchVisibility, setSearchVisibility] = useState(true);
    const [showCompensation, setShowCompensation] = useState(true);
    const [radius, setRadius] = useState('25');

    // System states
    const [language, setLanguage] = useState('en');

    // Load from localStorage on mount
    useEffect(() => {
        const savedDummy = localStorage.getItem('medhire_user_dummy_notifications');
        const savedEmail = localStorage.getItem('medhire_user_email_alerts');
        const savedSms = localStorage.getItem('medhire_user_sms_alerts');
        const savedVisibility = localStorage.getItem('medhire_user_search_visibility');
        const savedComp = localStorage.getItem('medhire_user_show_compensation');
        const savedRadius = localStorage.getItem('medhire_user_radius');
        const savedLang = localStorage.getItem('medhire_user_language');

        if (savedDummy !== null) setDummyNotifications(savedDummy === 'true');
        if (savedEmail !== null) setEmailAlerts(savedEmail === 'true');
        if (savedSms !== null) setSmsAlerts(savedSms === 'true');
        if (savedVisibility !== null) setSearchVisibility(savedVisibility === 'true');
        if (savedComp !== null) setShowCompensation(savedComp === 'true');
        if (savedRadius !== null) setRadius(savedRadius);
        if (savedLang !== null) setLanguage(savedLang);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate save delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        localStorage.setItem('medhire_user_dummy_notifications', String(dummyNotifications));
        localStorage.setItem('medhire_user_email_alerts', String(emailAlerts));
        localStorage.setItem('medhire_user_sms_alerts', String(smsAlerts));
        localStorage.setItem('medhire_user_search_visibility', String(searchVisibility));
        localStorage.setItem('medhire_user_show_compensation', String(showCompensation));
        localStorage.setItem('medhire_user_radius', radius);
        localStorage.setItem('medhire_user_language', language);

        setIsSaving(false);
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-blue-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs font-semibold backdrop-blur-md border border-blue-500/20">
                        <FiSettings className="w-3.5 h-3.5" /> Preference Panel
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Practitioner Preference Settings</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed font-sans">
                        Customize your matching radius, profile directory visibility, job alerting rules, and dummy notifications.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Column 1: Notification Preferences */}
                    <div className="space-y-6">
                        
                        {/* Section Card: Notifications */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
                                            Simulates background shift matching popups and recruiter message warnings.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="dummy-alerts"
                                        onClick={() => setDummyNotifications(!dummyNotifications)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            dummyNotifications ? 'bg-blue-600' : 'bg-slate-200'
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
                                            Matching Vacancy Emails
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Receive matching locum or permanent job opening recommendations daily.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="email-alerts"
                                        onClick={() => setEmailAlerts(!emailAlerts)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            emailAlerts ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            emailAlerts ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* SMS Alerts Toggle */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="sms-alerts">
                                            SMS Urgent Shift Calls
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Get text notifications for high-priority shifts within your area. (May incur rates).
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="sms-alerts"
                                        onClick={() => setSmsAlerts(!smsAlerts)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            smsAlerts ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            smsAlerts ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section Card: General Settings */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-semibold text-slate-700"
                                >
                                    <option value="en">English (UK / US)</option>
                                    <option value="fr">French (Français)</option>
                                    <option value="de">German (Deutsch)</option>
                                    <option value="es">Spanish (Español)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Matching Controls */}
                    <div className="space-y-6">
                        
                        {/* Section Card: Job Search Preferences */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FiSearch className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Matching Preferences</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Search Scope</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Search Visibility */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="search-visibility">
                                            Public Profile Search Directory
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Allow verified hospitals and healthcare recruiters to view your certificates and message you.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="search-visibility"
                                        onClick={() => setSearchVisibility(!searchVisibility)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            searchVisibility ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            searchVisibility ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Show compensation */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="show-compensation">
                                            Show Compensation Credits
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Display rates and hourly pay inside job listings and locum shift search index boards.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="show-compensation"
                                        onClick={() => setShowCompensation(!showCompensation)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            showCompensation ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            showCompensation ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Search Radius */}
                                <div className="space-y-1.5 pt-3 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                                        <FiMapPin className="text-blue-600 text-xs" />
                                        <span>Max Commute Matching Range</span>
                                    </div>
                                    <select
                                        value={radius}
                                        onChange={(e) => setRadius(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 font-semibold text-slate-700"
                                    >
                                        <option value="10">Within 10 km (Immediate Area)</option>
                                        <option value="25">Within 25 km (Standard Commute)</option>
                                        <option value="50">Within 50 km (Regional)</option>
                                        <option value="100">Within 100 km (State-wide)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Security notice widget */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FiShield className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Credential Protections</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HIPAA Regulations</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-slate-500 leading-normal font-semibold">
                                <FiInfo className="flex-shrink-0 mt-0.5 text-blue-600 text-sm" />
                                <div>
                                    Clinician registry lists are secured under encryption policies. Uploaded medical license files are only visible to verified healthcare recruitment officers.
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
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSaving && <FiLoader className="animate-spin" />}
                        Save Preferences
                    </button>
                </div>
            </form>
        </div>
    );
}
