import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserRole } from '../apis/userApi/interface';

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userRole: UserRole | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('authToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userRole: (localStorage.getItem('userRole') as UserRole) || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                access_token: string;
                refresh_token: string;
                user_role: string;
            }>
        ) => {
            const { access_token, refresh_token, user_role } = action.payload;
            state.accessToken = access_token;
            state.refreshToken = refresh_token;
            state.userRole = user_role as UserRole;
            state.isAuthenticated = true;

            localStorage.setItem('authToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('userRole', user_role);
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.userRole = null;
            state.isAuthenticated = false;

            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
