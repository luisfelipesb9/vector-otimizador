import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseClientDAO {
    private static instance: SupabaseClient;

    private constructor() { }

    public static getInstance(): SupabaseClient {
        if (!SupabaseClientDAO.instance) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                console.warn('Supabase URL or Anon Key is missing. Database features will not work.');
            }

            SupabaseClientDAO.instance = createClient(
                supabaseUrl || '',
                supabaseAnonKey || ''
            );
        }
        return SupabaseClientDAO.instance;
    }
}
