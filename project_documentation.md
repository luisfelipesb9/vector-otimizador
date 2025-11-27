# Especificação de Requisitos de Software
## Vector Otimizador

**Versão:** 1.0
**Data:** 27/11/2025

---

## 1. Introdução

### 1.1 Propósito
O propósito deste documento é especificar os requisitos de software para o projeto **Vector Otimizador**. Esta aplicação foi projetada para resolver problemas de otimização linear, sistemas de equações lineares e fornecer ferramentas de análise de sensibilidade para estudantes e profissionais da área de Pesquisa Operacional.

### 1.2 Escopo
O **Vector Otimizador** é uma aplicação web que permite aos usuários:
- Definir problemas de programação linear (variáveis, função objetivo, restrições).
- Resolver problemas utilizando o algoritmo Simplex (Primal).
- Visualizar iterações passo a passo (Tableau).
- Analisar o problema Dual e Preços Sombra (Shadow Prices).
- Visualizar a região viável graficamente (para problemas de 2 variáveis).
- Resolver sistemas de equações lineares utilizando eliminação Gaussiana.
- Salvar e carregar dados de projetos.

### 1.3 Definições, Acrônimos e Abreviações
- **ERS**: Especificação de Requisitos de Software.
- **PL**: Programação Linear.
- **PI**: Programação Inteira.
- **Simplex**: Um algoritmo para resolver problemas de programação linear.
- **Dual**: O problema de programação linear correspondente derivado do problema primal.
- **RHS**: Right Hand Side (Lado Direito de uma restrição).
- **GUI**: Graphical User Interface (Interface Gráfica do Usuário).

### 1.4 Referências
- Wiegers, Karl, e Joy Beatty. *Software Requirements*. 3ª ed., Microsoft Press, 2013.
- Código Fonte do Projeto: repositório `vector-otimizador`.

---

## 2. Descrição Geral

### 2.1 Perspectiva do Produto
O Vector Otimizador é uma aplicação web independente construída com **Next.js** e **React**. Opera como uma Aplicação de Página Única (SPA) com uma API backend para tarefas computacionais pesadas (opcional, visto que a lógica central também é implementada em TypeScript para execução no cliente). Utiliza um banco de dados **MariaDB** (ou compatível, como MySQL/PostgreSQL) para persistência dos dados do projeto.

### 2.2 Características dos Usuários
- **Estudantes**: Utilizam a ferramenta para aprender conceitos de Pesquisa Operacional, verificar cálculos manuais e visualizar resultados.
- **Professores**: Utilizam a ferramenta para demonstrações em sala de aula e correção de exercícios.
- **Analistas**: Utilizam a ferramenta para otimização rápida de problemas de pequena e média escala.

### 2.3 Ambiente Operacional
- **Cliente**: Navegador web moderno (Chrome, Firefox, Edge, Safari).
- **Servidor**: Ambiente Node.js (para Next.js SSR e rotas de API).
- **Banco de Dados**: MariaDB, MySQL ou PostgreSQL (conforme definido em `database_schema.sql`).

### 2.4 Restrições de Design e Implementação
- **Linguagem**: TypeScript (Modo estrito).
- **Framework**: Next.js 14 (App Router).
- **Estilização**: Tailwind CSS.
- **Responsividade**: Deve funcionar em dispositivos Desktop e Móveis.
- **Algoritmo**: Deve implementar o método Simplex corretamente, lidando com maximização e minimização.

### 2.5 Suposições e Dependências
- Os usuários possuem conhecimento básico de formulação de programação linear.
- Conexão com a internet é necessária para o carregamento inicial (e chamadas de API se a resolução via servidor for utilizada).
- O navegador suporta JavaScript ES6+.

---

## 3. Funcionalidades do Sistema

### 3.1 Solucionador de Programação Linear (Simplex)
**Descrição**: A funcionalidade principal permite que os usuários insiram um problema de PL e obtenham a solução ótima.
**Requisitos Funcionais**:
- O sistema deve permitir que os usuários definam $N$ variáveis de decisão.
- O sistema deve permitir que os usuários escolham entre Maximização e Minimização.
- O sistema deve permitir que os usuários definam os coeficientes da Função Objetivo.
- O sistema deve permitir que os usuários adicionem múltiplas restrições com sinais ($\leq, \geq, =$) e valores de RHS.
- O sistema deve resolver o problema utilizando o algoritmo Simplex.
- O sistema deve lidar com métodos "Big M" ou Duas Fases para variáveis artificiais.

