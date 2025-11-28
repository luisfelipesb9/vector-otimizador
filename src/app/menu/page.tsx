"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Network, Grid3X3, Truck, GitBranch, Clock, Gamepad2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
    const router = useRouter();

    const modules = [
        { id: 'LE', title: 'Linear Equations', desc: 'Gauss-Jordan / Matrix Inversion', icon: Network, color: 'emerald' },
        { id: 'LP', title: 'Linear Programming', desc: 'Simplex Method / Sensitivity Analysis', icon: Grid3X3, color: 'blue' },
        { id: 'TR', title: 'Transportation Model', desc: 'Vogel / Northwest Corner (Coming Soon)', icon: Truck, color: 'slate', disabled: true },
        { id: 'IP', title: 'Integer Programming', desc: 'Branch and Bound / Cutting Plane', icon: GitBranch, color: 'indigo' },
        { id: 'NM', title: 'Network Models', desc: 'CPM / PERT (Coming Soon)', icon: Network, color: 'slate', disabled: true },
        { id: 'PP', title: 'Project Planning', desc: 'Gantt / Resource Allocation (Coming Soon)', icon: Clock, color: 'slate', disabled: true },
        { id: 'QA', title: 'Queuing Analysis', desc: 'M/M/1 / M/M/c (Coming Soon)', icon: Clock, color: 'slate', disabled: true },
        { id: 'ZS', title: 'Zero-Sum Games', desc: 'Minimax / Maximin (Coming Soon)', icon: Gamepad2, color: 'slate', disabled: true },
    ];

    const handleSelect = (id: string) => {
        if (id === 'LP' || id === 'IP') router.push('/setup');
        if (id === 'LE') router.push('/linear');
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500 py-12">
            <div className="flex items-center justify-between mb-12 px-4">
                <Button variant="ghost" onClick={() => router.push('/')} className="gap-2">
                    <ChevronRight className="rotate-180" size={20} /> Voltar
                </Button>
                <h2 className="text-3xl font-extrabold text-slate-900">Selecione um Módulo</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {modules.map((m) => {
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.id}
                            disabled={m.disabled}
                            onClick={() => handleSelect(m.id)}
                            className={`flex flex-col items-start p-6 rounded-2xl border-2 text-left transition-all ${m.disabled ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' : 'border-slate-200 bg-white hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 group'}`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${m.disabled ? 'bg-slate-200 text-slate-400' : `bg-${m.color}-50 text-${m.color}-600 group-hover:scale-110 transition-transform`}`}>
                                <Icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h3>
                            <p className="text-sm text-slate-500">{m.desc}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
