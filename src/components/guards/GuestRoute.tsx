import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDashboard } from './ProtectedRoute';
import toast from 'react-hot-toast';

interface GuestRouteProps {
    children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
    const { isAuthenticated, userRole } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("You are already logged in!");
        }
    }, [isAuthenticated]);

    // If already authenticated, redirect to their dashboard
    if (isAuthenticated && userRole) {
        return <Navigate to={getRoleDashboard(userRole)} replace />;
    }

    return <>{children}</>;
}
