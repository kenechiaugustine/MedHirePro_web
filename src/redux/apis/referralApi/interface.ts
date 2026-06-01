import type { IUser } from '../userApi/interface';

export interface IApplyReferralRequest {
    referral_code: string;
}

export interface IApplyReferralResponse {
    message: string;
    referrer_name?: string | null;
}

export interface IUserReferralDetailsResponse {
    referral_code: string | null;
    referred_count: number;
    referred_by: string | null;
    total_referral_credits_earned: number;
}

export type IReferredUser = IUser;
