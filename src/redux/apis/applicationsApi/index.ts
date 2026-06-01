import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type {
    IApplicationResponse,
    IApplicationCreate,
    IGetApplicationsParams,
    IApplicationShortlistUpdate,
    IApplicationAcceptUpdate,
    ApplicationStatus,
} from './interface';

export const applicationsApi = createApi({
    reducerPath: 'applicationsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Applications', 'UserApplications', 'ApplicationDetails'],
    endpoints: (builder) => ({
        submitApplication: builder.mutation<IApplicationResponse, IApplicationCreate>({
            query: (body) => ({
                url: '/applications',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Applications', 'UserApplications'],
        }),
        getApplications: builder.query<IApplicationResponse[], IGetApplicationsParams | void>({
            query: (params) => ({
                url: '/applications',
                params: params || {},
            }),
            providesTags: ['Applications'],
        }),
        getMyApplications: builder.query<IApplicationResponse[], IGetApplicationsParams | void>({
            query: (params) => ({
                url: '/applications/my-applications',
                params: params || {},
            }),
            providesTags: ['UserApplications'],
        }),
        getApplicationDetails: builder.query<IApplicationResponse, string>({
            query: (id) => ({
                url: `/applications/${id}`,
            }),
            providesTags: (_result, _error, id) => [{ type: 'ApplicationDetails', id }],
        }),
        shortlistApplication: builder.mutation<IApplicationResponse, { id: string; body: IApplicationShortlistUpdate }>({
            query: ({ id, body }) => ({
                url: `/applications/${id}/shortlist`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'Applications',
                'UserApplications',
                { type: 'ApplicationDetails', id },
            ],
        }),
        acceptApplication: builder.mutation<IApplicationResponse, { id: string; body: IApplicationAcceptUpdate }>({
            query: ({ id, body }) => ({
                url: `/applications/${id}/accept`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'Applications',
                'UserApplications',
                { type: 'ApplicationDetails', id },
            ],
        }),
        updateApplicationStatus: builder.mutation<IApplicationResponse, { id: string; application_status: ApplicationStatus }>({
            query: ({ id, application_status }) => ({
                url: `/applications/${id}/status`,
                method: 'PUT',
                body: { application_status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'Applications',
                'UserApplications',
                { type: 'ApplicationDetails', id },
            ],
        }),
    }),
});

export const {
    useSubmitApplicationMutation,
    useGetApplicationsQuery,
    useLazyGetApplicationsQuery,
    useGetMyApplicationsQuery,
    useLazyGetMyApplicationsQuery,
    useGetApplicationDetailsQuery,
    useLazyGetApplicationDetailsQuery,
    useShortlistApplicationMutation,
    useAcceptApplicationMutation,
    useUpdateApplicationStatusMutation,
} = applicationsApi;
