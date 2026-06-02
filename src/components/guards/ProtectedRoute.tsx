import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../redux/apis/userApi/interface';
import { WEBSITE_ROUTES } from '../../pages/website/routes.enum';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, userRole } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Please log in to access this page.");
        } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
            toast.error("You are not authorized to access this section.");
        }
    }, [isAuthenticated, userRole, allowedRoles]);

    // Not authenticated — redirect to login, remembering where they wanted to go
    if (!isAuthenticated) {
        return <Navigate to={WEBSITE_ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // Authenticated but doesn't have the right role — redirect to their correct dashboard
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        const redirectPath = getRoleDashboard(userRole);
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
}

export function getRoleDashboard(role: UserRole | null): string {
    switch (role) {
        case 'professional':
            return '/user/dashboard';
        case 'institute':
            return '/client/dashboard';
        case 'admin':
            return '/admin/dashboard';
        default:
            return '/login';
    }
}
