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
    ACUTE_CARE_HOSPITAL: 'Acute Care Hospital',
    OUTPATIENT_CLINIC: 'Outpatient Clinic',
    REHABILITATION_FACILITY: 'Rehabilitation Facility',
    LONG_TERM_CARE: 'Long-Term Care Facility',
    SKILLED_NURSING_FACILITY: 'Skilled Nursing Facility',
    URGENT_CARE_CENTER: 'Urgent Care Center',
    COMMUNITY_HEALTH_CENTER: 'Community Health Center',
    TELEHEALTH: 'Telehealth'
} as const;
export type ClinicalSetting = typeof ClinicalSetting[keyof typeof ClinicalSetting];

export const ClinicalSpecialty = {
    CARDIOLOGY: 'Cardiology',
    EMERGENCY_MEDICINE: 'Emergency Medicine',
    PEDIATRICS: 'Pediatrics',
    INTERNAL_MEDICINE: 'Internal Medicine',
    ANESTHESIOLOGY: 'Anesthesiology',
    FAMILY_PRACTICE: 'Family Practice',
    PULMONOLOGY: 'Pulmonology',
    CRITICAL_CARE: 'Critical Care',
    OBSTETRICS_GYNECOLOGY: 'Obstetrics & Gynecology',
    PSYCHIATRY: 'Psychiatry',
    SURGERY: 'Surgery',
    GENERAL_PRACTICE: 'General Practice',
    NURSING: 'Nursing',
    PHARMACY: 'Pharmacy'
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
