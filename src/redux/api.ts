import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { clearTokenItem, getTokenItem, setTokenItem, TOKEN_KEY } from '../lib/utils/helpers';
import { generateQueryString } from '../lib/utils/queryKey';
import { WEBSITE_ROUTES } from '../pages/website/routes.enum';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mutex = new Mutex();

interface IRefreshTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_role: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    timeout: 100000,
    prepareHeaders: async (headers) => {
        const token = await getTokenItem(TOKEN_KEY.AUTH_TOKEN);
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    const url = typeof args === 'string' ? args : args.url;
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/admin/login');

    if (result.error && result.error.status === 401 && !isAuthRequest) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refresh_token = await getTokenItem(TOKEN_KEY.REFRESH_TOKEN);

                if (refresh_token) {
                    const refreshQuery = fetchBaseQuery({
                        baseUrl: BASE_URL,
                        prepareHeaders: (headers) => {
                            // headers.set('authorization', `Bearer ${refresh_token}`);
                            // headers.set('x-api-key', API_KEY);
                            return headers;
                        },
                    });

                    const refreshResult = await refreshQuery(
                        {
                            url: `/auth/refresh-token?${generateQueryString({ refresh_token })}`,
                            method: 'POST',
                        },
                        api,
                        extraOptions,
                    );

                    if (refreshResult.data) {
                        const { access_token, refresh_token, user_role } = refreshResult.data as IRefreshTokenResponse;
                        await setTokenItem(TOKEN_KEY.AUTH_TOKEN, access_token);
                        await setTokenItem(TOKEN_KEY.REFRESH_TOKEN, refresh_token);
                        if (user_role) {
                            await setTokenItem(TOKEN_KEY.USER_ROLE, user_role);
                        }
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        await clearTokenItem(TOKEN_KEY.AUTH_TOKEN);
                        await clearTokenItem(TOKEN_KEY.REFRESH_TOKEN);
                        await clearTokenItem(TOKEN_KEY.USER_ROLE);
                        window.location.href = WEBSITE_ROUTES.LOGIN;
                    }
                } else {
                    await clearTokenItem(TOKEN_KEY.AUTH_TOKEN);
                    await clearTokenItem(TOKEN_KEY.REFRESH_TOKEN);
                    await clearTokenItem(TOKEN_KEY.USER_ROLE);
                    window.location.href = WEBSITE_ROUTES.LOGIN;
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};
