import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function UserLayout() {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-[#0a192f]">Professional Dashboard</h1>
                        <p className="text-slate-500 text-xs">Welcome back, {user?.email}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}