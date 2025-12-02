'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthController } from '@/controllers/AuthController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const authController = new AuthController();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { user, error } = await authController.signInWithPassword(email, password);

            if (error) throw error;

            if (user) {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

            {/* Background Decorativo (Igual à Home para consistência) */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            {/* Botão Voltar Discreto */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors pl-2"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft size={18} /> Voltar para Home
                </Button>
            </div>

            {/* Área Central de Login */}
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

                {/* Cabeçalho Visual */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 mb-6 transform hover:scale-105 transition-transform duration-300">
                        {/* Se a imagem falhar, use o texto como fallback no seu projeto real */}
                        <img src="/logo-vector.png" alt="Vector" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bem-vindo de volta</h1>
                    <p className="text-slate-500 mt-2">Entre para continuar seus projetos de otimização.</p>
                </div>

                <Card className="border-slate-200 shadow-xl shadow-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="pt-8 px-8">
                        <form onSubmit={handleLogin} className="space-y-5">

                            {error && (
                                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-semibold text-sm ml-1">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Senha</Label>
                                    <Link href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all rounded-xl mt-2 font-bold tracking-wide"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Entrando...
                                    </div>
                                ) : (
                                    'Entrar na Plataforma'
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <div className="px-8 pb-8 pt-4">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400 font-medium">Ou continue com</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            Não tem uma conta?{' '}
                            <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors ml-1">
                                Cadastre-se gratuitamente
                            </Link>
                        </div>
                    </div>
                </Card>

                <div className="text-center mt-8 text-xs text-slate-400 font-medium">
                    &copy; 2025 Vector Project. Pesquisa Operacional.
                </div>
            </div>
        </div>
    );
}