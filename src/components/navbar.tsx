"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component or I'll use the one from page.tsx logic
import { AuthController } from '@/controllers/AuthController';
import { User } from '@supabase/supabase-js';

// Temporary Button component if not imported from UI lib, 
// but based on previous files, there is a src/components/ui/button.tsx.
// I will assume standard usage or copy the style if needed. 
// Let's check imports in page.tsx again. It had a custom Button definition.
// I should probably use the one in src/components/ui/button.tsx if it exists, or define it here.
// Given the file view earlier, src/components/ui/button.tsx exists.

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const authController = new AuthController();

    useEffect(() => {
        const getUser = async () => {
            const user = await authController.getCurrentUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = authController.onAuthStateChange((session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await authController.logout();
        setUser(null);
        router.push('/');
    };

    const isHome = pathname === '/';
    const isAuthPage = pathname === '/login' || pathname === '/register';

    // Logic to determine breadcrumbs or steps
    const getStepStyle = (path: string) => {
        return pathname === path ? 'font-bold text-slate-900' : '';
    };

    const showSteps = !isHome && !isAuthPage && pathname !== '/menu' && pathname !== '/linear';

    const hideNavbarPaths = ['/', '/login', '/register', '/linear', '/setup', '/modeling', '/execucao'];

    if (hideNavbarPaths.includes(pathname)) return null;

    return (
        <header className="bg-white border-b h-20 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                <div className="relative w-32 h-10 drop-shadow-md">
                    <img src="/logo-vector.png" alt="Vector" className="w-full h-full object-contain object-left" />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {showSteps && (
                    <div className="hidden md:flex items-center gap-4 text-sm text-slate-400 font-medium mr-4">
                        <Link href="/setup" className={getStepStyle('/setup')}>Variáveis</Link>
                        <ChevronRight size={14} />
                        <Link href="/modeling" className={getStepStyle('/modeling')}>Modelagem</Link>
                        <ChevronRight size={14} />
                        <Link href="/execucao" className={getStepStyle('/execucao')}>Resultados</Link>
                    </div>
                )}

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                <UserIcon size={16} />
                            </div>
                            <span className="hidden sm:inline">{user.user_metadata?.full_name || user.email}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700" title="Sair">
                            <LogOut size={18} />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Entrar</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Criar Conta</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
