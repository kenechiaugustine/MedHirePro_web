export const JobType = {
    PERMANENT: 'PERMANENT',
    LOCUM: 'LOCUM'
} as const;
export type JobType = typeof JobType[keyof typeof JobType];

export const JobStatus = {
    DRAFT: 'DRAFT',
    OPEN: 'OPEN',
    FILLED: 'FILLED',
    EXPIRED: 'EXPIRED'
} as const;
export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

export const RateType = {
    HOURLY: 'HOURLY',
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    ANNUALLY: 'ANNUALLY'
} as const;
export type RateType = typeof RateType[keyof typeof RateType];

export const ClinicalSetting = {
    ACUTE_CARE_HOSPITAL: 'ACUTE_CARE_HOSPITAL',
    OUTPATIENT_CLINIC: 'OUTPATIENT_CLINIC',
    SPECIALTY_HOSPITAL: 'SPECIALTY_HOSPITAL',
    LONG_TERM_CARE: 'LONG_TERM_CARE',
    COMMUNITY_HEALTH: 'COMMUNITY_HEALTH'
} as const;
export type ClinicalSetting = typeof ClinicalSetting[keyof typeof ClinicalSetting];

export const ClinicalSpecialty = {
    GENERAL_PRACTICE: 'GENERAL_PRACTICE',
    INTERNAL_MEDICINE: 'INTERNAL_MEDICINE',
    PEDIATRICS: 'PEDIATRICS',
    OBSTETRICS_GYNECOLOGY: 'OBSTETRICS_GYNECOLOGY',
    SURGERY: 'SURGERY',
    ANESTHESIOLOGY: 'ANESTHESIOLOGY',
    CARDIOLOGY: 'CARDIOLOGY'
} as const;
export type ClinicalSpecialty = typeof ClinicalSpecialty[keyof typeof ClinicalSpecialty];

export interface IPermanentJobListingCreate {
    position_title: string;
    clinical_specialty: ClinicalSpecialty;
    clinical_setting: ClinicalSetting;
    department_unit: string;
    description: string;
    required_credentials: string[];
    minimum_experience_years: number;
    city: string;
    state: string;
    country: string;
    rate_type: RateType;
    rate_amount_min: number;
    rate_amount_max: number;
    currency?: string;
    currency_symbol?: string;
    facility_location?: string;
    accepts_interns?: boolean;
    rotation_schedule?: string | null;
    fringe_benefits?: string[];
}

export interface ILocumJobListingCreate {
    position_title: string;
    clinical_specialty: ClinicalSpecialty;
    clinical_setting: ClinicalSetting;
    department_unit: string;
    description: string;
    required_credentials: string[];
    minimum_experience_years: number;
    city: string;
    state: string;
    country: string;
    rate_type: RateType;
    rate_amount_min: number;
    rate_amount_max: number;
    currency?: string;
    currency_symbol?: string;
    facility_location?: string;
    coverage_start_date: string; // ISO DateTime string
    coverage_end_date: string; // ISO DateTime string
    shift_hours: string;
    malpractice_insurance_provided?: boolean;
    travel_housing_reimbursement?: boolean;
    on_call_requirements?: string | null;
}

export interface IJobListingUpdate {
    status?: JobStatus;
    position_title?: string;
    clinical_specialty?: ClinicalSpecialty;
    clinical_setting?: ClinicalSetting;
    department_unit?: string;
    description?: string;
    required_credentials?: string[];
    minimum_experience_years?: number;
    city?: string;
    state?: string;
    country?: string;
    rate_type?: RateType;
    rate_amount_min?: number;
    rate_amount_max?: number;
    currency?: string;
    currency_symbol?: string;
    facility_location?: string;
    accepts_interns?: boolean;
    rotation_schedule?: string | null;
    fringe_benefits?: string[];
    coverage_start_date?: string | null;
    coverage_end_date?: string | null;
    shift_hours?: string | null;
    malpractice_insurance_provided?: boolean;
    travel_housing_reimbursement?: boolean;
    on_call_requirements?: string | null;
}

export interface IJobListingResponse {
    _id: string;
    id: string;
    posted_by: string;
    poster_type: string;
    job_type: JobType;
    status: JobStatus;
    position_title: string;
    clinical_specialty: ClinicalSpecialty;
    clinical_setting: ClinicalSetting;
    department_unit: string;
    description: string;
    required_credentials: string[];
    minimum_experience_years: number;
    city: string;
    state: string;
    country: string;
    rate_type: RateType;
    rate_amount_min: number;
    rate_amount_max: number;
    currency: string;
    currency_symbol: string;
    facility_location: string;
    accepts_interns: boolean | null;
    rotation_schedule: string | null;
    fringe_benefits: string[];
    coverage_start_date: string | null;
    coverage_end_date: string | null;
    shift_hours: string | null;
    malpractice_insurance_provided: boolean | null;
    travel_housing_reimbursement: boolean | null;
    on_call_requirements: string | null;
    total_applicants?: number | null;
    created_at: string;
    updated_at: string;
}

export interface IGetJobListingsParams {
    job_type?: JobType;
    clinical_specialty?: ClinicalSpecialty;
    clinical_setting?: ClinicalSetting;
    status?: JobStatus;
    page?: number;
    limit?: number;
}

export interface IReassignJobPayload {
    new_owner_id: string;
    job_type: JobType;
}
