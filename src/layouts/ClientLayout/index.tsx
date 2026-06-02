import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { useGetMeQuery } from "../../redux/apis/userApi";
import { Avatar } from "../../components/app";
import { 
    FiGrid, 
    FiUser, 
    FiUsers, 
    FiSettings, 
    FiLogOut, 
    FiShield,
    FiMenu,
    FiX,
    FiList
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function ClientLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Toggle state for mobile sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Fetch logged-in facility details
    const { data: user, isLoading } = useGetMeQuery();

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Successfully logged out!");
        navigate("/login");
    };

    const sidebarLinks = [
        { name: "Dashboard", path: "/client/dashboard", icon: <FiGrid className="text-lg" /> },
        { name: "Verification", path: "/client/onboarding", icon: <FiShield className="text-lg" /> },
        { name: "Job Listings", path: "/client/jobs", icon: <FiList className="text-lg" /> },
        { name: "Manage Applicants", path: "/client/applicants", icon: <FiUsers className="text-lg" /> },
        { name: "Institute Profile", path: "/client/profile", icon: <FiUser className="text-lg" /> },
        { name: "Settings", path: "/client/settings", icon: <FiSettings className="text-lg" /> },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24">
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
            {/* Backdrop for Mobile Sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-30 bg-indigo-950/40 backdrop-blur-xs lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1e1b4b] text-white flex flex-col h-full border-r border-[#2e2a72]/40 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-full lg:flex ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                {/* Header/Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-[#2e2a72]/65 flex-shrink-0">
                    <div className="flex items-center">
                        <Link to="/" className="text-indigo-300 font-bold text-xl tracking-tight hover:opacity-95 transition-opacity">
                            MedHirePro
                        </Link>
                        <span className="ml-2 text-[10px] font-bold text-indigo-200/60 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            Client
                        </span>
                    </div>
                    {/* Close button for Mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-[#2e2a72]/50 transition-colors cursor-pointer"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 group
                                    ${isActive 
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                                        : "text-slate-400 hover:bg-[#2e2a72]/50 hover:text-slate-100"
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

                {/* Footer Section: Facility Profile Brief & Logout */}
                <div className="p-4 border-t border-[#2e2a72]/65 bg-[#12102f] flex-shrink-0">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <Avatar 
                            name={user?.facility_name} 
                            avatarUrl={user?.avatar_url} 
                            size="sm" 
                            role="institute" 
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-200 truncate">
                                {user?.facility_name || "Institution"}
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
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 md:px-8 relative z-20 flex-shrink-0">
                    <div className="flex items-center">
                        {/* Hamburger menu button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-800 rounded-lg lg:hidden hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <FiMenu className="text-xl" />
                        </button>
                        <h2 className="text-base sm:text-lg font-bold text-slate-800">
                            {sidebarLinks.find(link => location.pathname === link.path)?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="text-[11px] font-bold text-slate-400 block tracking-wider uppercase">
                                Balance
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold text-indigo-600">
                                ₦{(user?.credit_balance ?? 0) * 100}
                            </span>
                        </div>
                        <Avatar 
                            name={user?.facility_name} 
                            avatarUrl={user?.avatar_url} 
                            size="sm" 
                            role="institute" 
                        />
                    </div>
                </header>

                {/* Sub-page Render Box */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}