### 3.2 Análise de Sensibilidade e Problema Dual
**Descrição**: Fornece insights sobre a estabilidade da solução e uso de recursos.
**Requisitos Funcionais**:
- O sistema deve calcular e exibir Preços Sombra (Shadow Prices) para cada restrição.
- O sistema deve identificar recursos escassos versus abundantes.
- O sistema deve formular e exibir automaticamente o Problema Dual.
- O sistema deve verificar o Teorema da Dualidade Forte ($Z^* = W^*$).

### 3.3 Análise Gráfica
**Descrição**: Visualiza a região viável para problemas de 2 variáveis.
**Requisitos Funcionais**:
- O sistema deve detectar quando o problema possui exatamente 2 variáveis.
- O sistema deve plotar as restrições como linhas em um plano Cartesiano.
- O sistema deve destacar a região viável.
- O sistema deve plotar a linha da função objetivo.

### 3.4 Solucionador de Sistemas Lineares
**Descrição**: Um módulo separado para resolver sistemas de equações lineares ($Ax = b$).
**Requisitos Funcionais**:
- O sistema deve permitir a entrada de uma matriz quadrada $A$ e um vetor $b$.
- O sistema deve resolver para $x$ utilizando Eliminação Gaussiana ou Inversão de Matriz.
- O sistema deve validar a entrada quanto à consistência.

### 3.5 Suporte a Programação Inteira
**Descrição**: Fornece soluções inteiras para problemas de PL.
**Requisitos Funcionais**:
- O sistema deve comparar a solução relaxada (PL) com uma solução inteira (PI).
- O sistema deve utilizar uma heurística ou abordagem Branch and Bound para encontrar valores inteiros.

---

## 4. Requisitos de Dados

### 4.1 Esquema do Banco de Dados
O sistema persiste dados utilizando um banco de dados relacional (MariaDB). O esquema inclui:

- **projects**: Armazena metadados do projeto (nome, descrição, datas).
- **variables**: Armazena variáveis de decisão vinculadas a um projeto.
- **constraints**: Armazena definições de restrições (sinal, RHS).
- **constraint_coefficients**: Armazena os coeficientes da matriz ($A_{ij}$).
- **objective_function**: Armazena coeficientes da função objetivo ($c_j$).
- **results**: Armazena os resultados calculados ($Z$, status).

**Representação do Diagrama ER (Textual):**
- `projects` (1) ---- (N) `variables`
- `projects` (1) ---- (N) `constraints`
- `constraints` (1) ---- (N) `constraint_coefficients`
- `variables` (1) ---- (N) `constraint_coefficients`

---

## 5. Requisitos de Interface Externa

### 5.1 Interfaces de Usuário
- **Tela Inicial**: Página de destino com opções "Novo Projeto" e "Carregar Arquivo".
- **Tela de Menu**: Layout em grade para selecionar módulos (PL, PI, Sistemas Lineares).
- **Configuração de Variáveis**: Formulário para adicionar/remover/renomear variáveis.
- **Tela de Modelagem**: Formulário dinâmico para inserir função objetivo e restrições.
- **Workspace de Análise**: Dashboard com abas para Visão Geral, Iterações (Tableau), Gráfico e Dual.

### 5.2 Interfaces de Software
- **Importação de Arquivo**: O sistema aceita arquivos `.txt` ou `.json` no formato TORA ou formato JSON personalizado para definições de problemas.
- **API**: Endpoints RESTful em `/api/solve` para processamento de solicitações de otimização.

---

## 6. Atributos de Qualidade

### 6.1 Usabilidade
- A interface deve ser intuitiva, utilizando ícones padrão (Lucide React) e rótulos claros.
- Mensagens de erro devem ser descritivas (ex: "Solução Ilimitada", "Inviável").

### 6.2 Desempenho
- O algoritmo Simplex deve executar em menos de 2 segundos para problemas com $<50$ variáveis/restrições em hardware padrão.
- A UI deve permanecer responsiva durante os cálculos.

### 6.3 Confiabilidade
- O solucionador deve lidar com casos extremos (degenerescência, soluções ilimitadas) graciosamente sem travar.
- As entradas de dados devem ser validadas para prevenir injeção de SQL ou erros numéricos (NaN).