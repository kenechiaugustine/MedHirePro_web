import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type {
    IProfessionalOnboardingSubmit,
    IInstituteOnboardingSubmit,
    IOnboardingStatusResponse,
    IOnboardingSubmissionResponse,
    IPendingOnboardingsParams,
    IPendingOnboardingsResponse,
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
            invalidatesTags: ['OnboardingStatus', 'PendingOnboardings'],
        }),
        getOnboardingStatus: builder.query<IOnboardingStatusResponse, void>({
            query: () => ({
                url: '/onboarding/status',
            }),
            providesTags: ['OnboardingStatus'],
        }),
        getPendingOnboardings: builder.query<IPendingOnboardingsResponse, IPendingOnboardingsParams | void>({
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
