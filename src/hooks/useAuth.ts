import { useAppSelector } from '../redux/hooks';
import type { UserRole } from '../redux/apis/userApi/interface';

export function useAuth() {
    const auth = useAppSelector((state) => state.auth);

    return {
        isAuthenticated: auth.isAuthenticated,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        userRole: auth.userRole,
        isProfessional: auth.userRole === 'professional',
        isInstitute: auth.userRole === 'institute',
        isAdmin: auth.userRole === 'admin',
        hasRole: (role: UserRole) => auth.userRole === role,
    };
}
