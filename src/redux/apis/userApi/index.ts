import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import type { IUser, IUpdateProfileRequest } from './interface';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        getMe: builder.query<IUser, void>({
            query: () => '/user/me',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<IUser, IUpdateProfileRequest>({
            query: (body) => ({
                url: '/user/update-profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),
        deleteMe: builder.mutation<void, void>({
            query: () => ({
                url: '/user/me',
                method: 'DELETE',
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateProfileMutation,
    useDeleteMeMutation,
} = userApi;