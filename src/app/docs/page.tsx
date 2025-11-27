"use client";

import React from 'react';
import { ChevronLeft, Book, FileText, Database, Monitor, Cpu, Layers } from 'lucide-react';
import Link from 'next/link';

const Section = ({ id, title, icon: Icon, children }: { id: string, title: string, icon?: any, children: React.ReactNode }) => (
    <section id={id} className="mb-12 scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
            {Icon && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon size={24} /></div>}
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
            {children}
        </div>
    </section>
);

const SubSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {title}
        </h3>
        <div className="pl-4 border-l-2 border-slate-100">
            {children}
        </div>
    </div>
);

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm bg-opacity-90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <ChevronLeft size={20} />
                            </div>
                            Voltar ao App
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                            <span className="font-bold text-xl tracking-tight">Vector <span className="text-slate-400 font-normal">Docs</span></span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span>v1.0</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">Publicado</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Conteúdo</h4>
                                <nav className="space-y-1 border-l border-slate-200">
                                    <a href="#intro" className="block pl-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-l-blue-600 -ml-px border-l border-transparent transition-all">1. Introdução</a>
                                    <a href="#geral" className="block pl-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-l-blue-600 -ml-px border-l border-transparent transition-all">2. Descrição Geral</a>
                                    <a href="#funcionalidades" className="block pl-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-l-blue-600 -ml-px border-l border-transparent transition-all">3. Funcionalidades</a>
                                    <a href="#dados" className="block pl-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-l-blue-600 -ml-px border-l border-transparent transition-all">4. Dados</a>
                                    <a href="#interfaces" className="block pl-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-l-blue-600 -ml-px border-l border-transparent transition-all">5. Interfaces</a>
                                    <a href="#qualidade" className="block pl-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-l-blue-600 -ml-px border-l border-transparent transition-all">6. Qualidade</a>
                                </nav>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <h4 className="font-bold text-blue-900 mb-2">Precisa de ajuda?</h4>
                                <p className="text-sm text-blue-700 mb-4">Consulte o código fonte ou entre em contato com o desenvolvedor.</p>
                                <a href="https://github.com/luisfelipesb9/vector-otimizador" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">Ver Repositório &rarr;</a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="mb-16 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Especificação de Requisitos de Software</h1>
                            <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
                                Documentação técnica completa do projeto Vector Otimizador, detalhando escopo, funcionalidades, estrutura de dados e requisitos não-funcionais.
                            </p>
                        </div>

                        <Section id="intro" title="1. Introdução" icon={Book}>
                            <SubSection title="1.1 Propósito">
                                <p>O propósito deste documento é especificar os requisitos de software para o projeto <strong>Vector Otimizador</strong>. Esta aplicação foi projetada para resolver problemas de otimização linear, sistemas de equações lineares e fornecer ferramentas de análise de sensibilidade para estudantes e profissionais da área de Pesquisa Operacional.</p>
                            </SubSection>
                            <SubSection title="1.2 Escopo">
                                <p>O <strong>Vector Otimizador</strong> é uma aplicação web que permite aos usuários:</p>
                                <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
                                    <li>Definir problemas de programação linear (variáveis, função objetivo, restrições).</li>
                                    <li>Resolver problemas utilizando o algoritmo Simplex (Primal).</li>
                                    <li>Visualizar iterações passo a passo (Tableau).</li>
                                    <li>Analisar o problema Dual e Preços Sombra (Shadow Prices).</li>
                                    <li>Visualizar a região viável graficamente (para problemas de 2 variáveis).</li>
                                    <li>Resolver sistemas de equações lineares utilizando eliminação Gaussiana.</li>
                                    <li>Salvar e carregar dados de projetos.</li>
                                </ul>
                            </SubSection>
                            <SubSection title="1.3 Definições">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        { term: "ERS", def: "Especificação de Requisitos de Software" },
                                        { term: "PL", def: "Programação Linear" },
                                        { term: "PI", def: "Programação Inteira" },
                                        { term: "Simplex", def: "Algoritmo de resolução de PL" },
                                        { term: "Dual", def: "Problema correspondente ao Primal" },
                                        { term: "RHS", def: "Right Hand Side (Lado Direito)" },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                                            <span className="font-bold text-slate-900">{item.term}:</span> <span className="text-slate-600">{item.def}</span>
                                        </div>
                                    ))}
                                </div>
                            </SubSection>
                        </Section>

                        <Section id="geral" title="2. Descrição Geral" icon={Monitor}>
                            <SubSection title="2.1 Perspectiva do Produto">
                                <p>O Vector Otimizador é uma aplicação web independente construída com <strong>Next.js</strong> e <strong>React</strong>. Opera como uma Aplicação de Página Única (SPA). Utiliza um banco de dados <strong>MariaDB</strong> (ou compatível) para persistência.</p>
                            </SubSection>
                            <SubSection title="2.2 Usuários">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2"><span className="font-bold text-slate-700">Estudantes:</span> Aprendizado e verificação de cálculos.</li>
                                    <li className="flex items-start gap-2"><span className="font-bold text-slate-700">Professores:</span> Demonstrações e correções.</li>
                                    <li className="flex items-start gap-2"><span className="font-bold text-slate-700">Analistas:</span> Otimização rápida de problemas.</li>
                                </ul>
                            </SubSection>
                            <SubSection title="2.3 Stack Tecnológico">
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Next.js 14", "React", "TypeScript", "Tailwind CSS", "MariaDB", "Vercel"].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">{tag}</span>
                                    ))}
                                </div>
                            </SubSection>
                        </Section>

                        <Section id="funcionalidades" title="3. Funcionalidades" icon={Cpu}>
                            <div className="grid gap-6">
                                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-lg text-slate-900 mb-2">3.1 Solucionador Simplex</h4>
                                    <p className="text-sm mb-4">Resolução de problemas de PL com maximização/minimização.</p>
                                    <ul className="text-sm space-y-1 text-slate-500 list-disc list-inside">
                                        <li>Definição de N variáveis</li>
                                        <li>Múltiplas restrições</li>
                                        <li>Método Big M / Duas Fases</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-lg text-slate-900 mb-2">3.2 Análise de Sensibilidade</h4>
                                    <p className="text-sm mb-4">Insights sobre estabilidade e recursos.</p>
                                    <ul className="text-sm space-y-1 text-slate-500 list-disc list-inside">
                                        <li>Preços Sombra (Shadow Prices)</li>
                                        <li>Problema Dual Automático</li>
                                        <li>Verificação de Dualidade Forte</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-lg text-slate-900 mb-2">3.3 Análise Gráfica</h4>
                                    <p className="text-sm mb-4">Visualização para problemas de 2 variáveis.</p>
                                    <ul className="text-sm space-y-1 text-slate-500 list-disc list-inside">
                                        <li>Plotagem de restrições</li>
                                        <li>Destaque da região viável</li>
                                        <li>Linha da função objetivo</li>
                                    </ul>
                                </div>
                            </div>
                        </Section>

                        <Section id="dados" title="4. Requisitos de Dados" icon={Database}>
                            <p className="mb-4">O sistema utiliza um esquema relacional robusto para garantir integridade dos dados.</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Tabela</th>
                                            <th className="px-4 py-3">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="bg-white"><td className="px-4 py-3 font-mono font-bold text-blue-600">projects</td><td className="px-4 py-3">Metadados do projeto</td></tr>
                                        <tr className="bg-slate-50"><td className="px-4 py-3 font-mono font-bold text-blue-600">variables</td><td className="px-4 py-3">Variáveis de decisão</td></tr>
                                        <tr className="bg-white"><td className="px-4 py-3 font-mono font-bold text-blue-600">constraints</td><td className="px-4 py-3">Definições de restrições</td></tr>
                                        <tr className="bg-slate-50"><td className="px-4 py-3 font-mono font-bold text-blue-600">results</td><td className="px-4 py-3">Resultados calculados e status</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section id="interfaces" title="5. Interfaces" icon={Layers}>
                            <SubSection title="5.1 Interface de Usuário">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {["Tela Inicial", "Menu de Módulos", "Configuração de Variáveis", "Modelagem Matemática", "Workspace de Análise"].map((ui, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="font-medium text-slate-700">{ui}</span>
                                        </div>
                                    ))}
                                </div>
                            </SubSection>
                            <SubSection title="5.2 API">
                                <p>Endpoints RESTful para processamento:</p>
                                <code className="block mt-2 p-3 bg-slate-900 text-green-400 rounded-lg font-mono text-sm">POST /api/solve</code>
                            </SubSection>
                        </Section>

                        <Section id="qualidade" title="6. Atributos de Qualidade" icon={FileText}>
                            <div className="grid gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0 font-bold">01</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Usabilidade</h4>
                                        <p className="text-sm text-slate-500">Interface intuitiva com feedback claro e ícones padrão.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 font-bold">02</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Desempenho</h4>
                                        <p className="text-sm text-slate-500">Execução do Simplex em &lt; 2s para problemas médios.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center shrink-0 font-bold">03</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Confiabilidade</h4>
                                        <p className="text-sm text-slate-500">Tratamento robusto de casos extremos (degenerescência, ilimitado).</p>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
                            <p>&copy; 2025 Vector Otimizador. Todos os direitos reservados.</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
}
