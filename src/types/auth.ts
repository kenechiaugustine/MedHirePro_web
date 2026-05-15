export type UserType = 'professional' | 'institute' | 'admin';

export interface BaseProfile {
    id: string;
    email: string;
    user_type: UserType;
    has_onboarded: boolean;
    created_at?: string;
}

export interface ProfessionalProfile extends BaseProfile {
    user_type: 'professional';
    full_name: string;
    specialty: string;
}

export interface InstituteProfile extends BaseProfile {
    user_type: 'institute';
    facility_name: string;
}

export interface AdminProfile extends BaseProfile {
    user_type: 'admin';
}

export type UserProfile = ProfessionalProfile | InstituteProfile | AdminProfile;

export interface AuthState {
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
}
