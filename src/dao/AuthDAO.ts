import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { SupabaseClientDAO } from './SupabaseClientDAO';

export class AuthDAO {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = SupabaseClientDAO.getInstance();
    }

    public async getSession(): Promise<{ session: Session | null; user: User | null }> {
        const { data: { session } } = await this.supabase.auth.getSession();
        return { session, user: session?.user ?? null };
    }

    public onAuthStateChange(callback: (session: Session | null) => void) {
        return this.supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
    }

    public async signOut(): Promise<void> {
        await this.supabase.auth.signOut();
    }

    public async signInWithPassword(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    public async signUp(email: string, password: string, data?: any) {
        return this.supabase.auth.signUp({
            email,
            password,
            options: {
                data,
            },
        });
    }
}
