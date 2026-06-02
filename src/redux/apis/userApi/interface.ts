export type UserRole = 'professional' | 'institute' | 'admin';

export interface IUser {
    _id: string;
    email: string;
    full_name: string | null;
    specialty: string | null;
    facility_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    credit_balance: number;
    daily_credit_cap: number;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string | null;
    updated_at: string | null;
}

export interface IUpdateProfileRequest {
    full_name?: string | null;
    specialty?: string | null;
    facility_name?: string | null;
    avatar_url?: string | null;
}