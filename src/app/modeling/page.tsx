"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Trash2, Sigma, Table2, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useProject, Variable, ProblemData } from '@/context/project-context';

// Inline mock generator if not present in lib
const generateMock = (variables: Variable[], problemData: ProblemData) => {
    const zValue = Math.floor(Math.random() * 5000) + 1000;
    const varResults = variables.map(v => ({
        id: `x${v.id}`,
        name: v.name,
        value: Math.floor(Math.random() * 50)
    }));
    return {
        status: "Otimizado (Simulação)",
        isMock: true,
        zValue,
        variables: varResults,
        shadowPrices: [10, 0],
        iterations: [],
        problemData
    };
};

export default function ModelingScreen() {
    const router = useRouter();
    const { variables, problemData, setProblemData, setResults } = useProject();
    const [isSolving, setIsSolving] = useState(false);

    const updateObjective = (index: number, val: string) => {
        const newObj = [...problemData.objective];
        newObj[index] = val;
        setProblemData({ ...problemData, objective: newObj });
    };

    const addConstraint = () => {
        const newConstraints = [...problemData.constraints, { coeffs: Array(variables.length).fill(''), sign: '<=', rhs: '' }];
        setProblemData({ ...problemData, constraints: newConstraints });
    };

    const removeConstraint = (index: number) => {
        if (problemData.constraints.length <= 1) return;
        const newConstraints = problemData.constraints.filter((_, i) => i !== index);
        setProblemData({ ...problemData, constraints: newConstraints });
    };

    const addZConstraint = () => {
        const newConstraint = {
            coeffs: [...problemData.objective],
            sign: '>=',
            rhs: ''
        };
        setProblemData({ ...problemData, constraints: [...problemData.constraints, newConstraint] });
    };

    const updateConstraint = (cIndex: number, field: string, val: any, vIndex?: number) => {
        const newConstraints = [...problemData.constraints];
        if (field === 'coeff' && typeof vIndex === 'number') {
            newConstraints[cIndex].coeffs[vIndex] = val;
        } else {
            // @ts-ignore
            newConstraints[cIndex][field] = val;
        }
        setProblemData({ ...problemData, constraints: newConstraints });
    };

    const handleSolve = async () => {
        setIsSolving(true);
        const payload = {
            optimizationType: problemData.type === 'MAX' ? 'maximizar' : 'minimizar',
            variables: variables.map(v => v.name),
            objectiveFunction: problemData.objective.map(Number),
            constraints: problemData.constraints.map(c => ({ coeffs: c.coeffs.map(Number), sign: c.sign, value: Number(c.rhs) }))
        };

        try {
            const response = await fetch('/api/solve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error("API offline");
            const data = await response.json();
            setResults({ ...data, problemData });
            router.push('/execucao');
        } catch (error) {
            console.warn("Backend offline. Ativando modo simulação.", error);
            const mockData = generateMock(variables, problemData);
            setResults(mockData);
            router.push('/execucao');
        } finally {
            setIsSolving(false);
        }
    };

    const isValid = problemData.objective.every(v => v !== '') &&
        problemData.constraints.every(c => c.coeffs.every(co => co !== '') && c.rhs !== '');

    return (
        <div className="container mx-auto py-12 px-6">
            <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.push('/setup')} className="gap-2">
                            <ChevronRight className="rotate-180" size={20} /> Voltar
                        </Button>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900">Modelagem Matemática</h2>
                            <p className="text-slate-500 text-lg">Construa as equações do modelo.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                        <button onClick={() => setProblemData({ ...problemData, type: 'MAX' })} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${problemData.type === 'MAX' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>MAXIMIZAR</button>
                        <button onClick={() => setProblemData({ ...problemData, type: 'MIN' })} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${problemData.type === 'MIN' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>MINIMIZAR</button>
                    </div>
                </div>
                <Card className="mb-8 border-l-8 border-l-blue-600 shadow-lg">
                    <CardContent className="pt-8 pb-8">
                        <h3 className="text-sm font-extrabold text-blue-800 mb-6 uppercase tracking-widest flex items-center gap-2"><Sigma size={18} /> Função Objetivo (Z)</h3>
                        <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <span className="text-3xl font-serif italic text-slate-800 font-bold mr-4">Z =</span>
                            {variables.map((variable: Variable, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Input type="number" value={problemData.objective[i] || ''} onChange={(e: any) => updateObjective(i, e.target.value)} placeholder="0" className="w-28 text-center text-xl font-bold h-12 border-blue-200 focus:border-blue-500" />
                                    <div className="flex flex-col"><span className="font-bold text-slate-900 text-lg">{variable.name}</span></div>
                                    {i < variables.length - 1 && <span className="text-slate-400 font-bold text-2xl mx-2">+</span>}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button size="sm" variant="outline" onClick={addZConstraint} className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50" title="Adiciona uma restrição baseada na função objetivo (ex: Z >= 100)">
                                <Plus size={14} /> Adicionar Limite em Z
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-8 border-l-emerald-500 shadow-lg">
                    <CardContent className="pt-8 pb-8">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-2"><Table2 size={18} /> Restrições</h3>
                            <Button size="sm" variant="secondary" onClick={addConstraint} className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"><Plus size={14} /> Adicionar Restrição</Button>
                        </div>
                        <div className="space-y-4">
                            {problemData.constraints.map((constraint: any, rIndex: number) => (
                                <div key={rIndex} className="flex items-center gap-3 p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors shadow-sm">
                                    <span className="font-mono text-xs font-bold text-slate-400 w-8">R{rIndex + 1}</span>
                                    {variables.map((variable: Variable, vIndex: number) => (
                                        <div key={vIndex} className="flex items-center gap-2">
                                            <Input type="number" className="w-24 text-center h-10 font-medium" placeholder="0" value={constraint.coeffs[vIndex] || ''} onChange={(e: any) => updateConstraint(rIndex, 'coeff', e.target.value, vIndex)} />
                                            <span className="text-sm font-bold text-slate-700">{variable.name}</span>
                                            {vIndex < variables.length - 1 && <span className="text-slate-300 font-bold mx-1">+</span>}
                                        </div>
                                    ))}
                                    <div className="w-px h-8 bg-slate-200 mx-4" />
                                    <select className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-lg font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" value={constraint.sign} onChange={(e) => updateConstraint(rIndex, 'sign', e.target.value)}>
                                        <option value="<=">≤</option>
                                        <option value=">=">≥</option>
                                        <option value="=">=</option>
                                    </select>
                                    <Input type="number" className="w-28 h-10 font-bold text-emerald-800 bg-emerald-50 border-emerald-200 text-lg" placeholder="RHS" value={constraint.rhs} onChange={(e: any) => updateConstraint(rIndex, 'rhs', e.target.value)} />
                                    {problemData.constraints.length > 1 && (
                                        <button onClick={() => removeConstraint(rIndex)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Remover restrição">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-10 flex justify-end">
                    <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-blue-900/30 hover:scale-105 transition-transform" onClick={handleSolve} disabled={isSolving || !isValid}>
                        {isSolving ? <Loader2 className="animate-spin mr-2" /> : <Play size={20} fill="currentColor" />}
                        {isSolving ? 'CALCULAR SOLUÇÃO ÓTIMA' : 'CALCULAR SOLUÇÃO ÓTIMA'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
