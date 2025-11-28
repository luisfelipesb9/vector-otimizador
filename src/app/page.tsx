"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Upload, Book, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseToraFile } from '@/lib/file_parser';
import { useProject } from '@/context/project-context';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function HomeScreen() {
  const router = useRouter();
  const { setVariables, setProblemData } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseToraFile(text);

      // Load data into context
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="text-center space-y-8 max-w-2xl px-4">
        <div className="w-64 mx-auto mb-8"><img src="/logo-vector.png" alt="Vector" className="w-full" /></div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Otimização Linear Avançada</h1>
        <p className="text-xl text-slate-500">Resolva problemas de programação linear, inteira e sistemas de equações com precisão e facilidade.</p>

        {!user ? (
          <div className="flex flex-col gap-4 pt-8 max-w-sm mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full h-12 text-base" onClick={() => router.push('/login')}>
                <LogIn size={18} /> Entrar
              </Button>
              <Button variant="secondary" size="lg" className="w-full h-12 text-base" onClick={() => router.push('/register')}>
                <UserPlus size={18} /> Criar Conta
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg shadow-xl shadow-blue-900/20" onClick={() => router.push('/menu')}>
              <Plus size={20} /> Novo Projeto
            </Button>
            <div className="relative">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.json" />
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={() => fileInputRef.current?.click()}>
                <Upload size={20} /> Carregar Arquivo
              </Button>
            </div>
            <a href="/docs">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg text-slate-500 hover:text-blue-600">
                <Book size={20} /> Documentação
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}