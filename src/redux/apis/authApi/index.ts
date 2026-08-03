import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import { generateQueryString } from '../../../lib/utils/queryKey';
import type { ISingleResponse } from '../../types';
import type {
    IAuthenticateWithGoogleArgs,
    IAuthenticationResponse,
    IChangePasswordArgs,
    ILoginWithEmailArgs,
    IRegisterProfessionalArgs,
    IRegisterInstituteArgs,
} from './interface';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        registerProfessional: builder.mutation<IAuthenticationResponse, IRegisterProfessionalArgs>({
            query: body => ({
                url: '/auth/register/professional',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IAuthenticationResponse>) => res.data,
        }),
        registerInstitute: builder.mutation<IAuthenticationResponse, IRegisterInstituteArgs>({
            query: body => ({
                url: '/auth/register/institute',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IAuthenticationResponse>) => res.data,
        }),
        loginWithEmail: builder.mutation<IAuthenticationResponse, ILoginWithEmailArgs>({
            query: body => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IAuthenticationResponse>) => res.data,
        }),
        adminLogin: builder.mutation<IAuthenticationResponse, ILoginWithEmailArgs>({
            query: body => ({
                url: '/auth/admin/login',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IAuthenticationResponse>) => res.data,
        }),
        changePassword: builder.mutation<{ message: string }, IChangePasswordArgs>({
            query: body => ({
                url: '/auth/change-password',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<{ message: string }>) => res.data,
        }),
        loginWithGoogle: builder.mutation<IAuthenticationResponse, IAuthenticateWithGoogleArgs>({
            query: body => ({
                url: '/auth/authenticate-with-google',
                method: 'POST',
                body,
            }),
            transformResponse: (res: ISingleResponse<IAuthenticationResponse>) => res.data,
        }),
        refreshToken: builder.mutation<IAuthenticationResponse, { refresh_token: string }>({
            query: ({ refresh_token }) => ({
                url: `/auth/refresh-token?${generateQueryString({ refresh_token })}`,
                method: 'POST',
            }),
            transformResponse: (res: ISingleResponse<IAuthenticationResponse>) => res.data,
        }),
    }),
});

export const {
    useRegisterProfessionalMutation,
    useRegisterInstituteMutation,
    useLoginWithEmailMutation,
    useAdminLoginMutation,
    useLoginWithGoogleMutation,
    useRefreshTokenMutation,
    useChangePasswordMutation,
} = authApi;
