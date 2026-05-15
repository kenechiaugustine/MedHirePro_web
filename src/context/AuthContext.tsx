import React, { createContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/auth.service';
import type { UserProfile } from '../types/auth';
import { supabase } from '../config/supabase';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
    signUpAsProfessional: (email: string, password: string, fullName: string, specialty: string) => Promise<UserProfile>;
    signUpAsInstitute: (email: string, password: string, facilityName: string) => Promise<UserProfile>;
    signIn: (email: string, password: string) => Promise<UserProfile>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Flag to prevent onAuthStateChange from doing redundant profile fetches
    // during explicit sign-in / sign-up / sign-out operations.
    const isExplicitAuthAction = useRef(false);

    // Initialize auth state and listen for changes
    useEffect(() => {
        const initAuth = async () => {
            try {
                const profile = await authService.getCurrentProfile();
                setUser(profile);
            } catch (err: any) {
                console.error('Auth initialization error:', err);
                setError(err.message || 'Failed to initialize auth');
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Subscribe to Supabase auth state changes.
        // This listener only handles background events (e.g. TOKEN_REFRESHED, session
        // restored from another tab). Explicit auth actions set isExplicitAuthAction
        // so the listener skips redundant work.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
            if (isExplicitAuthAction.current) {
                // The explicit handler (signIn / signUp / signOut) already
                // updated the user state — nothing to do here.
                return;
            }

            if (session?.user) {
                try {
                    const profile = await authService.getCurrentProfile();
                    setUser(profile);
                } catch (err) {
                    console.error('Failed to update profile on auth change:', err);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signUpAsProfessional = async (email: string, password: string, fullName: string, specialty: string) => {
        setLoading(true);
        setError(null);
        isExplicitAuthAction.current = true;
        try {
            const { user: newUser, error: err } = await authService.signUpAsProfessional(email, password, fullName, specialty);
            if (err) throw err;
            if (!newUser) throw new Error('Signup failed');
            setUser(newUser);
            return newUser;
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            throw err;
        } finally {
            setLoading(false);
            isExplicitAuthAction.current = false;
        }
    };

    const signUpAsInstitute = async (email: string, password: string, facilityName: string) => {
        setLoading(true);
        setError(null);
        isExplicitAuthAction.current = true;
        try {
            const { user: newUser, error: err } = await authService.signUpAsInstitute(email, password, facilityName);
            if (err) throw err;
            if (!newUser) throw new Error('Signup failed');
            setUser(newUser);
            return newUser;
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            throw err;
        } finally {
            setLoading(false);
            isExplicitAuthAction.current = false;
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        isExplicitAuthAction.current = true;
        try {
            const { user: loggedInUser, error: err } = await authService.signIn(email, password);
            if (err) throw err;
            if (!loggedInUser) throw new Error('Login failed');
            setUser(loggedInUser);
            return loggedInUser;
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
            isExplicitAuthAction.current = false;
        }
    };

    const signOut = async () => {
        isExplicitAuthAction.current = true;
        // Optimistic UI update: instantly clear the user so the UI reflects the logged-out state immediately
        setUser(null);
        try {
            const { error: err } = await authService.signOut();
            if (err) throw err;
        } catch (err: any) {
            setError(err.message || 'Logout failed');
            throw err;
        } finally {
            isExplicitAuthAction.current = false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                signUpAsProfessional,
                signUpAsInstitute,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
