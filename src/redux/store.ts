import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { authApi } from './apis/authApi';
import { userApi } from './apis/userApi';
import { creditsApi } from './apis/creditsApi';
import authReducer, { logout } from './slices/authSlice';

const logoutMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    if (logout.match(action)) {
        storeAPI.dispatch(userApi.util.resetApiState());
        storeAPI.dispatch(authApi.util.resetApiState());
        storeAPI.dispatch(creditsApi.util.resetApiState());
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [creditsApi.reducerPath]: creditsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userApi.middleware)
            .concat(creditsApi.middleware)
            .concat(logoutMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;