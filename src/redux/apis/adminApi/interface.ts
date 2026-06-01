import type { IJobListingResponse } from '../jobsApi/interface';

export interface IAdminUsersParams {
    page?: number;
    limit?: number;
    role?: 'professional' | 'institute' | 'admin' | null;
    is_active?: boolean | null;
    search?: string | null;
}

export interface IAdminUserCreditsParams {
    user_id: string;
    page?: number;
    limit?: number;
    date?: string | null; // YYYY-MM-DD
    type?: 'earn' | 'spend' | null;
    source?: string | null;
}

export interface IAdminUserReferralsParams {
    user_id: string;
    page?: number;
    limit?: number;
}

export interface IReassignJobRequest {
    vacancy_id: string;
    new_owner_id: string;
    job_type: 'PERMANENT' | 'LOCUM';
}

export interface IAdminReassignJobResponse {
    message: string;
    updated_job: IJobListingResponse;
}
