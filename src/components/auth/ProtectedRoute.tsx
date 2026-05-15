import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserType } from '../../types/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    allowedRoles 
}) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#0b5cd5] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
        // Role not authorized, redirect to their respective dashboard
        console.warn(`User role ${user.user_type} not authorized for this route.`);
        
        if (user.user_type === 'professional') {
            return <Navigate to="/user" replace />;
        } else if (user.user_type === 'institute') {
            return <Navigate to="/client" replace />;
        } else if (user.user_type === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
