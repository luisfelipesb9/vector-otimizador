type Matrix = number[][];

interface SimplexResult {
  solution: number[];
  Z: number;
}

export class SimplexSolver {
  private c: number[];
  private A: Matrix;
  private b: number[];
  private numConstraints: number;
  private numVariables: number;
  private tableau: Matrix;

  constructor(c: number[], A: Matrix, b: number[]) {
    this.c = c;
    this.A = A;
    this.b = b;

    this.numConstraints = A.length;
    this.numVariables = c.length;

    this.tableau = this.buildTableau();
  }

  /** Monta o tableau inicial (com variáveis de folga) */
  private buildTableau(): Matrix {
    const tableau: Matrix = [];

    // Adiciona restrições + variáveis de folga
    for (let i = 0; i < this.numConstraints; i++) {
      const row = [...this.A[i]];
      const slack = Array(this.numConstraints).fill(0);
      slack[i] = 1;
      tableau.push([...row, ...slack, this.b[i]]);
    }

    // Linha da função objetivo (negativa)
    const zRow = [
      ...this.c.map(v => -v),
      ...Array(this.numConstraints).fill(0),
      0,
    ];
    tableau.push(zRow);

    return tableau;
  }

  /** Verifica se o tableau está ótimo */
  private isOptimal(): boolean {
    const lastRow = this.tableau[this.tableau.length - 1];
    return lastRow.slice(0, -1).every(v => v >= 0);
  }

  /** Encontra a coluna pivô (variável que entra na base) */
  private getPivotColumn(): number {
    const lastRow = this.tableau[this.tableau.length - 1];
    let minVal = 0;
    let pivotCol = -1;

    for (let j = 0; j < lastRow.length - 1; j++) {
      if (lastRow[j] < minVal) {
        minVal = lastRow[j];
        pivotCol = j;
      }
    }

    return pivotCol;
  }

  /** Encontra a linha pivô (variável que sai da base) */
  private getPivotRow(pivotCol: number): number {
    const ratios: number[] = [];

    for (let i = 0; i < this.numConstraints; i++) {
      const val = this.tableau[i][pivotCol];
      if (val > 0) {
        ratios.push(this.tableau[i][this.tableau[i].length - 1] / val);
      } else {
        ratios.push(Infinity);
      }
    }

    const minRatio = Math.min(...ratios);
    if (minRatio === Infinity) return -1; // Solução ilimitada

    return ratios.indexOf(minRatio);
  }

  /** Executa a operação de pivotamento */
  private pivot(pivotRow: number, pivotCol: number): void {
    const pivotVal = this.tableau[pivotRow][pivotCol];

    // Normaliza linha pivô
    for (let j = 0; j < this.tableau[pivotRow].length; j++) {
      this.tableau[pivotRow][j] /= pivotVal;
    }

    // Zera os outros valores da coluna pivô
    for (let i = 0; i < this.tableau.length; i++) {
      if (i !== pivotRow) {
        const factor = this.tableau[i][pivotCol];
        for (let j = 0; j < this.tableau[i].length; j++) {
          this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
        }
      }
    }
  }

  /** Resolve o problema pelo método Simplex */
  public solve(): SimplexResult {
    while (!this.isOptimal()) {
      const pivotCol = this.getPivotColumn();
      if (pivotCol === -1) break;

      const pivotRow = this.getPivotRow(pivotCol);
      if (pivotRow === -1) throw new Error("Solução ilimitada.");

      this.pivot(pivotRow, pivotCol);
    }

    return this.extractSolution();
  }

  /** Extrai o resultado final (valores das variáveis e valor ótimo de Z) */
  private extractSolution(): SimplexResult {
    const numCols = this.numVariables + this.numConstraints;
    const result = Array(this.numVariables).fill(0);

    for (let j = 0; j < this.numVariables; j++) {
      const col = this.tableau.map(row => row[j]);
      const oneCount = col.filter(v => Math.abs(v - 1) < 1e-9).length;
      const zeroCount = col.filter(v => Math.abs(v) < 1e-9).length;

      if (oneCount === 1 && zeroCount === this.numConstraints - 1) {
        const oneRow = col.indexOf(1);
        result[j] = this.tableau[oneRow][this.tableau[0].length - 1];
      }
    }

    const Z = this.tableau[this.tableau.length - 1][this.tableau[0].length - 1];
    return { solution: result, Z };
  }
}

/*
// Exemplo de uso:
const c = [3, 5]; // Max Z = 3x1 + 5x2
const A = [
  [2, 3],
  [4, 1],
  [3, 2],
];
const b = [8, 8, 6];

const solver = new SimplexSolver(c, A, b);
const result = solver.solve();

console.log("Solução:", result.solution);
console.log("Valor ótimo de Z:", result.Z);
*/