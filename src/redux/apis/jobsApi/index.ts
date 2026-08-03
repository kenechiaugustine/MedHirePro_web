import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IPaginatedResponse, ISingleResponse } from '../../types';
import type {
    IJobListingResponse,
    IPermanentJobListingCreate,
    ILocumJobListingCreate,
    IJobListingUpdate,
    IGetJobListingsParams,
    IReassignJobPayload,
} from './interface';

export const jobsApi = createApi({
    reducerPath: 'jobsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['JobListings', 'UserJobListings', 'JobDetails'],
    endpoints: (builder) => ({
        postPermanentJob: builder.mutation<IJobListingResponse, IPermanentJobListingCreate>({
            query: (body) => ({
                url: '/jobs/permanent',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IJobListingResponse>) => res.data,
            invalidatesTags: ['JobListings', 'UserJobListings'],
        }),
        postLocumJob: builder.mutation<IJobListingResponse, ILocumJobListingCreate>({
            query: (body) => ({
                url: '/jobs/locum',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IJobListingResponse>) => res.data,
            invalidatesTags: ['JobListings', 'UserJobListings'],
        }),
        getJobListings: builder.query<IPaginatedResponse<IJobListingResponse>, IGetJobListingsParams | void>({
            query: (params) => ({
                url: '/jobs',
                params: params || {},
            }),
            providesTags: ['JobListings'],
        }),
        getMyJobListings: builder.query<IPaginatedResponse<IJobListingResponse>, IGetJobListingsParams | void>({
            query: (params) => ({
                url: '/jobs/my-listings',
                params: params || {},
            }),
            providesTags: ['UserJobListings'],
        }),
        getJobListingDetails: builder.query<IJobListingResponse, string>({
            query: (id) => ({
                url: `/jobs/${id}`,
            }),
            transformResponse: (res: ISingleResponse<IJobListingResponse>) => res.data,
            providesTags: (_result, _error, id) => [{ type: 'JobDetails', id }],
        }),
        updateJobListing: builder.mutation<IJobListingResponse, { id: string; body: IJobListingUpdate }>({
            query: ({ id, body }) => ({
                url: `/jobs/${id}`,
                method: 'PUT',
                body,
            }),
            transformResponse: (res: ISingleResponse<IJobListingResponse>) => res.data,
            invalidatesTags: (_result, _error, { id }) => [
                'JobListings',
                'UserJobListings',
                { type: 'JobDetails', id },
            ],
        }),
        deleteJobListing: builder.mutation<void, string>({
            query: (id) => ({
                url: `/jobs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['JobListings', 'UserJobListings'],
        }),
        reassignJob: builder.mutation<IJobListingResponse, { id: string; body: IReassignJobPayload }>({
            query: ({ id, body }) => ({
                url: `/admin/jobs/${id}/reassign`,
                method: 'PUT',
                body,
            }),
            transformResponse: (res: ISingleResponse<IJobListingResponse>) => res.data,
            invalidatesTags: (_result, _error, { id }) => [
                'JobListings',
                'UserJobListings',
                { type: 'JobDetails', id },
            ],
        }),
        flagJob: builder.mutation<{ message: string; updated_job: IJobListingResponse }, { id: string; body: { reason: string } }>({
            query: ({ id, body }) => ({
                url: `/admin/jobs/${id}/flag`,
                method: 'PUT',
                body,
            }),
            transformResponse: (res: ISingleResponse<{ message: string; updated_job: IJobListingResponse }>) => res.data,
            invalidatesTags: (_result, _error, { id }) => [
                'JobListings',
                'UserJobListings',
                { type: 'JobDetails', id },
            ],
        }),
        unflagJob: builder.mutation<{ message: string; updated_job: IJobListingResponse }, string>({
            query: (id) => ({
                url: `/admin/jobs/${id}/unflag`,
                method: 'PUT',
            }),
            transformResponse: (res: ISingleResponse<{ message: string; updated_job: IJobListingResponse }>) => res.data,
            invalidatesTags: (_result, _error, id) => [
                'JobListings',
                'UserJobListings',
                { type: 'JobDetails', id },
            ],
        }),
    }),
});

export const {
    usePostPermanentJobMutation,
    usePostLocumJobMutation,
    useGetJobListingsQuery,
    useLazyGetJobListingsQuery,
    useGetMyJobListingsQuery,
    useLazyGetMyJobListingsQuery,
    useGetJobListingDetailsQuery,
    useLazyGetJobListingDetailsQuery,
    useUpdateJobListingMutation,
    useDeleteJobListingMutation,
    useReassignJobMutation,
    useFlagJobMutation,
    useUnflagJobMutation,
} = jobsApi;
