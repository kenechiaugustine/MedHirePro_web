import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IPaginatedResponse, ISingleResponse } from '../../types';
import type {
    IProfessionalOnboardingSubmit,
    IInstituteOnboardingSubmit,
    IOnboardingStatusResponse,
    IOnboardingSubmissionResponse,
    IPendingOnboardingsParams,
    IAdminReviewPayload,
} from './interface';

export const onboardingApi = createApi({
    reducerPath: 'onboardingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['OnboardingStatus', 'PendingOnboardings'],
    endpoints: (builder) => ({
        submitOnboarding: builder.mutation<
            { message: string; submission: IOnboardingSubmissionResponse },
            IProfessionalOnboardingSubmit | IInstituteOnboardingSubmit
        >({
            query: (body) => ({
                url: '/onboarding/submit',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<{ message: string; submission: IOnboardingSubmissionResponse }>) => res.data,
            invalidatesTags: ['OnboardingStatus', 'PendingOnboardings'],
        }),
        getOnboardingStatus: builder.query<IOnboardingStatusResponse, void>({
            query: () => ({
                url: '/onboarding/status',
            }),
            transformResponse: (res: ISingleResponse<IOnboardingStatusResponse>) => res.data,
            providesTags: ['OnboardingStatus'],
        }),
        getPendingOnboardings: builder.query<IPaginatedResponse<IOnboardingSubmissionResponse>, IPendingOnboardingsParams | void>({
            query: (params) => ({
                url: '/onboarding/admin/pending',
                params: params || {},
            }),
            providesTags: ['PendingOnboardings'],
        }),
        reviewOnboarding: builder.mutation<
            { message: string; submission: IOnboardingSubmissionResponse },
            IAdminReviewPayload
        >({
            query: (body) => ({
                url: '/onboarding/admin/review',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<{ message: string; submission: IOnboardingSubmissionResponse }>) => res.data,
            invalidatesTags: ['OnboardingStatus', 'PendingOnboardings'],
        }),
    }),
});

export const {
    useSubmitOnboardingMutation,
    useGetOnboardingStatusQuery,
    useLazyGetOnboardingStatusQuery,
    useGetPendingOnboardingsQuery,
    useLazyGetPendingOnboardingsQuery,
    useReviewOnboardingMutation,
} = onboardingApi;
