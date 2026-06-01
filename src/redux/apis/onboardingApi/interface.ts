export interface IProfessionalOnboardingSubmit {
    is_intern: boolean;
    licence_number?: string | null;
    licence_expiry?: string | null; // YYYY-MM-DD
    licence_document_url?: string | null;
    degree_document_url: string;
    id_document_url: string;
    school_or_placement_letter_url?: string | null;
    specialty: string;
    employment_status?: string | null;
    current_workplace?: string | null;
}

export interface IFacilityAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface IInstituteOnboardingSubmit {
    business_registration_number: string;
    facility_type: string;
    business_license_url: string;
    proof_of_address_url: string;
    representative_id_url: string;
    facility_address: IFacilityAddress;
}

export interface IOnboardingSubmissionResponse {
    _id: string;
    id: string;
    user_id: string;
    role: 'professional' | 'institute';
    details: IProfessionalOnboardingSubmit | IInstituteOnboardingSubmit;
    status: 'pending' | 'approved' | 'rejected';
    admin_id?: string | null;
    rejection_reason?: string | null;
    reviewed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface IOnboardingStatusResponse {
    onboarding_status: 'pending' | 'approved' | 'rejected' | 'not_started';
    is_verified: boolean;
    submission?: IOnboardingSubmissionResponse | null;
}

export interface IPendingOnboardingsParams {
    skip?: number;
    limit?: number;
}

export interface IPendingOnboardingsResponse {
    count: number;
    submissions: IOnboardingSubmissionResponse[];
}

export interface IAdminReviewPayload {
    submission_id: string;
    action: 'approve' | 'reject';
    rejection_reason?: string | null;
}
