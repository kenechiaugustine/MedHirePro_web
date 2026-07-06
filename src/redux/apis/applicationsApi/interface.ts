import type { JobType, IJobListingResponse } from '../jobsApi/interface';

export const ApplicationStatus = {
    SUBMITTED: 'SUBMITTED',
    CREDENTIALING_REVIEW: 'CREDENTIALING_REVIEW',
    ACCEPTED: 'ACCEPTED',
    DECLINED: 'DECLINED'
} as const;
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export interface IApplicationCreate {
    vacancy_id: string;
    curriculum_vitae_url: string;
    clinical_summary: string;
    credentialing_packet_urls?: string[];
}

export interface ICandidateDetails {
    id: string;
    full_name?: string;
    email?: string;
    specialty?: string;
    avatar_url?: string;
    is_verified?: boolean;
    employment_status?: string | null;
    current_workplace?: string | null;
    is_intern?: boolean;
    licence_number?: string | null;
    licence_expiry?: string | null;
    licence_document_url?: string | null;
    degree_document_url?: string | null;
    id_document_url?: string | null;
    school_or_placement_letter_url?: string | null;
}

export interface IApplicationResponse {
    _id: string;
    id: string;
    candidate_id: string;
    candidate_details?: ICandidateDetails;
    vacancy_id: IJobListingResponse | string;
    vacancy_type: JobType;
    curriculum_vitae_url: string;
    clinical_summary: string;
    credentialing_packet_urls: string[];
    is_shortlisted: boolean;
    is_accepted: boolean;
    application_status: ApplicationStatus;
    created_at: string;
    updated_at: string;
}

export interface IGetApplicationsParams {
    candidate_id?: string;
    vacancy_id?: string;
    vacancy_type?: JobType;
    is_shortlisted?: boolean;
    is_accepted?: boolean;
    application_status?: ApplicationStatus;
    page?: number;
    limit?: number;
}

export interface IApplicationShortlistUpdate {
    is_shortlisted: boolean;
}

export interface IApplicationAcceptUpdate {
    is_accepted: boolean;
}
