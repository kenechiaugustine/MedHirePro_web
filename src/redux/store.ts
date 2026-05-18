import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/authApi';
import { userApi } from './apis/userApi';
import { creditsApi } from './apis/creditsApi';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [creditsApi.reducerPath]: creditsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userApi.middleware)
            .concat(creditsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;