import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { authApi } from './apis/authApi';
import { userApi } from './apis/userApi';
import { creditsApi } from './apis/creditsApi';
import { jobsApi } from './apis/jobsApi';
import { applicationsApi } from './apis/applicationsApi';
import { onboardingApi } from './apis/onboardingApi';
import { mediaApi } from './apis/mediaApi';
import { referralApi } from './apis/referralApi';
import { adminApi } from './apis/adminApi';
import authReducer, { logout } from './slices/authSlice';

const logoutMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    if (logout.match(action)) {
        storeAPI.dispatch(userApi.util.resetApiState());
        storeAPI.dispatch(authApi.util.resetApiState());
        storeAPI.dispatch(creditsApi.util.resetApiState());
        storeAPI.dispatch(jobsApi.util.resetApiState());
        storeAPI.dispatch(applicationsApi.util.resetApiState());
        storeAPI.dispatch(onboardingApi.util.resetApiState());
        storeAPI.dispatch(mediaApi.util.resetApiState());
        storeAPI.dispatch(referralApi.util.resetApiState());
        storeAPI.dispatch(adminApi.util.resetApiState());
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [creditsApi.reducerPath]: creditsApi.reducer,
        [jobsApi.reducerPath]: jobsApi.reducer,
        [applicationsApi.reducerPath]: applicationsApi.reducer,
        [onboardingApi.reducerPath]: onboardingApi.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [referralApi.reducerPath]: referralApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userApi.middleware)
            .concat(creditsApi.middleware)
            .concat(jobsApi.middleware)
            .concat(applicationsApi.middleware)
            .concat(onboardingApi.middleware)
            .concat(mediaApi.middleware)
            .concat(referralApi.middleware)
            .concat(adminApi.middleware)
            .concat(logoutMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;