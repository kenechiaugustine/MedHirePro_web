import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IUser } from '../userApi/interface';
import type { ICreditTransaction } from '../creditsApi/interface';
import type {
    IAdminUsersParams,
    IAdminUserCreditsParams,
    IAdminUserReferralsParams,
    IReassignJobRequest,
    IAdminReassignJobResponse,
    IAdminUserUpdateRequest,
} from './interface';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['AdminUsers', 'AdminUserCredits', 'AdminUserReferrals'],
    endpoints: (builder) => ({
        readAllUsers: builder.query<IUser[], IAdminUsersParams | void>({
            query: (params) => ({
                url: '/admin/users',
                method: 'GET',
                params: params || {},
            }),
            providesTags: ['AdminUsers'],
        }),
        readUserCreditsHistory: builder.query<ICreditTransaction[], IAdminUserCreditsParams>({
            query: ({ user_id, ...params }) => ({
                url: `/admin/users/${user_id}/credits`,
                method: 'GET',
                params,
            }),
            providesTags: (_result, _error, { user_id }) => [
                { type: 'AdminUserCredits', id: user_id },
                'AdminUserCredits',
            ],
        }),
        readUserReferrals: builder.query<IUser[], IAdminUserReferralsParams>({
            query: ({ user_id, ...params }) => ({
                url: `/admin/users/${user_id}/referrals`,
                method: 'GET',
                params,
            }),
            providesTags: (_result, _error, { user_id }) => [
                { type: 'AdminUserReferrals', id: user_id },
                'AdminUserReferrals',
            ],
        }),
        adminReassignJobOwner: builder.mutation<IAdminReassignJobResponse, IReassignJobRequest>({
            query: ({ vacancy_id, new_owner_id, job_type }) => ({
                url: `/admin/jobs/${vacancy_id}/reassign`,
                method: 'PUT',
                body: { new_owner_id, job_type },
            }),
            invalidatesTags: ['AdminUsers'],
        }),
        readUserById: builder.query<IUser, string>({
            query: (user_id) => ({
                url: `/admin/users/${user_id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, user_id) => [{ type: 'AdminUsers', id: user_id }, 'AdminUsers'],
        }),
        adminUpdateUserDetails: builder.mutation<IUser, IAdminUserUpdateRequest>({
            query: ({ user_id, payload }) => ({
                url: `/admin/users/${user_id}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: (_result, _error, { user_id }) => [
                { type: 'AdminUsers', id: user_id },
                'AdminUsers',
            ],
        }),
    }),
});

export const {
    useReadAllUsersQuery,
    useLazyReadAllUsersQuery,
    useReadUserCreditsHistoryQuery,
    useLazyReadUserCreditsHistoryQuery,
    useReadUserReferralsQuery,
    useLazyReadUserReferralsQuery,
    useAdminReassignJobOwnerMutation,
    useReadUserByIdQuery,
    useLazyReadUserByIdQuery,
    useAdminUpdateUserDetailsMutation,
} = adminApi;
