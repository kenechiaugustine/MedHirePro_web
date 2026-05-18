import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type {
    ICreditEligibility,
    ICreditEligibilityParams,
    ICreditHistoryParams,
    ICreditTransaction,
    IEarnCreditRequest,
    ISpendCreditRequest,
} from './interface';

export const creditsApi = createApi({
    reducerPath: 'creditsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['CreditHistory', 'CreditEligibility'],
    endpoints: (builder) => ({
        earnCredits: builder.mutation<void, IEarnCreditRequest>({
            query: (body) => ({
                url: '/credits/earn',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['CreditHistory', 'CreditEligibility'],
        }),
        spendCredits: builder.mutation<void, ISpendCreditRequest>({
            query: (body) => ({
                url: '/credits/spend',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['CreditHistory', 'CreditEligibility'],
        }),
        getCreditHistory: builder.query<ICreditTransaction[], ICreditHistoryParams | void>({
            query: (params) => ({
                url: `/credits/history`,
                params: params || {}
            }),
            providesTags: ['CreditHistory'],
        }),
        checkCreditEligibility: builder.query<ICreditEligibility, ICreditEligibilityParams>({
            query: (params) => ({
                url: `/credits/eligibility`,
                params: params || {}
            }),
            providesTags: ['CreditEligibility'],
        }),
    }),
});

export const {
    useEarnCreditsMutation,
    useSpendCreditsMutation,
    useGetCreditHistoryQuery,
    useLazyGetCreditHistoryQuery,
    useCheckCreditEligibilityQuery,
    useLazyCheckCreditEligibilityQuery,
} = creditsApi;
