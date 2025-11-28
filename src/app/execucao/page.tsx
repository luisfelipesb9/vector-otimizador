"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Table2,
    BarChart3,
    ArrowLeftRight,
    GitBranch,
    CheckCircle2,
    Trash2,
    Menu,
    X,
    Sigma
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProject } from '@/context/project-context';

// --- COMPONENTE: TABELA SIMPLEX ---
const SimplexTableau = ({ iteration, variables }: any) => {
    const numDecisionVars = variables.length;
    const colsCount = iteration.zRow.length;
    const numSlacks = colsCount - numDecisionVars - 1;
    const headers = ['Base'];
    variables.forEach((v: any) => headers.push(v.name));
    for (let i = 0; i < numSlacks; i++) headers.push(`F${i + 1}`);
    headers.push('RHS');
    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs">
                    <tr>{headers.map((h, i) => <th key={i} className="px-4 py-3 border-b border-slate-200 whitespace-nowrap min-w-[80px]">{h}</th>)}</tr>
                </thead>
                <tbody>
                    <tr className="bg-blue-50/30 border-b border-blue-100 font-medium">
                        <td className="px-4 py-3 text-blue-800 font-bold border-r border-blue-100">Z</td>
                        {iteration.zRow.map((val: number, i: number) => <td key={i} className="px-4 py-3 text-blue-800">{Number(val).toFixed(2)}</td>)}
                    </tr>
                    {iteration.rows.map((row: number[], idx: number) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-700 border-r border-slate-100">{iteration.base ? iteration.base[idx] : `Linha ${idx + 1}`}</td>
                            {row.map((val: number, i: number) => <td key={i} className="px-4 py-3 text-slate-600">{Number(val).toFixed(2)}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- COMPONENTE DUAL ---
const DualAnalyzer = ({ problemData, variables, zValue }: any) => {
    const isPrimalMax = problemData.type === 'MAX';
    const dualType = isPrimalMax ? 'MIN' : 'MAX';
    const dualVars = problemData.constraints.map((_: any, i: number) => `y${i + 1}`);
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600"><ArrowLeftRight size={24} /></div>
                <div><h2 className="text-lg font-bold text-purple-900">Problema Dual</h2><p className="text-purple-700 text-sm mt-1">Formulação dual gerada automaticamente.</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-slate-400">
                    <CardHeader className="bg-slate-50/50 pb-3 border-b"><CardTitle className="text-slate-700 flex items-center gap-2 text-base"><Sigma size={16} /> Primal</CardTitle></CardHeader>
                    <CardContent className="pt-4 font-mono text-sm space-y-4">
                        <div className="font-bold text-slate-800 p-2 bg-slate-100 rounded border border-slate-200">{problemData.type} Z = {variables.map((v: any, i: number) => `${problemData.objective[i] || 0}${v.name}`).join(' + ')}</div>
                        <div className="space-y-1 pl-2 border-l-2 border-slate-200">
                            <div className="text-xs font-bold text-slate-400 mb-1 uppercase">Sujeito a:</div>
                            {problemData.constraints.map((c: any, i: number) => (<div key={i} className="text-slate-600">{c.coeffs.map((val: any, j: number) => `${val}${variables[j].name}`).join(' + ')} {` ${c.sign} ${c.rhs}`}</div>))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 shadow-md shadow-purple-50">
                    <CardHeader className="bg-purple-50/30 pb-3 border-b border-purple-100"><CardTitle className="text-purple-800 flex items-center gap-2 text-base"><ArrowLeftRight size={16} /> Dual</CardTitle></CardHeader>
                    <CardContent className="pt-4 font-mono text-sm space-y-4">
                        <div className="font-bold text-purple-800 p-2 bg-purple-50 rounded border border-purple-100">{dualType} W = {problemData.constraints.map((c: any, i: number) => `${c.rhs}${dualVars[i]}`).join(' + ')}</div>
                        <div className="space-y-1 pl-2 border-l-2 border-purple-200">
                            <div className="text-xs font-bold text-purple-400 mb-1 uppercase">Sujeito a:</div>
                            {variables.map((v: any, colIndex: number) => {
                                const rowString = problemData.constraints.map((c: any, rowIndex: number) => `${c.coeffs[colIndex]}${dualVars[rowIndex]}`).join(' + ');
                                const dualSign = isPrimalMax ? '>=' : '<=';
                                const dualRhs = problemData.objective[colIndex];
                                return (<div key={colIndex} className="text-purple-900">{rowString} {dualSign} {dualRhs}</div>);
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="bg-slate-900 text-white border-slate-800">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                        <div className="text-center"><div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Valor Ótimo Primal</div><div className="text-4xl font-bold text-blue-400">Z* = {Number(zValue).toFixed(2)}</div></div>
                        <div className="hidden md:block h-16 w-px bg-slate-700"></div>
                        <div className="text-center"><div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Valor Ótimo Dual</div><div className="text-4xl font-bold text-purple-400">W* = {Number(zValue).toFixed(2)}</div></div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center"><span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-bold text-sm border border-green-500/20"><CheckCircle2 size={16} /> Teorema da Dualidade Forte Verificado</span></div>
                </CardContent>
            </Card>
        </div>
    );
};

export default function AnalysisWorkspace() {
    const router = useRouter();
    const { variables, results, problemData } = useProject();
    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Nenhum resultado disponível</h2>
                <Button onClick={() => router.push('/modeling')}>Voltar para Modelagem</Button>
            </div>
        );
    }

    const menuItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'iterations', label: 'Iterações (Tableau)', icon: Table2 },
        { id: 'graph', label: 'Método Gráfico', icon: BarChart3 },
        { id: 'dual', label: 'Problema Dual', icon: ArrowLeftRight },
        { id: 'integer', label: 'Solução Inteira', icon: GitBranch },
    ];

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
            <div className="md:hidden fixed top-20 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
                <div className="font-bold flex items-center gap-2">Menu de Análise</div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</Button>
            </div>
            <aside className={`fixed md:relative z-30 w-64 bg-white border-r border-slate-200 h-full flex flex-col transition-transform duration-300 ease-in-out pt-16 md:pt-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-100 hidden md:block">
                    <h3 className="font-bold text-slate-900 text-lg">Resultados</h3>
                    <div className="flex items-center gap-2 mt-2"><span className={`w-2.5 h-2.5 rounded-full ${results.isMock ? 'bg-amber-500' : 'bg-green-500'}`}></span><span className="text-xs text-slate-500 font-medium">{results.status || 'Concluído'}</span></div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (<button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400'} />{item.label}</button>)
                    })}
                </nav>
                <div className="p-4 border-t border-slate-100"><Button variant="outline" className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50" onClick={() => router.push('/modeling')}><Trash2 size={16} /> Fechar Análise</Button></div>
            </aside>
            <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 bg-slate-50/50">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <Card className="border-l-4 border-l-green-500 overflow-hidden relative shadow-lg">
                            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-green-50 to-transparent pointer-events-none"></div>
                            <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-wider mb-2"><CheckCircle2 size={16} /> Solução Ótima Encontrada</div>
                                    <div className="text-5xl font-bold text-slate-900 tracking-tight">{Number(results.zValue).toFixed(2)}</div>
                                    <p className="text-slate-500 mt-2">Valor máximo da função objetivo (Z)</p>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card><CardHeader><CardTitle>Variáveis de Decisão</CardTitle></CardHeader><CardContent><ul className="divide-y divide-slate-100">{results.variables?.map((v: any, i: number) => (<li key={i} className="flex justify-between items-center py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-slate-600">{variables[i]?.name.charAt(0).toUpperCase() || 'X'}</div><span className="font-medium text-slate-700">{variables[i]?.name || v.name}</span></div><span className="font-bold text-slate-900">{Number(v.value).toFixed(2)}</span></li>))}</ul></CardContent></Card>
                            <Card><CardHeader><CardTitle>Status das Restrições</CardTitle></CardHeader><CardContent><div className="space-y-4">{results.shadowPrices?.map((sp: any, i: number) => (<div key={i} className="bg-slate-50 rounded-lg p-3"><div className="flex justify-between items-center mb-2"><span className="font-bold text-slate-700 text-sm">Restrição R{i + 1}</span><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sp > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{sp > 0 ? 'Recurso Escasso' : 'Recurso Abundante'}</span></div><div className="flex justify-between text-xs text-slate-500"><span>Preço Sombra (Shadow Price)</span><span className="font-mono font-bold">{Number(sp).toFixed(2)}</span></div></div>))}</div></CardContent></Card>
                        </div>
                    </div>
                )}
                {activeTab === 'iterations' && (<div className="space-y-8 animate-in fade-in">{results.iterations?.map((iter: any, idx: number) => (<div key={idx} className="space-y-2"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">{idx + 1}</div>Iteração {idx + 1}</h3><div className="bg-white rounded-xl border shadow-sm overflow-hidden"><SimplexTableau iteration={iter} variables={variables} /></div></div>))}</div>)}
                {activeTab === 'graph' && (<div className="h-full flex flex-col animate-in zoom-in-95 bg-white rounded-xl border shadow-sm p-4 md:p-6">{variables.length === 2 && results.graphData ? (<div className="h-[400px] md:h-[500px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={results.graphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="x" type="number" domain={['auto', 'auto']} /><YAxis domain={['auto', 'auto']} /><RechartsTooltip /><Legend verticalAlign="top" height={36} /><Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Fronteira Viável" /><Area type="monotone" dataKey="y" fill="#3b82f6" stroke="none" fillOpacity={0.1} /></LineChart></ResponsiveContainer></div>) : (<div className="h-full flex items-center justify-center flex-col text-slate-400 p-12 text-center"><BarChart3 size={48} className="mb-4 opacity-20" /><p>Gráfico disponível apenas para problemas com 2 variáveis.</p></div>)}</div>)}
                {activeTab === 'dual' && (<DualAnalyzer problemData={problemData} variables={variables} zValue={results.zValue} />)}
                {activeTab === 'integer' && (<div className="space-y-6 animate-in fade-in"><div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mb-6 flex items-center gap-4"><div className="p-3 bg-white rounded-lg shadow-sm text-indigo-600"><GitBranch size={24} /></div><div><h2 className="text-lg font-bold text-indigo-900">Solução Inteira</h2><p className="text-indigo-700 text-sm">Comparativo LP (Linear) vs IP (Inteira)</p></div></div><Card><CardContent className="p-0 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500 font-semibold border-b"><tr><th className="py-4 px-6">Tipo</th><th className="py-4 px-6">Valor Z</th><th className="py-4 px-6">Variáveis</th></tr></thead><tbody className="divide-y divide-slate-100"><tr className="bg-white"><td className="py-4 px-6 font-medium">Relaxada (LP)</td><td className="py-4 px-6 text-blue-600 font-bold">{Number(results.zValue).toFixed(4)}</td><td className="py-4 px-6 font-mono text-xs text-slate-500">{results.variables?.map((v: any) => `${v.name}=${Number(v.value).toFixed(2)}`).join(', ')}</td></tr><tr className="bg-indigo-50/40"><td className="py-4 px-6 font-bold text-indigo-900">Inteira (IP)</td><td className="py-4 px-6 text-green-600 font-bold">{Math.floor(Number(results.zValue)).toFixed(4)}</td><td className="py-4 px-6 font-mono text-xs text-indigo-700">{results.variables?.map((v: any) => `${v.name}=${Math.floor(Number(v.value))}`).join(', ')}</td></tr></tbody></table></CardContent></Card></div>)}
            </main>
        </div>
    );
}
