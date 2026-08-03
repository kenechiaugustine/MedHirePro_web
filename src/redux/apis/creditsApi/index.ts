import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IPaginatedResponse, ISingleResponse } from '../../types';
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
        earnCredits: builder.mutation<ICreditTransaction, IEarnCreditRequest>({
            query: (body) => ({
                url: '/credits/earn',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<ICreditTransaction>) => res.data,
            invalidatesTags: ['CreditHistory', 'CreditEligibility'],
        }),
        spendCredits: builder.mutation<ICreditTransaction, ISpendCreditRequest>({
            query: (body) => ({
                url: '/credits/spend',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<ICreditTransaction>) => res.data,
            invalidatesTags: ['CreditHistory', 'CreditEligibility'],
        }),
        getCreditHistory: builder.query<IPaginatedResponse<ICreditTransaction>, ICreditHistoryParams | void>({
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
            transformResponse: (res: ISingleResponse<ICreditEligibility>) => res.data,
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
