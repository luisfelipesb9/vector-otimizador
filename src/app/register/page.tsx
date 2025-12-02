'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthController } from '@/controllers/AuthController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const authController = new AuthController();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { user, error } = await authController.signUp(email, password, name);

            if (error) throw error;

            if (user) {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

            {/* Background Decorativo (Consistente com Login/Home) */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            {/* Botão Voltar */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors pl-2"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft size={18} /> Voltar
                </Button>
            </div>

            {/* Card de Registro */}
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 slide-in-from-bottom-4">

                {/* Cabeçalho Visual */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 mb-6 transform hover:scale-105 transition-transform duration-300">
                        {/* Fallback visual com ícone caso a imagem não carregue */}
                        <div className="relative w-10 h-10">
                            <img src="/logo-vector.png" alt="Vector" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Crie sua conta</h1>
                    <p className="text-slate-500 mt-2">Comece a otimizar seus projetos gratuitamente.</p>
                </div>

                <Card className="border-slate-200 shadow-xl shadow-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="pt-8 px-8">
                        <form onSubmit={handleRegister} className="space-y-5">

                            {error && (
                                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700 font-semibold text-sm ml-1">Nome Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu Nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-semibold text-sm ml-1">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-semibold text-sm ml-1">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-12 text-base transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all rounded-xl mt-4 font-bold tracking-wide"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Criando conta...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Cadastrar <UserPlus size={18} />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <div className="px-8 pb-8 pt-4">
                        <div className="text-center text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors ml-1">
                                Fazer Login
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