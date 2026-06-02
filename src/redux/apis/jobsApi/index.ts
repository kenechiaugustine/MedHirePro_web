import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
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
            invalidatesTags: ['JobListings', 'UserJobListings'],
        }),
        postLocumJob: builder.mutation<IJobListingResponse, ILocumJobListingCreate>({
            query: (body) => ({
                url: '/jobs/locum',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['JobListings', 'UserJobListings'],
        }),
        getJobListings: builder.query<IJobListingResponse[], IGetJobListingsParams | void>({
            query: (params) => ({
                url: '/jobs',
                params: params || {},
            }),
            providesTags: ['JobListings'],
        }),
        getMyJobListings: builder.query<IJobListingResponse[], IGetJobListingsParams | void>({
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
            providesTags: (_result, _error, id) => [{ type: 'JobDetails', id }],
        }),
        updateJobListing: builder.mutation<IJobListingResponse, { id: string; body: IJobListingUpdate }>({
            query: ({ id, body }) => ({
                url: `/jobs/${id}`,
                method: 'PUT',
                body,
            }),
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
            invalidatesTags: (_result, _error, { id }) => [
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
} = jobsApi;
