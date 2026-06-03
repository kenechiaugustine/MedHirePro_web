import { useState, useEffect } from 'react';
import { 
    FiSettings, 
    FiBell, 
    FiLock, 
    FiCpu, 
    FiDatabase,
    FiInfo,
    FiLoader
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    // Notification states
    const [dummyNotifications, setDummyNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [auditLogging, setAuditLogging] = useState(true);

    // System states
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [developerMode, setDeveloperMode] = useState(false);
    const [backupFrequency, setBackupFrequency] = useState('daily');

    // Security states
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const [requireMfa, setRequireMfa] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedDummy = localStorage.getItem('medhire_admin_dummy_notifications');
        const savedEmail = localStorage.getItem('medhire_admin_email_alerts');
        const savedAudit = localStorage.getItem('medhire_admin_audit_logging');
        const savedMaintenance = localStorage.getItem('medhire_admin_maintenance_mode');
        const savedDeveloper = localStorage.getItem('medhire_admin_developer_mode');
        const savedBackup = localStorage.getItem('medhire_admin_backup_frequency');
        const savedSession = localStorage.getItem('medhire_admin_session_timeout');
        const savedMfa = localStorage.getItem('medhire_admin_require_mfa');

        if (savedDummy !== null) setDummyNotifications(savedDummy === 'true');
        if (savedEmail !== null) setEmailAlerts(savedEmail === 'true');
        if (savedAudit !== null) setAuditLogging(savedAudit === 'true');
        if (savedMaintenance !== null) setMaintenanceMode(savedMaintenance === 'true');
        if (savedDeveloper !== null) setDeveloperMode(savedDeveloper === 'true');
        if (savedBackup !== null) setBackupFrequency(savedBackup);
        if (savedSession !== null) setSessionTimeout(savedSession);
        if (savedMfa !== null) setRequireMfa(savedMfa === 'true');
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate save delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        localStorage.setItem('medhire_admin_dummy_notifications', String(dummyNotifications));
        localStorage.setItem('medhire_admin_email_alerts', String(emailAlerts));
        localStorage.setItem('medhire_admin_audit_logging', String(auditLogging));
        localStorage.setItem('medhire_admin_maintenance_mode', String(maintenanceMode));
        localStorage.setItem('medhire_admin_developer_mode', String(developerMode));
        localStorage.setItem('medhire_admin_backup_frequency', backupFrequency);
        localStorage.setItem('medhire_admin_session_timeout', sessionTimeout);
        localStorage.setItem('medhire_admin_require_mfa', String(requireMfa));

        setIsSaving(false);
        toast.success("Administrator settings saved successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn duration-200">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-100 text-xs font-semibold backdrop-blur-md border border-teal-500/20">
                        <FiSettings className="w-3.5 h-3.5" /> Console Panel
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">System Configuration Settings</h1>
                    <p className="text-slate-250 text-xs md:text-sm font-medium opacity-90 leading-relaxed font-sans">
                        Administer environment variables, security timeouts, mock alerts, and auditing rules.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Column 1: Notifications & Logging */}
                    <div className="space-y-6">
                        
                        {/* Section Card: Notifications */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center">
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
                                            Fires simulated alert popups for credential reviews and post approvals.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="dummy-alerts"
                                        onClick={() => setDummyNotifications(!dummyNotifications)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            dummyNotifications ? 'bg-teal-650' : 'bg-slate-200'
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
                                            System Email Reports
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Recieve automated daily reports detailing new signups and placement queries.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="email-alerts"
                                        onClick={() => setEmailAlerts(!emailAlerts)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            emailAlerts ? 'bg-teal-650' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            emailAlerts ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Audit Logging Toggle */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="audit-log">
                                            Detailed Action Auditing
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Track and save administrative changes inside secure telemetry logs.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="audit-log"
                                        onClick={() => setAuditLogging(!auditLogging)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            auditLogging ? 'bg-teal-650' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            auditLogging ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section Card: System Variables */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center">
                                    <FiCpu className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">System Variables</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engine State</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Maintenance Mode */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="maintenance">
                                            Maintenance Window Mode
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Redirects web traffic to the offline page. APIs respond with code 503.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="maintenance"
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            maintenanceMode ? 'bg-amber-500' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Developer Console */}
                                <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-50">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="dev-mode">
                                            Developer Telemetry Mode
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Enables browser logs, system profiling, and mock validation rules.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="dev-mode"
                                        onClick={() => setDeveloperMode(!developerMode)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            developerMode ? 'bg-teal-650' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            developerMode ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Data & Access Security */}
                    <div className="space-y-6">
                        
                        {/* Section Card: Access Policy */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center">
                                    <FiLock className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Security & Access Policy</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Access Controls</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* MFA Policy */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black text-slate-700 block cursor-pointer" htmlFor="mfa">
                                            Require Multi-Factor Auth (MFA)
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-medium block leading-normal">
                                            Enforce hardware key or authenticator verification for all admins.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        id="mfa"
                                        onClick={() => setRequireMfa(!requireMfa)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                                            requireMfa ? 'bg-teal-650' : 'bg-slate-200'
                                        }`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                            requireMfa ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>

                                {/* Session timeout selector */}
                                <div className="space-y-1.5 pt-3 border-t border-slate-50">
                                    <label className="text-xs font-black text-slate-700 block">Session Inactivity Timeout</label>
                                    <select
                                        value={sessionTimeout}
                                        onChange={(e) => setSessionTimeout(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                    >
                                        <option value="15">15 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="60">60 Minutes (1 Hour)</option>
                                        <option value="180">180 Minutes (3 Hours)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section Card: Database & Backup */}
                        <div className="bg-white border border-slate-150 rounded-2xl shadow-md p-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center">
                                    <FiDatabase className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Database Telemetry</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Storage Policies</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Backup frequency selector */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-700 block">Automated Backup Interval</label>
                                    <select
                                        value={backupFrequency}
                                        onChange={(e) => setBackupFrequency(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 font-semibold text-slate-700"
                                    >
                                        <option value="hourly">Hourly Automated Snapshots</option>
                                        <option value="daily">Daily Offsite Backups</option>
                                        <option value="weekly">Weekly Cold Glacier Archive</option>
                                    </select>
                                </div>

                                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex gap-2.5 text-[11px] text-slate-500 leading-relaxed font-semibold">
                                    <FiInfo className="flex-shrink-0 mt-0.5 text-teal-650 text-sm" />
                                    <div>
                                        Database snapshot storage is stored and replicated across AWS Ireland and Germany nodes.
                                    </div>
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
                        className="px-6 py-3 bg-teal-650 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-teal-600/15 flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSaving && <FiLoader className="animate-spin" />}
                        Save System Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
