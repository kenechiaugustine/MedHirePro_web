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

export interface IApplicationResponse {
    _id: string;
    id: string;
    candidate_id: string;
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
