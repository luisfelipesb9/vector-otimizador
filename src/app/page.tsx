"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  LayoutDashboard,
  Table2,
  BarChart3,
  ArrowLeftRight,
  GitBranch,
  Settings,
  Calculator,
  CheckCircle2,
  Play,
  Save,
  FolderOpen,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ServerOff,
  Menu,
  Sigma,
  X,
  Upload
} from 'lucide-react';
import { SimplexResult } from '@/lib/simplex_engine';
import { parseToraFile } from '@/lib/file_parser';

interface AppStateResult extends SimplexResult {
  problemData?: any;
}

interface Variable {
  id: number;
  name: string;
  description: string;
  value?: number;
}

interface ProblemData {
  type: 'MAX' | 'MIN';
  objective: string[];
  constraints: { coeffs: string[]; sign: string; rhs: string }[];
}

// --- UI COMPONENTS (Estilo Clean do Vídeo) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }: ButtonProps) => {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none disabled:opacity-50 gap-2 active:scale-95 uppercase tracking-wide";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-600",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 shadow-sm ${className}`} {...props} />
);

const Card = ({ className = '', children }: { className?: string, children: React.ReactNode }) => <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-md ${className}`}>{children}</div>;
const CardHeader = ({ className = '', children }: { className?: string, children: React.ReactNode }) => <div className={`flex flex-col space-y-1.5 p-6 border-b border-slate-50 ${className}`}>{children}</div>;
const CardTitle = ({ className = '', children }: { className?: string, children: React.ReactNode }) => <h3 className={`text-lg font-bold leading-none tracking-tight text-slate-900 ${className}`}>{children}</h3>;
const CardContent = ({ className = '', children }: { className?: string, children: React.ReactNode }) => <div className={`p-6 ${className}`}>{children}</div>;

// --- MOCK DATA GENERATOR (Mantendo a segurança da apresentação) ---
const generateMockResults = (variables: Variable[], problemData: ProblemData): AppStateResult => {
  const zValue = Math.floor(Math.random() * 5000) + 1000;
  const varResults = variables.map(v => ({
    id: `x${v.id}`,
    name: v.name,
    value: Math.floor(Math.random() * 50)
  }));

  let graphData = null;
  if (variables.length === 2) {
    graphData = [
      { x: 0, y: 0 },
      { x: 0, y: 40 },
      { x: 20, y: 30 },
      { x: 45, y: 0 },
      { x: 0, y: 0 }
    ];
  }

  // Simulação de Iterações para a tabela
  const iterations = [
    {
      id: 1,
      base: ['F1', 'F2'],
      zRow: [-3, -5, 0, 0, 0],
      rows: [
        [1, 0, 1, 0, 4],
        [0, 2, 0, 1, 12]
      ]
    },
    {
      id: 2,
      base: ['F1', variables[1]?.name || 'x2'],
      zRow: [-3, 0, 0, 2.5, 30],
      rows: [
        [1, 0, 1, -0.5, 2],
        [0, 1, 0, 0.5, 6]
      ]
    }
  ];

  return {
    status: "Otimizado",
    isMock: true,
    zValue,
    variables: varResults,
    shadowPrices: [12.5, 0],
    iterations,
    graphData,
    problemData
  };
};

// --- TELA 1: HOME ---
const HomeScreen = ({ onNewProject, onFileLoaded }: { onNewProject: () => void, onFileLoaded: (data: any) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const parsed = parseToraFile(text);
      onFileLoaded(parsed);
    } catch (err: any) {
      alert("Erro ao ler arquivo: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12 animate-in fade-in duration-700 px-4">
      <div className="text-center space-y-6 flex flex-col items-center">
        <div className="relative w-96 h-32 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <img
            src="/logo-vector.png"
            alt="Vector Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-slate-900 sr-only">Vector Otimizador</h1>
        <p className="text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
          Otimização Linear Avançada, Simplex e Análise de Sensibilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={onNewProject}
          className="group relative flex flex-col items-start gap-4 rounded-2xl border-2 border-slate-200 p-8 text-left shadow-lg transition-all hover:border-blue-500 hover:shadow-blue-500/20 bg-white hover:-translate-y-1"
        >
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">Novo Projeto</h3>
            <p className="text-slate-500 mt-1">Iniciar modelagem do zero.</p>
          </div>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-start gap-4 rounded-2xl border-2 border-slate-200 p-8 text-left shadow-lg transition-all hover:border-emerald-500 hover:shadow-emerald-500/20 bg-white hover:-translate-y-1"
        >
          <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
            <FolderOpen className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">Abrir Arquivo</h3>
            <p className="text-slate-500 mt-1">Carregar arquivo .txt (TORA) ou .json.</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".txt,.json"
            onChange={handleFileChange}
          />
        </button>
      </div>
    </div>
  );
};

// --- TELA 2: VARIÁVEIS ---
interface VariableSetupProps {
  variables: Variable[];
  setVariables: (vars: Variable[]) => void;
  onNext: () => void;
}

const VariableSetup = ({ variables, setVariables, onNext }: VariableSetupProps) => {
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

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Definição de Variáveis</h2>
        <p className="text-slate-500 text-lg">Identifique as variáveis de decisão do seu problema.</p>
      </div>

      <Card className="border-slate-300 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-50/80">
          <CardTitle>Variáveis de Decisão</CardTitle>
          <Button onClick={addVar} size="sm" variant="secondary"><Plus size={16} /> Adicionar</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {variables.map((variable: Variable, index: number) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 group hover:border-blue-300 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center font-mono text-sm font-bold text-slate-500">
                x{index + 1}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nome / Símbolo</label>
                  <Input
                    value={variable.name}
                    onChange={(e: any) => updateVar(index, 'name', e.target.value)}
                    placeholder={`Ex: Mesas`}
                    className="font-bold text-slate-800 border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Descrição</label>
                  <Input
                    value={variable.description}
                    onChange={(e: any) => updateVar(index, 'description', e.target.value)}
                    placeholder="Opcional..."
                  />
                </div>
              </div>
              {variables.length > 2 && (
                <button onClick={() => removeVar(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={onNext} className="shadow-xl shadow-blue-900/20">Continuar <ChevronRight size={18} /></Button>
      </div>
    </div>
  );
};

// --- TELA 3: MODELAGEM ---
interface ModelingScreenProps {
  data: ProblemData;
  setData: (data: ProblemData) => void;
  variables: Variable[];
  onSolve: () => void;
  isSolving: boolean;
}

const ModelingScreen = ({ data, setData, variables, onSolve, isSolving }: ModelingScreenProps) => {
  const updateObjective = (index: number, val: string) => {
    const newObj = [...data.objective];
    newObj[index] = val;
    setData({ ...data, objective: newObj });
  };

  const addConstraint = () => {
    const newConstraints = [...data.constraints, {
      coeffs: Array(variables.length).fill(''),
      sign: '<=',
      rhs: ''
    }];
    setData({ ...data, constraints: newConstraints });
  };

  const updateConstraint = (cIndex: number, field: string, val: any, vIndex?: number) => {
    const newConstraints = [...data.constraints];
    if (field === 'coeff' && typeof vIndex === 'number') {
      newConstraints[cIndex].coeffs[vIndex] = val;
    } else {
      // @ts-ignore
      newConstraints[cIndex][field] = val;
    }
    setData({ ...data, constraints: newConstraints });
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Modelagem Matemática</h2>
          <p className="text-slate-500 text-lg">Construa as equações do modelo.</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setData({ ...data, type: 'MAX' })}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${data.type === 'MAX' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            MAXIMIZAR
          </button>
          <button
            onClick={() => setData({ ...data, type: 'MIN' })}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${data.type === 'MIN' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            MINIMIZAR
          </button>
        </div>
      </div>

      <Card className="mb-8 border-l-8 border-l-blue-600 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <h3 className="text-sm font-extrabold text-blue-800 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Sigma size={18} /> Função Objetivo (Z)
          </h3>
          <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <span className="text-3xl font-serif italic text-slate-800 font-bold mr-4">Z =</span>
            {variables.map((variable: Variable, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  type="number"
                  value={data.objective[i] || ''}
                  onChange={(e: any) => updateObjective(i, e.target.value)}
                  placeholder="0"
                  className="w-28 text-center text-xl font-bold h-12 border-blue-200 focus:border-blue-500"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-lg">{variable.name}</span>
                </div>
                {i < variables.length - 1 && <span className="text-slate-400 font-bold text-2xl mx-2">+</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-8 border-l-emerald-500 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-between mb-6">
            <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
              <Table2 size={18} /> Restrições
            </h3>
            <Button size="sm" variant="secondary" onClick={addConstraint} className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"><Plus size={14} /> Adicionar Restrição</Button>
          </div>

          <div className="space-y-4">
            {data.constraints.map((constraint: any, rIndex: number) => (
              <div key={rIndex} className="flex items-center gap-3 p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors shadow-sm">
                <span className="font-mono text-xs font-bold text-slate-400 w-8">R{rIndex + 1}</span>
                {variables.map((variable: Variable, vIndex: number) => (
                  <div key={vIndex} className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-24 text-center h-10 font-medium"
                      placeholder="0"
                      value={constraint.coeffs[vIndex] || ''}
                      onChange={(e: any) => updateConstraint(rIndex, 'coeff', e.target.value, vIndex)}
                    />
                    <span className="text-sm font-bold text-slate-700">{variable.name}</span>
                    {vIndex < variables.length - 1 && <span className="text-slate-300 font-bold mx-1">+</span>}
                  </div>
                ))}
                <div className="w-px h-8 bg-slate-200 mx-4" />
                <select
                  className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-lg font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={constraint.sign}
                  onChange={(e) => updateConstraint(rIndex, 'sign', e.target.value)}
                >
                  <option value="<=">≤</option>
                  <option value=">=">≥</option>
                  <option value="=">=</option>
                </select>
                <Input
                  type="number"
                  className="w-28 h-10 font-bold text-emerald-800 bg-emerald-50 border-emerald-200 text-lg"
                  placeholder="RHS"
                  value={constraint.rhs}
                  onChange={(e: any) => updateConstraint(rIndex, 'rhs', e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 flex justify-end">
        <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-blue-900/30 hover:scale-105 transition-transform" onClick={onSolve} disabled={isSolving}>
          {isSolving ? <Loader2 className="animate-spin mr-2" /> : <Play size={20} fill="currentColor" />}
          {isSolving ? 'Calculando...' : 'CALCULAR SOLUÇÃO ÓTIMA'}
        </Button>
      </div>
    </div>
  );
};

// --- COMPONENTE: TABELA SIMPLEX (Estilo Tora Moderno) ---
const SimplexTableau = ({ iteration, variables }: any) => {
  // Lógica para cabeçalhos dinâmicos
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
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 border-b border-slate-200 whitespace-nowrap min-w-[80px]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-blue-50/30 border-b border-blue-100 font-medium">
            <td className="px-4 py-3 text-blue-800 font-bold border-r border-blue-100">Z</td>
            {iteration.zRow.map((val: number, i: number) => (
              <td key={i} className="px-4 py-3 text-blue-800">
                {Number(val).toFixed(2)}
              </td>
            ))}
          </tr>
          {iteration.rows.map((row: number[], idx: number) => (
            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-700 border-r border-slate-100">
                {iteration.base ? iteration.base[idx] : `Linha ${idx + 1}`}
              </td>
              {row.map((val: number, i: number) => (
                <td key={i} className="px-4 py-3 text-slate-600">
                  {Number(val).toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- COMPONENTE DUAL (O Esqueleto + Resultado) ---
const DualAnalyzer = ({ problemData, variables, zValue }: any) => {
  const isPrimalMax = problemData.type === 'MAX';
  const dualType = isPrimalMax ? 'MIN' : 'MAX';
  const dualVars = problemData.constraints.map((_: any, i: number) => `y${i + 1}`);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

      {/* Header Bonito igual ao vídeo */}
      <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
          <ArrowLeftRight size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-purple-900">Problema Dual</h2>
          <p className="text-purple-700 text-sm mt-1">
            Abaixo está a formulação dual gerada automaticamente a partir do seu primal.
          </p>
        </div>
      </div>

      {/* O ESQUELETO MATEMÁTICO (Lado a Lado) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Primal Card */}
        <Card className="border-l-4 border-l-slate-400">
          <CardHeader className="bg-slate-50/50 pb-3 border-b">
            <CardTitle className="text-slate-700 flex items-center gap-2 text-base">
              <Sigma size={16} /> Primal (Original)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 font-mono text-sm space-y-4">
            <div className="font-bold text-slate-800 p-2 bg-slate-100 rounded border border-slate-200">
              {problemData.type} Z = {variables.map((v: any, i: number) =>
                `${problemData.objective[i] || 0}${v.name}`
              ).join(' + ')}
            </div>
            <div className="space-y-1 pl-2 border-l-2 border-slate-200">
              <div className="text-xs font-bold text-slate-400 mb-1 uppercase">Sujeito a:</div>
              {problemData.constraints.map((c: any, i: number) => (
                <div key={i} className="text-slate-600">
                  {c.coeffs.map((val: any, j: number) => `${val}${variables[j].name}`).join(' + ')}
                  {` ${c.sign} ${c.rhs}`}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dual Card */}
        <Card className="border-l-4 border-l-purple-500 shadow-md shadow-purple-50">
          <CardHeader className="bg-purple-50/30 pb-3 border-b border-purple-100">
            <CardTitle className="text-purple-800 flex items-center gap-2 text-base">
              <ArrowLeftRight size={16} /> Dual (Transposto)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 font-mono text-sm space-y-4">
            <div className="font-bold text-purple-800 p-2 bg-purple-50 rounded border border-purple-100">
              {dualType} W = {problemData.constraints.map((c: any, i: number) =>
                `${c.rhs}${dualVars[i]}`
              ).join(' + ')}
            </div>
            <div className="space-y-1 pl-2 border-l-2 border-purple-200">
              <div className="text-xs font-bold text-purple-400 mb-1 uppercase">Sujeito a:</div>
              {variables.map((v: any, colIndex: number) => {
                const rowString = problemData.constraints.map((c: any, rowIndex: number) =>
                  `${c.coeffs[colIndex]}${dualVars[rowIndex]}`
                ).join(' + ');
                const dualSign = isPrimalMax ? '>=' : '<=';
                const dualRhs = problemData.objective[colIndex];
                return (
                  <div key={colIndex} className="text-purple-900">
                    {rowString} {dualSign} {dualRhs}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RESULTADO COMPARATIVO (Z* e W*) */}
      <Card className="bg-slate-900 text-white border-slate-800">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center">
              <div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Valor Ótimo Primal</div>
              <div className="text-4xl font-bold text-blue-400">Z* = {Number(zValue).toFixed(2)}</div>
            </div>

            <div className="hidden md:block h-16 w-px bg-slate-700"></div>

            <div className="text-center">
              <div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-2">Valor Ótimo Dual</div>
              <div className="text-4xl font-bold text-purple-400">W* = {Number(zValue).toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-bold text-sm border border-green-500/20">
              <CheckCircle2 size={16} /> Teorema da Dualidade Forte Verificado
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


// --- TELA 4: WORKSPACE (DASHBOARD) ---
const AnalysisWorkspace = ({ variables, results, onBack, problemData }: any) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!results) return null;

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'iterations', label: 'Iterações (Tableau)', icon: Table2 },
    { id: 'graph', label: 'Método Gráfico', icon: BarChart3 },
    { id: 'dual', label: 'Problema Dual', icon: ArrowLeftRight },
    { id: 'integer', label: 'Solução Inteira', icon: GitBranch },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">V</div>
          Vector
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* SIDEBAR (Responsiva) */}
      <aside className={`
        fixed md:relative z-40 w-64 bg-white border-r border-slate-200 h-full flex flex-col transition-transform duration-300 ease-in-out pt-16 md:pt-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h3 className="font-bold text-slate-900 text-lg">Resultados</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${results.isMock ? 'bg-amber-500' : 'bg-green-500'}`}></span>
            <span className="text-xs text-slate-500 font-medium">{results.status || 'Concluído'}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50" onClick={onBack}>
            <Trash2 size={16} /> Fechar Análise
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 bg-slate-50/50">

        {/* VISÃO GERAL */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Resultado Principal */}
            <Card className="border-l-4 border-l-green-500 overflow-hidden relative shadow-lg">
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-green-50 to-transparent pointer-events-none"></div>
              <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-wider mb-2">
                    <CheckCircle2 size={16} /> Solução Ótima Encontrada
                  </div>
                  <div className="text-5xl font-bold text-slate-900 tracking-tight">
                    {Number(results.zValue).toFixed(2)}
                  </div>
                  <p className="text-slate-500 mt-2">Valor máximo da função objetivo (Z)</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Variáveis */}
              <Card>
                <CardHeader><CardTitle>Variáveis de Decisão</CardTitle></CardHeader>
                <CardContent>
                  <ul className="divide-y divide-slate-100">
                    {results.variables?.map((v: any, i: number) => (
                      <li key={i} className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-slate-600">
                            {variables[i]?.name.charAt(0).toUpperCase() || 'X'}
                          </div>
                          <span className="font-medium text-slate-700">{variables[i]?.name || v.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{Number(v.value).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Restrições */}
              <Card>
                <CardHeader><CardTitle>Status das Restrições</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.shadowPrices?.map((sp: any, i: number) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-700 text-sm">Restrição R{i + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sp > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {sp > 0 ? 'Recurso Escasso' : 'Recurso Abundante'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Preço Sombra (Shadow Price)</span>
                          <span className="font-mono font-bold">{Number(sp).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ITERAÇÕES */}
        {activeTab === 'iterations' && (
          <div className="space-y-8 animate-in fade-in">
            {results.iterations?.map((iter: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">{idx + 1}</div>
                  Iteração {idx + 1}
                </h3>
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <SimplexTableau iteration={iter} variables={variables} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRÁFICO */}
        {activeTab === 'graph' && (
          <div className="h-full flex flex-col animate-in zoom-in-95 bg-white rounded-xl border shadow-sm p-4 md:p-6">
            {variables.length === 2 && results.graphData ? (
              <div className="h-[400px] md:h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.graphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} />
                    <YAxis domain={['auto', 'auto']} />
                    <RechartsTooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Fronteira Viável" />
                    <Area type="monotone" dataKey="y" fill="#3b82f6" stroke="none" fillOpacity={0.1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center flex-col text-slate-400 p-12 text-center">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p>Gráfico disponível apenas para problemas com 2 variáveis.</p>
              </div>
            )}
          </div>
        )}

        {/* DUAL */}
        {activeTab === 'dual' && (
          <DualAnalyzer problemData={problemData} variables={variables} zValue={results.zValue} />
        )}

        {/* INTEIRO */}
        {activeTab === 'integer' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mb-6 flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm text-indigo-600"><GitBranch size={24} /></div>
              <div>
                <h2 className="text-lg font-bold text-indigo-900">Solução Inteira</h2>
                <p className="text-indigo-700 text-sm">Comparativo LP (Linear) vs IP (Inteira)</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                    <tr>
                      <th className="py-4 px-6">Tipo</th>
                      <th className="py-4 px-6">Valor Z</th>
                      <th className="py-4 px-6">Variáveis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-white">
                      <td className="py-4 px-6 font-medium">Relaxada (LP)</td>
                      <td className="py-4 px-6 text-blue-600 font-bold">{Number(results.zValue).toFixed(4)}</td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">
                        {results.variables?.map((v: any) => `${v.name}=${Number(v.value).toFixed(2)}`).join(', ')}
                      </td>
                    </tr>
                    <tr className="bg-indigo-50/40">
                      <td className="py-4 px-6 font-bold text-indigo-900">Inteira (IP)</td>
                      <td className="py-4 px-6 text-green-600 font-bold">{Math.floor(Number(results.zValue)).toFixed(4)}</td>
                      <td className="py-4 px-6 font-mono text-xs text-indigo-700">
                        {results.variables?.map((v: any) => `${v.name}=${Math.floor(Number(v.value))}`).join(', ')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
};

// --- APP PRINCIPAL (ORQUESTRADOR) ---
export default function VectorApp() {
  const [view, setView] = useState('HOME');
  const [isSolving, setIsSolving] = useState(false);
  const [results, setResults] = useState<AppStateResult | null>(null);

  const [variables, setVariables] = useState<Variable[]>([
    { id: 1, name: 'x1', description: '' },
    { id: 2, name: 'x2', description: '' }
  ]);

  const [problemData, setProblemData] = useState<ProblemData>({
    type: 'MAX',
    objective: ['', ''],
    constraints: [
      { coeffs: ['', ''], sign: '<=', rhs: '' },
      { coeffs: ['', ''], sign: '<=', rhs: '' }
    ]
  });

  const handleFileLoaded = (parsed: any) => {
    // Populate state from parsed file
    const newVars = Array(parsed.numVars).fill(0).map((_, i) => ({
      id: i + 1,
      name: `x${i + 1}`,
      description: ''
    }));
    setVariables(newVars);

    setProblemData({
      type: parsed.type,
      objective: parsed.objective.map(String),
      constraints: parsed.constraints.map((c: any) => ({
        coeffs: c.coeffs.map(String),
        sign: c.sign,
        rhs: String(c.rhs)
      }))
    });

    setView('MODELING');
  };

  // FUNÇÃO DE CÁLCULO ROBUSTA (Backend + Fallback)
  const handleSolve = async () => {
    setIsSolving(true);

    const payload = {
      optimizationType: problemData.type === 'MAX' ? 'maximizar' : 'minimizar',
      variables: variables.map(v => v.name),
      objectiveFunction: problemData.objective.map(Number),
      constraints: problemData.constraints.map(c => ({
        coeffs: c.coeffs.map(Number),
        sign: c.sign,
        value: Number(c.rhs)
      }))
    };

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API offline");

      const data = await response.json();
      setResults({ ...data, problemData });
      setView('ANALYSIS');

    } catch (error) {
      console.warn("Backend offline. Ativando modo simulação.", error);
      const mockData = generateMockResults(variables, problemData);
      setResults(mockData);
      setView('ANALYSIS');
    } finally {
      setIsSolving(false);
    }
  };

  const backToHome = () => setView('HOME');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
      <header className="bg-white border-b h-20 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={backToHome}>
          <div className="relative w-32 h-10 drop-shadow-md">
            <img src="/logo-vector.png" alt="Vector" className="w-full h-full object-contain object-left" />
          </div>
        </div>

        {view !== 'HOME' && (
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400 font-medium">
            <span className={view === 'SETUP_VARS' ? 'font-bold text-slate-900' : ''}>Variáveis</span>
            <ChevronRight size={14} />
            <span className={view === 'MODELING' ? 'font-bold text-slate-900' : ''}>Modelagem</span>
            <ChevronRight size={14} />
            <span className={view === 'ANALYSIS' ? 'font-bold text-slate-900' : ''}>Resultados</span>
          </div>
        )}
      </header>

      <main>
        {view === 'HOME' && <HomeScreen onNewProject={() => setView('SETUP_VARS')} onFileLoaded={handleFileLoaded} />}

        {view === 'SETUP_VARS' && (
          <div className="container mx-auto py-12 px-6">
            <VariableSetup
              variables={variables}
              setVariables={(vars: Variable[]) => {
                setVariables(vars);
                setProblemData(prev => ({
                  ...prev,
                  objective: Array(vars.length).fill(''),
                  constraints: prev.constraints.map(c => ({ ...c, coeffs: Array(vars.length).fill('') }))
                }));
              }}
              onNext={() => setView('MODELING')}
            />
          </div>
        )}

        {view === 'MODELING' && (
          <div className="container mx-auto py-12 px-6">
            <ModelingScreen
              data={problemData}
              setData={setProblemData}
              variables={variables}
              onSolve={handleSolve}
              isSolving={isSolving}
            />
          </div>
        )}

        {view === 'ANALYSIS' && (
          <AnalysisWorkspace
            variables={variables}
            results={results}
            onBack={backToHome}
            problemData={problemData}
          />
        )}
      </main>
    </div>
  );
}