import type { IFacilityAddress } from "../onboardingApi/interface";

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
    is_verified?: boolean;
    onboarding_status?: string;
    employment_status?: string | null;
    current_workplace?: string | null;
    is_intern?: boolean;
    licence_number?: string | null;
    licence_expiry?: string | null;
    licence_document_url?: string | null;
    degree_document_url?: string | null;
    id_document_url?: string | null;
    school_or_placement_letter_url?: string | null;
    business_registration_number?: string | null;
    facility_type?: string | null;
    business_license_url?: string | null;
    proof_of_address_url?: string | null;
    representative_id_url?: string | null;
    facility_address?: IFacilityAddress | null;
    referral_code?: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface IUpdateProfileRequest {
    full_name?: string | null;
    specialty?: string | null;
    facility_name?: string | null;
    avatar_url?: string | null;
}