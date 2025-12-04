"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  TrendingUp,
  Maximize2,
  Activity,
  Menu,
  X,
  CheckCircle2,
  Users,
  Lightbulb,
  LogIn,
  UserPlus,
  Layout,
  BookOpen,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectController } from '@/controllers/ProjectController';
import { AuthController } from '@/controllers/AuthController';
import { useProject } from '@/context/project-context';
import { User } from '@supabase/supabase-js';

export default function HomeScreen() {
  const router = useRouter();
  const { setVariables, setProblemData } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authController = new AuthController();

  // Lógica de Autenticação via Controller
  useEffect(() => {
    const checkUser = async () => {
      const user = await authController.getCurrentUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = authController.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lógica de Upload via Controller
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      router.push('/login');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = ProjectController.parseFile(text);
      const newVars = Array(parsed.numVars).fill(0).map((_, i) => ({ id: i + 1, name: `x${i + 1}`, description: '' }));
      setVariables(newVars);
      setProblemData({
        type: parsed.type,
        objective: parsed.objective.map(String),
        constraints: parsed.constraints.map((c: any) => ({ coeffs: c.coeffs.map(String), sign: c.sign, rhs: String(c.rhs) }))
      });
      router.push('/modeling');
    } catch (err) {
      alert("Erro ao ler arquivo.");
    }
  };

  // Função para rolar suavemente até as seções
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">

      {/* --- HEADER (NAVBAR) --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">

          {/* Esquerda: Logo e Marca */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              <img src="/logo-vector.png" alt="Vector" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Vector</span>
          </div>

          {/* Centro: Navegação das Seções (Scroll) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
            <button onClick={() => scrollToSection('hero')} className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all">
              Início
            </button>
            <button onClick={() => scrollToSection('features')} className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all">
              Recursos
            </button>
            <button onClick={() => scrollToSection('about')} className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all">
              Sobre Nós
            </button>
          </nav>

          {/* Direita: Botões de Acesso */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Button variant="ghost" onClick={() => router.push('/login')} className="text-slate-600 hover:text-slate-900 font-medium text-base">
                  Entrar no sistema
                </Button>
                <Button variant="default" onClick={() => router.push('/register')} className="bg-slate-900 text-white hover:bg-slate-800 shadow-md rounded-lg px-6 font-medium">
                  Criar uma conta
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => router.push('/menu')} className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg px-6 shadow-md">
                Ir para o Painel
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4 shadow-lg absolute w-full left-0 z-50">
            <div className="flex flex-col space-y-2">
              <button onClick={() => scrollToSection('hero')} className="text-left px-4 py-3 hover:bg-slate-50 rounded-lg font-medium text-slate-700">Início</button>
              <button onClick={() => scrollToSection('features')} className="text-left px-4 py-3 hover:bg-slate-50 rounded-lg font-medium text-slate-700">Recursos</button>
              <button onClick={() => scrollToSection('about')} className="text-left px-4 py-3 hover:bg-slate-50 rounded-lg font-medium text-slate-700">Sobre Nós</button>
              <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-3">
                {!user ? (
                  <>
                    <Button variant="secondary" className="w-full justify-center h-12" onClick={() => router.push('/login')}>Entrar</Button>
                    <Button className="w-full justify-center bg-slate-900 text-white h-12" onClick={() => router.push('/register')}>Criar Conta</Button>
                  </>
                ) : (
                  <Button className="w-full justify-center bg-emerald-600 text-white h-12" onClick={() => router.push('/menu')}>Ir para o Painel</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* --- 1ª SEÇÃO: APRESENTAÇÃO (HERO) --- */}
        <section id="hero" className="relative pt-20 pb-28 overflow-hidden bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

              {/* Texto (Lado Esquerdo) */}
              <div className="flex-1 text-center lg:text-left z-10">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                  Ensine e aprenda <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    Otimização Linear
                  </span>
                </h1>

                <p className="text-xl text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                  Vector é mais do que uma calculadora. É uma plataforma completa para modelar, resolver e visualizar problemas de Pesquisa Operacional, conectando teoria e prática.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.json"
                  />
                  <Button
                    className="h-14 px-8 text-lg rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                    onClick={() => router.push(!user ? '/login' : '/menu')}
                  >
                    {!user ? 'Iniciar Calculadora' : 'Acessar Painel'}
                  </Button>

                  <Button
                    variant="secondary"
                    className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:border-emerald-200 text-slate-600 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                    onClick={() => scrollToSection('features')}
                  >
                    Ver Recursos
                  </Button>

                  <Button
                    variant="outline"
                    className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                    onClick={() => {
                      if (!user) {
                        router.push('/login');
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    Carregar Arquivo
                  </Button>
                </div>
              </div>

              {/* Imagem (Lado Direito) */}
              <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
                {/* Efeito de fundo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-emerald-50/50 rounded-full blur-3xl -z-10"></div>

                {/* Card Ilustrativo (Representando o Sistema) */}
                <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full max-w-md">
                  <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                    {/* Grid no fundo do card */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>

                    {/* Logo Central */}
                    <div className="flex flex-col items-center relative z-10">
                      <img
                        src="/logo-vector.png"
                        alt="Interface Vector"
                        className="w-32 h-32 object-contain drop-shadow-xl mb-4"
                      />
                      <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-600 border border-slate-100">
                        Otimização Simplex
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- 2ª SEÇÃO: O QUE OFERECEMOS --- */}
        <section id="features" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-3 block">Funcionalidades</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Ferramentas Poderosas</h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Tudo o que você precisa para resolver problemas de otimização em um só lugar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Método Simplex</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Resolução passo-a-passo com identificação visual de pivôs e variáveis básicas. Ideal para conferência de cálculos e aprendizado.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6">
                  <Maximize2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Visualização Gráfica</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Entenda a geometria da otimização. O sistema plota as restrições, a região viável e destaca o ponto ótimo visualmente para problemas 2D.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-6">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Análise de Sensibilidade</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Descubra os preços sombra, intervalos de otimalidade e analise automaticamente o problema Dual correspondente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3ª SEÇÃO: SOBRE NÓS --- */}
        <section id="about" className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Ícone/Imagem Grande */}
              <div className="flex-1 flex justify-center lg:justify-end order-2 lg:order-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src="/team.jpg"
                      alt="Equipe Vector"
                      className="w-full max-w-md object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Texto */}
              <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <Lightbulb size={14} /> Projeto Acadêmico
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Sobre o Projeto Vector</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  O <strong>Vector</strong> nasceu de uma iniciativa acadêmica para preencher a lacuna entre a teoria complexa da Pesquisa Operacional e a prática intuitiva.
                </p>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Nossa missão é fornecer ferramentas gratuitas e de alta qualidade que ajudem estudantes e professores a visualizar conceitos matemáticos abstratos.
                </p>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <span className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Open Source
                  </span>
                  <span className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Gratuito
                  </span>
                  <span className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Feito por Estudantes
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-bold">V</div>
              <span className="font-bold text-white text-lg">Vector</span>
            </div>

            <div className="text-sm">
              © 2025 Vector Project. Desenvolvido para Pesquisa Operacional.
            </div>

            <div className="flex gap-6 text-sm font-medium">
              <a href="https://github.com/luisfelipesb9/vector-otimizador" className="hover:text-white transition-colors">Github</a>
              <a href="/docs" className="hover:text-white transition-colors">Documentação</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}