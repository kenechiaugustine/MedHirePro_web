import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#0b5cd5] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (user) {
        // User is already logged in, redirect to their respective dashboard
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

export default PublicRoute;
