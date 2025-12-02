import { AuthDAO } from '../dao/AuthDAO';
import { Session, User } from '@supabase/supabase-js';

export class AuthController {
    private authDAO: AuthDAO;

    constructor() {
        this.authDAO = new AuthDAO();
    }

    public async getCurrentUser(): Promise<User | null> {
        const { user } = await this.authDAO.getSession();
        return user;
    }

    public onAuthStateChange(callback: (session: Session | null) => void) {
        return this.authDAO.onAuthStateChange(callback);
    }

    public async logout() {
        await this.authDAO.signOut();
    }

    public async signInWithPassword(email: string, password: string) {
        const { data, error } = await this.authDAO.signInWithPassword(email, password);
        return { user: data.user, error };
    }

    public async signUp(email: string, password: string, name: string) {
        const { data, error } = await this.authDAO.signUp(email, password, { full_name: name });
        return { user: data.user, error };
    }
}
