export type CreditSource =
    | 'signup'
    | 'purchase'
    | 'referral'
    | 'socials'
    | 'daily'
    | 'bonus'
    | 'admin'
    | 'spend'
    | 'access';

export type CreditType = 'earn' | 'spend';

// --- Request types ---

export interface IEarnCreditRequest {
    amount: number;
    source: CreditSource;
}

export interface ISpendCreditRequest {
    amount: number;
    source?: CreditSource;
    description?: string | null;
}

export interface ICreditHistoryParams {
    page?: number;
    limit?: number;
    date?: string | null;
    type?: CreditType | null;
    source?: CreditSource | null;
}

export interface ICreditEligibilityParams {
    source: CreditSource;
}

// --- Response types ---

export interface ICreditTransaction {
    _id: string;
    amount: number;
    type: CreditType;
    source: CreditSource;
    created_at: string;
    description: string | null;
}

export interface ICreditEligibility {
    source: CreditSource;
    eligible: boolean;
    message: string;
    current_usage: number;
    limit: number;
    remaining: number;
}
