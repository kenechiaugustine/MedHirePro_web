import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = !supabaseUrl || 
                      supabaseUrl.includes('placeholder') || 
                      supabaseUrl === 'your_supabase_url_here';

if (isPlaceholder) {
    console.warn(
        'Using Mock Supabase Client. To use a real Supabase instance, please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
}

// Mock implementation for testing
const mockSupabase = {
    auth: {
        signUp: async ({ email, password, options }: any) => {
            console.log('Mock SignUp:', email, password ? '***' : 'none', options);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockUser = {
                id: 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
                email,
                user_metadata: options?.data || {},
                created_at: new Date().toISOString()
            };
            
            // Store in localStorage to simulate DB
            const users = JSON.parse(localStorage.getItem('mock_supabase_users') || '[]');
            users.push(mockUser);
            localStorage.setItem('mock_supabase_users', JSON.stringify(users));
            
            return { data: { user: mockUser }, error: null };
        },
        signInWithPassword: async ({ email, password }: any) => {
            console.log('Mock SignIn:', email, password ? '***' : 'none');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('mock_supabase_users') || '[]');
            const user = users.find((u: any) => u.email === email);
            
            if (user) {
                return { data: { user }, error: null };
            }
            return { data: { user: null }, error: new Error('Invalid login credentials') };
        },
        signOut: async () => {
            console.log('Mock SignOut');
            return { error: null };
        },
        getSession: async () => {
            const users = JSON.parse(localStorage.getItem('mock_supabase_users') || '[]');
            // For simplicity, assume the first user is the current session if any exists
            if (users.length > 0) {
                return { data: { session: { user: users[0] } }, error: null };
            }
            return { data: { session: null }, error: null };
        },
        onAuthStateChange: (callback: any) => {
            console.log('Mock onAuthStateChange subscribed');
            // Trigger callback with initial session if exists
            const users = JSON.parse(localStorage.getItem('mock_supabase_users') || '[]');
            if (users.length > 0) {
                callback('SIGNED_IN', { user: users[0] });
            } else {
                callback('SIGNED_OUT', null);
            }
            
            return {
                data: {
                    subscription: {
                        unsubscribe: () => console.log('Mock onAuthStateChange unsubscribed')
                    }
                }
            };
        }
    }
};

export const supabase = isPlaceholder 
    ? (mockSupabase as any) 
    : createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
