import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IPaginatedResponse, ISingleResponse } from '../../types';
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
            transformResponse: (res: ISingleResponse<IApplicationResponse>) => res.data,
            invalidatesTags: ['Applications', 'UserApplications'],
        }),
        getApplications: builder.query<IPaginatedResponse<IApplicationResponse>, IGetApplicationsParams | void>({
            query: (params) => ({
                url: '/applications',
                params: params || {},
            }),
            providesTags: ['Applications'],
        }),
        getMyApplications: builder.query<IPaginatedResponse<IApplicationResponse>, IGetApplicationsParams | void>({
            query: (params) => ({
                url: '/applications/my-applications',
                params: params || {},
            }),
            providesTags: ['UserApplications'],
        }),
        checkApplied: builder.query<{ applied: boolean; application: IApplicationResponse | null }, { vacancy_id: string }>({
            query: ({ vacancy_id }) => ({
                url: '/applications/check-applied',
                params: { vacancy_id },
            }),
            transformResponse: (res: ISingleResponse<{ applied: boolean; application: IApplicationResponse | null }>) => res.data,
            providesTags: ['Applications'],
        }),
        getApplicationDetails: builder.query<IApplicationResponse, string>({
            query: (id) => ({
                url: `/applications/${id}`,
            }),
            transformResponse: (res: ISingleResponse<IApplicationResponse>) => res.data,
            providesTags: (_result, _error, id) => [{ type: 'ApplicationDetails', id }],
        }),
        shortlistApplication: builder.mutation<IApplicationResponse, { id: string; body: IApplicationShortlistUpdate }>({
            query: ({ id, body }) => ({
                url: `/applications/${id}/shortlist`,
                method: 'PUT',
                body,
            }),
            transformResponse: (res: ISingleResponse<IApplicationResponse>) => res.data,
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
            transformResponse: (res: ISingleResponse<IApplicationResponse>) => res.data,
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
            transformResponse: (res: ISingleResponse<IApplicationResponse>) => res.data,
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
    useCheckAppliedQuery,
    useLazyCheckAppliedQuery,
} = applicationsApi;
