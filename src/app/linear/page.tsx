"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { solveLinearSystem } from '@/lib/linear_solver';

export default function LinearEqScreen() {
    const router = useRouter();
    const [dimension, setDimension] = useState(3);
    const [matrix, setMatrix] = useState<string[][]>([]);
    const [rhs, setRhs] = useState<string[]>([]);
    const [solution, setSolution] = useState<number[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMatrix(Array(dimension).fill(0).map(() => Array(dimension).fill('')));
        setRhs(Array(dimension).fill(''));
        setSolution(null);
        setError(null);
    }, [dimension]);

    const handleSolve = () => {
        try {
            setError(null);
            if (matrix.some(row => row.some(v => v.trim() === '')) || rhs.some(v => v.trim() === '')) {
                throw new Error("Preencha todos os campos da matriz e do vetor.");
            }
            const numMatrix = matrix.map(row => row.map(Number));
            const numRhs = rhs.map(Number);
            if (numMatrix.some(row => row.some(isNaN)) || numRhs.some(isNaN)) {
                throw new Error("Valores inválidos detectados.");
            }
            const result = solveLinearSystem(numMatrix, numRhs);
            setSolution(result);
        } catch (e: any) {
            setError(e.message);
            setSolution(null);
        }
    };

    const updateMatrix = (r: number, c: number, val: string) => {
        const newM = [...matrix];
        newM[r][c] = val;
        setMatrix(newM);
    };

    const updateRhs = (i: number, val: string) => {
        const newR = [...rhs];
        newR[i] = val;
        setRhs(newR);
    };

    const isValid = !matrix.some(row => row.some(v => v.trim() === '')) && !rhs.some(v => v.trim() === '');

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/menu')} className="gap-2">
                        <ChevronRight className="rotate-180" size={20} /> Voltar
                    </Button>
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Sistemas Lineares</h2>
                        <p className="text-slate-500">Resolução de sistemas Ax = b por Eliminação Gaussiana.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <label className="font-bold text-slate-700">Dimensão (N):</label>
                    <input
                        type="number"
                        min="2" max="10"
                        value={dimension}
                        onChange={(e) => setDimension(parseInt(e.target.value) || 2)}
                        className="w-20 h-10 border rounded-lg text-center font-bold"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <Card className="flex-1 shadow-lg border-blue-100">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                        <CardTitle className="text-blue-900">Matriz A e Vetor b</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <div className="flex items-center gap-4">
                            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${dimension}, minmax(60px, 1fr))` }}>
                                {matrix.map((row, i) => (
                                    row.map((val, j) => (
                                        <Input
                                            key={`${i}-${j}`}
                                            placeholder={`a${i + 1}${j + 1}`}
                                            value={val}
                                            onChange={(e) => updateMatrix(i, j, e.target.value)}
                                            className="text-center font-mono text-slate-700"
                                        />
                                    ))
                                ))}
                            </div>
                            <div className="text-2xl font-bold text-slate-300">×</div>
                            <div className="flex flex-col gap-2">
                                {Array(dimension).fill(0).map((_, i) => (
                                    <div key={i} className="h-10 w-12 flex items-center justify-center bg-slate-100 rounded border border-slate-200 font-bold text-slate-500 text-sm">
                                        x{i + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="text-2xl font-bold text-slate-300">=</div>
                            <div className="flex flex-col gap-2">
                                {rhs.map((val, i) => (
                                    <Input
                                        key={`rhs-${i}`}
                                        placeholder={`b${i + 1}`}
                                        value={val}
                                        onChange={(e) => updateRhs(i, e.target.value)}
                                        className="w-20 text-center font-bold text-blue-700 bg-blue-50 border-blue-200"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button onClick={handleSolve} size="lg" className="shadow-blue-500/20" disabled={!isValid}>
                                <Calculator size={18} /> Resolver Sistema
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <div className="w-full md:w-64 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}
                    {solution && (
                        <Card className="border-green-200 bg-green-50/30 shadow-lg">
                            <CardHeader className="border-green-100 pb-2">
                                <CardTitle className="text-green-800 flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Solução
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {solution.map((val, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 bg-white rounded border border-green-100 shadow-sm">
                                            <span className="font-bold text-green-700">x{i + 1}</span>
                                            <span className="font-mono font-bold text-slate-900">{val.toFixed(4)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
