import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api';
import { generateQueryString } from '../../../lib/utils/queryKey';
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
        }),
        registerInstitute: builder.mutation<IAuthenticationResponse, IRegisterInstituteArgs>({
            query: body => ({
                url: '/auth/register/institute',
                method: 'POST',
                body,
            }),
        }),
        loginWithEmail: builder.mutation<IAuthenticationResponse, ILoginWithEmailArgs>({
            query: body => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
        adminLogin: builder.mutation<IAuthenticationResponse, ILoginWithEmailArgs>({
            query: body => ({
                url: '/auth/admin/login',
                method: 'POST',
                body,
            }),
        }),
        changePassword: builder.mutation<void, IChangePasswordArgs>({
            query: body => ({
                url: '/auth/change-password',
                method: 'POST',
                body,
            }),
        }),
        loginWithGoogle: builder.mutation<IAuthenticationResponse, IAuthenticateWithGoogleArgs>({
            query: body => ({
                url: '/auth/authenticate-with-google',
                method: 'POST',
                body,
            }),
        }),
        refreshToken: builder.mutation<IAuthenticationResponse, { refresh_token: string }>({
            query: ({ refresh_token }) => ({
                url: `/auth/refresh-token?${generateQueryString({ refresh_token })}`,
                method: 'POST',
            }),
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
