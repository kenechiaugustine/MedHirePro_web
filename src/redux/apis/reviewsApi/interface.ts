import type { IUser } from '../userApi/interface';

export interface IReviewCreate {
    rating: number;
    comment: string;
}

export interface IReviewResponse {
    _id: string;
    user_id: string;
    rating: number;
    comment: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    user_details?: IUser | null;
}

export interface IReviewListParams {
    page?: number;
    limit?: number;
}
