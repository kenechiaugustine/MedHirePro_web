import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
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
            invalidatesTags: ['ReferralDetails', 'ReferredUsers'],
        }),
        getReferralDetails: builder.query<IUserReferralDetailsResponse, void>({
            query: () => ({
                url: '/referral/details',
                method: 'GET',
            }),
            providesTags: ['ReferralDetails'],
        }),
        getReferredUsers: builder.query<IReferredUser[], void>({
            query: () => ({
                url: '/referral/users',
                method: 'GET',
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
