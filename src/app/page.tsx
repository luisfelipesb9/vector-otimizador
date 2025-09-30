"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type Constraint = {
  id: string
  expression: string
  sign: string
  value: string
}

export default function LinearProgrammingSolver() {
  // Estados do formulário (já estavam corretos)
  const [optimizationType, setOptimizationType] = useState("minimizar")
  const [objectiveFunction, setObjectiveFunction] = useState("")
  const [constraints, setConstraints] = useState<Constraint[]>([
    { id: "1", expression: "", sign: "<=", value: "" },
    { id: "2", expression: "", sign: "<=", value: "" },
    { id: "3", expression: "", sign: "<=", value: "" },
  ])

  // --- NOVOS ESTADOS ADICIONADOS ---
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);


  // Funções do formulário (já estavam corretas)
  const addConstraint = () => {
    const newId = (Math.max(...constraints.map((c) => Number.parseInt(c.id))) + 1).toString()
    setConstraints([...constraints, { id: newId, expression: "", sign: "<=", value: "" }])
  }

  const updateConstraint = (id: string, field: keyof Omit<Constraint, 'id'>, value: string) => {
    setConstraints(constraints.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }
  
  // --- NOVA FUNÇÃO PARA COMUNICAR COM O BACKEND ---
  const handleSubmit = async () => {
    setIsLoading(true);
    setChartData([]); // Limpa o gráfico antigo
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optimizationType,
          objectiveFunction,
          constraints,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao chamar a API');
      }

      const result = await response.json();
      setChartData(result.data);

    } catch (error) {
      console.error("Falha ao resolver o problema:", error);
      // Aqui podemos adicionar um alerta de erro para o usuário no futuro
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-muted/50 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* --- LOGO ADICIONADA AQUI --- */}
            <Image src="/logo-vector.png" alt="Vector Logo" width={128} height={40} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Problem Definition */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Definição do Problema de Programação Linear</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* O resto do seu formulário continua igual... */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Otimizar:</Label>
                  <RadioGroup value={optimizationType} onValueChange={setOptimizationType} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maximizar" id="maximizar" />
                      <Label htmlFor="maximizar" className="font-normal cursor-pointer">
                        Maximizar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimizar" id="minimizar" />
                      <Label htmlFor="minimizar" className="font-normal cursor-pointer">
                        Minimizar
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective" className="text-base font-medium">
                    Função objetivo:
                  </Label>
                  <Input
                    id="objective"
                    value={objectiveFunction}
                    onChange={(e) => setObjectiveFunction(e.target.value)}
                    placeholder="Ex: 3x + 2y"
                    className="text-base"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Sujeito a:</Label>
                  <div className="space-y-3">
                    {constraints.map((constraint) => (
                      <div key={constraint.id} className="flex gap-2 items-center">
                        <Input
                          value={constraint.expression}
                          onChange={(e) => updateConstraint(constraint.id, "expression", e.target.value)}
                          placeholder="Expressão"
                          className="flex-1"
                        />
                        <Select
                          value={constraint.sign}
                          onValueChange={(value) => updateConstraint(constraint.id, "sign", value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<=">≤</SelectItem>
                            <SelectItem value=">=">≥</SelectItem>
                            <SelectItem value="=">=</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={constraint.value}
                          onChange={(e) => updateConstraint(constraint.id, "value", e.target.value)}
                          placeholder="Valor"
                          className="w-24"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addConstraint}
                    className="rounded-full h-8 w-8 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* --- BOTÃO RESOLVER ADICIONADO AQUI --- */}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full text-lg"
                >
                  {isLoading ? "Resolvendo..." : "Resolver"}
                </Button>

              </CardContent>
            </Card>
          </div>

          {/* Right Column - Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-center">Representação da solução gráfica</CardTitle>
              </CardHeader>
              <CardContent>
                {/* --- GRÁFICO DINÂMICO ADICIONADO AQUI --- */}
                <div className="border rounded-lg min-h-[500px] p-4">
                  <ResponsiveContainer width="100%" height={500}>
                    {chartData.length > 0 ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="z" stroke="#82ca9d" />
                      </LineChart>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">
                          {isLoading ? "Calculando solução..." : "O gráfico da solução aparecerá aqui"}
                        </p>
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}