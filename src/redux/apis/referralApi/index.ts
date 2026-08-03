import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IPaginatedResponse, ISingleResponse } from '../../types';
import type {
    IApplyReferralRequest,
    IApplyReferralResponse,
    IUserReferralDetailsResponse,
    IReferredUser,
} from './interface';

export const referralApi = createApi({
    reducerPath: 'referralApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ReferralDetails', 'ReferredUsers'],
    endpoints: (builder) => ({
        applyReferral: builder.mutation<IApplyReferralResponse, IApplyReferralRequest>({
            query: (body) => ({
                url: '/referral/apply',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IApplyReferralResponse>) => res.data,
            invalidatesTags: ['ReferralDetails', 'ReferredUsers'],
        }),
        getReferralDetails: builder.query<IUserReferralDetailsResponse, void>({
            query: () => ({
                url: '/referral/details',
                method: 'GET',
            }),
            transformResponse: (res: ISingleResponse<IUserReferralDetailsResponse>) => res.data,
            providesTags: ['ReferralDetails'],
        }),
        getReferredUsers: builder.query<IPaginatedResponse<IReferredUser>, { page?: number; limit?: number } | void>({
            query: (params) => ({
                url: '/referral/users',
                method: 'GET',
                params: params || undefined,
            }),
            providesTags: ['ReferredUsers'],
        }),
    }),
});

export const {
    useApplyReferralMutation,
    useGetReferralDetailsQuery,
    useLazyGetReferralDetailsQuery,
    useGetReferredUsersQuery,
    useLazyGetReferredUsersQuery,
} = referralApi;
