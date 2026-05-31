import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { useGetMeQuery } from "../../redux/apis/userApi";
import { Avatar } from "../../components/app";
import {
    FiGrid,
    FiSettings,
    FiLogOut,
    FiUsers,
    FiCreditCard,
    FiCheckSquare
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch logged-in admin details
    const { data: user, isLoading } = useGetMeQuery();

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Successfully logged out!");
        navigate("/login");
    };

    const sidebarLinks = [
        { name: "Overview Dashboard", path: "/admin/dashboard", icon: <FiGrid className="text-lg" /> },
        { name: "Verify Credentials", path: "/admin/verifications", icon: <FiCheckSquare className="text-lg" /> },
        { name: "Users Management", path: "/admin/users", icon: <FiUsers className="text-lg" /> },
        { name: "Credits Ledger", path: "/admin/credits", icon: <FiCreditCard className="text-lg" /> },
        { name: "Admin Settings", path: "/admin/settings", icon: <FiSettings className="text-lg" /> },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-teal-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-slate-500 font-medium text-sm">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0b2545] text-white flex flex-col h-full border-r border-[#134074]/40 relative z-25">
                {/* Header/Logo */}
                <div className="h-20 flex items-center px-6 border-b border-[#134074]/60">
                    <Link to="/" className="text-teal-400 font-bold text-xl tracking-tight hover:opacity-95 transition-opacity">
                        MedHirePro
                    </Link>
                    <span className="ml-2 text-[10px] font-bold text-teal-200/60 uppercase bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                        Admin
                    </span>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 group
                                    ${isActive
                                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                                        : "text-slate-400 hover:bg-[#134074]/50 hover:text-slate-100"
                                    }
                                `}
                            >
                                <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200 transition-colors"}>
                                    {link.icon}
                                </span>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section: Admin Profile Brief & Logout */}
                <div className="p-4 border-t border-[#134074]/60 bg-[#05162b]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <Avatar
                            name={user?.full_name || "Admin User"}
                            avatarUrl={user?.avatar_url}
                            size="sm"
                            role="admin"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-200 truncate">
                                {user?.full_name || "System Admin"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-950/40 text-red-400 hover:bg-red-900/40 hover:text-red-200 transition duration-200 py-2.5 rounded-lg text-sm font-medium border border-red-900/30 cursor-pointer"
                    >
                        <FiLogOut className="text-base" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 relative z-20">
                    <h2 className="text-lg font-bold text-slate-800">
                        {sidebarLinks.find(link => location.pathname === link.path)?.name || "Dashboard"}
                    </h2>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="text-[11px] font-bold text-slate-400 block tracking-wider uppercase">
                                System Status
                            </span>
                            <span className="text-sm font-extrabold text-teal-600 flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                Healthy & Active
                            </span>
                        </div>
                        <Avatar
                            name={user?.full_name || "Admin"}
                            avatarUrl={user?.avatar_url}
                            size="sm"
                            role="admin"
                        />
                    </div>
                </header>

                {/* Sub-page Render Box */}
                <div className="flex-grow overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
