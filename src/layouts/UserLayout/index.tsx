import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { USER_ROUTES } from "../../pages/user/routes.enum";
import {
    LayoutDashboard,
    ShieldCheck,
    Search,
    Briefcase,
    UserCircle,
    Settings,
    LogOut,
    Menu,
    PlusSquare,
    Bell
} from "lucide-react";
import clsx from "clsx";

export default function UserLayout() {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (user && !user.has_onboarded && !hasRedirected.current) {
            hasRedirected.current = true;
            if (location.pathname !== USER_ROUTES.VERIFICATION) {
                navigate(USER_ROUTES.VERIFICATION);
            }
        }
    }, [user, location.pathname, navigate]);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    let userName = 'User';
    if (user?.user_type === 'professional') {
        userName = (user as any).full_name || 'User';
    } else if (user?.user_type === 'institute') {
        userName = (user as any).facility_name || 'User';
    }

    const avatarUrl = (user as any)?.avatar_url || (user as any)?.profile_image_url || (user as any)?.image_url;
    const firstLetter = userName.charAt(0).toUpperCase();

    const navItems = [
        { name: "Dashboard", path: USER_ROUTES.DASHBOARD, icon: LayoutDashboard },
        { name: "Verifications", path: USER_ROUTES.VERIFICATION, icon: ShieldCheck },
        { name: "Job Search", path: USER_ROUTES.JOB_SEARCH, icon: Search },
        { name: "My Applications", path: USER_ROUTES.APPLICATIONS, icon: Briefcase },
        { name: "Profile", path: USER_ROUTES.PROFILE, icon: UserCircle },
        { name: "Settings", path: USER_ROUTES.SETTINGS, icon: Settings },
    ];

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 shadow-sm",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-[#0b5cff] text-white p-1.5 rounded-lg shadow-sm">
                        <PlusSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#0a192f] leading-none tracking-tight">MedHirePro</h1>
                        <span className="text-[10px] font-bold text-[#0b5cff] tracking-widest uppercase">Clinical Precision</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-blue-50 text-[#0b5cff] shadow-sm ring-1 ring-blue-100"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <Icon className={clsx("w-5 h-5", isActive ? "text-[#0b5cff]" : "text-slate-400")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 bg-slate-50/50 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-slate-400" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#f4f7f9]">
                <header className="bg-white border-b border-slate-200 shadow-sm lg:hidden px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#0b5cff] text-white p-1 rounded-md">
                            <PlusSquare className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-[#0a192f] tracking-tight">MedHirePro</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to={USER_ROUTES.NOTIFICATIONS} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <div className="p-4 md:p-6 lg:p-8 flex-1 w-full max-w-[1600px] mx-auto">
                    {/* Top Nav (Desktop) */}
                    <div className="hidden lg:flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-[#0a192f] tracking-tight">Welcome back, {userName}.</h1>
                        <div className="flex items-center gap-4">
                            <Link to={USER_ROUTES.NOTIFICATIONS} className="p-2.5 bg-[#f4f7f9] rounded-full border border-slate-200 shadow-sm text-slate-600 hover:text-[#0b5cff] hover:border-blue-100 transition-colors">
                                <Bell className="w-5 h-5" />
                            </Link>
                            <Link to={USER_ROUTES.PROFILE} className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-200 shadow-sm hover:border-blue-100 transition-colors">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-[#0b5cff] text-white flex items-center justify-center font-bold text-sm">
                                        {firstLetter}
                                    </div>
                                )}
                                <span className="text-sm font-bold text-[#0a192f]">{userName}</span>
                            </Link>
                        </div>
                    </div>

                    <Outlet />
                </div>
            </main>
        </div>
    );
}