"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProject, Variable } from '@/context/project-context';

export default function VariableSetup() {
    const router = useRouter();
    const { variables, setVariables, setProblemData } = useProject();

    const addVar = () => {
        const id = variables.length + 1;
        setVariables([...variables, { id, name: `x${id}`, description: '' }]);
    };

    const removeVar = (index: number) => {
        if (variables.length <= 2) return;
        const newVars = variables.filter((_: any, i: number) => i !== index);
        setVariables(newVars);
    };

    const updateVar = (index: number, field: string, value: string) => {
        const newVars = [...variables];
        // @ts-ignore
        newVars[index] = { ...newVars[index], [field]: value };
        setVariables(newVars);
    };

    const handleNext = () => {
        // Initialize problem data structure if needed when variables change size
        // We do this to ensure the arrays in problemData match the new variable count
        setProblemData(prev => ({
            ...prev,
            objective: Array(variables.length).fill(''),
            constraints: prev.constraints.map(c => ({
                ...c,
                coeffs: Array(variables.length).fill('')
            }))
        }));
        router.push('/modeling');
    };

    const isValid = variables.every(v => v.name.trim().length > 0);

    return (
        <div className="container mx-auto py-12 px-6">
            <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.push('/menu')} className="gap-2">
                            <ChevronRight className="rotate-180" size={20} /> Voltar
                        </Button>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900">Definição de Variáveis</h2>
                            <p className="text-slate-500 text-lg">Identifique as variáveis de decisão.</p>
                        </div>
                    </div>
                </div>
                <Card className="border-slate-300 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between bg-slate-50/80">
                        <CardTitle>Variáveis de Decisão</CardTitle>
                        <Button onClick={addVar} size="sm" variant="secondary"><Plus size={16} /> Adicionar</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {variables.map((variable: Variable, index: number) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 group hover:border-blue-300 transition-colors shadow-sm">
                                <div className="w-10 h-10 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center font-mono text-sm font-bold text-slate-500">x{index + 1}</div>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nome</label>
                                        <Input value={variable.name} onChange={(e: any) => updateVar(index, 'name', e.target.value)} placeholder={`Ex: Mesas`} className="font-bold text-slate-800 border-slate-300" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Descrição</label>
                                        <Input value={variable.description} onChange={(e: any) => updateVar(index, 'description', e.target.value)} placeholder="Opcional..." />
                                    </div>
                                </div>
                                {variables.length > 2 && (
                                    <button onClick={() => removeVar(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <div className="flex justify-end mt-8">
                    <Button size="lg" onClick={handleNext} disabled={!isValid} className="shadow-xl shadow-blue-900/20">Continuar <ChevronRight size={18} /></Button>
                </div>
            </div>
        </div>
    );
}
