import { supabase } from '../config/supabase';
import type {
    UserType,
    UserProfile,
    ProfessionalProfile,
    InstituteProfile
} from '../types/auth';

let currentProfilePromise: Promise<UserProfile | null> | null = null;

export const authService = {
    /**
     * Sign up as a Healthcare Professional
     */
    async signUpAsProfessional(
        email: string,
        password: string,
        fullName: string,
        specialty: string
    ): Promise<{ user: UserProfile | null; error: any }> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_type: 'professional' as UserType,
                    full_name: fullName,
                    specialty: specialty,
                },
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });

        if (error) return { user: null, error };

        if (data.user) {
            const profileData = {
                id: data.user.id,
                email: data.user.email || email,
                user_type: 'professional',
                full_name: fullName,
                specialty: specialty,
                has_onboarded: false,
            };

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .upsert([profileData])
                .select()
                .single();

            if (profileError) {
                return { user: null, error: profileError };
            }

            return { user: profile as ProfessionalProfile, error: null };
        }

        return { user: null, error: new Error('Signup failed') };
    },

    /**
     * Sign up as a Healthcare Institution
     */
    async signUpAsInstitute(
        email: string,
        password: string,
        facilityName: string
    ): Promise<{ user: UserProfile | null; error: any }> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_type: 'institute' as UserType,
                    facility_name: facilityName,
                },
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });

        if (error) return { user: null, error };

        if (data.user) {
            const profileData = {
                id: data.user.id,
                email: data.user.email || email,
                user_type: 'institute',
                facility_name: facilityName,
                has_onboarded: false,
            };

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .upsert([profileData])
                .select()
                .single();

            if (profileError) {
                return { user: null, error: profileError };
            }

            return { user: profile as InstituteProfile, error: null };
        }

        return { user: null, error: new Error('Signup failed') };
    },

    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error: any }> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { user: null, error };

        if (data.user) {
            // Fetch profile directly — we already have the user ID from the
            // sign-in response, so there's no need to call getSession again.
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                return { user: null, error: profileError };
            }

            return { user: profile as UserProfile, error: null };
        }

        return { user: null, error: new Error('Login failed') };
    },

    /**
     * Sign out
     */
    async signOut(): Promise<{ error: any }> {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    /**
     * Get current user profile from session
     */
    async getCurrentProfile(): Promise<UserProfile | null> {
        if (currentProfilePromise) {
            return currentProfilePromise;
        }

        currentProfilePromise = (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session?.user) return null;

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error || !profile) {
                    return null;
                }

                return profile as UserProfile;
            } finally {
                currentProfilePromise = null;
            }
        })();

        return currentProfilePromise;
    }
};
