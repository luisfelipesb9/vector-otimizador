export interface ParsedProblem {
    title: string;
    type: 'MAX' | 'MIN';
    numVars: number;
    numConstraints: number;
    objective: number[];
    constraints: {
        coeffs: number[];
        sign: '<=' | '>=' | '=';
        rhs: number;
    }[];
}

export const parseToraFile = (content: string): ParsedProblem => {
    // 1. Clean up the content: remove quotes, split by lines, filter empty/whitespace
    const tokens = content
        .split(/\r?\n/)
        .map(line => line.trim().replace(/^"|"$/g, '')) // Remove surrounding quotes
        .filter(line => line !== '' && line !== '""'); // Filter empty lines

    // Helper to consume tokens
    let current = 0;
    const next = () => {
        if (current >= tokens.length) return null;
        return tokens[current++];
    };

    // Skip header magic numbers (3000, 5, 2, 1)
    // Based on user example:
    // 3000
    // 5
    // 2
    // 1
    // "Title"
    // 2 (vars)
    // 3 (constraints)
    // "Minimize"

    // Let's try to find the title. It's usually the first non-numeric string or the 5th token.
    // But let's strictly follow the example structure.

    // Skip first 4 tokens
    next(); // 3000
    next(); // 5
    next(); // 2
    next(); // 1

    const title = next() || "Sem Título";
    const numVarsStr = next();
    const numConstraintsStr = next();
    const typeStr = next();

    if (!numVarsStr || !numConstraintsStr || !typeStr) {
        throw new Error("Formato de arquivo inválido (cabeçalho incompleto).");
    }

    const numVars = parseInt(numVarsStr);
    const numConstraints = parseInt(numConstraintsStr);
    const type = typeStr.toLowerCase().includes('min') ? 'MIN' : 'MAX';

    // Parse Objective Function
    // The example has some empty lines in between, but we filtered them out.
    // Expect numVars coefficients.
    const objective: number[] = [];
    for (let i = 0; i < numVars; i++) {
        const val = next();
        if (!val) throw new Error("Coeficiente da função objetivo faltando.");
        objective.push(parseFloat(val.replace(',', '.')));
    }

    // Parse Constraints
    // Each constraint has: numVars coeffs + sign + rhs
    const constraints = [];
    for (let i = 0; i < numConstraints; i++) {
        const coeffs: number[] = [];
        for (let j = 0; j < numVars; j++) {
            const val = next();
            if (!val) throw new Error(`Coeficiente da restrição ${i + 1} faltando.`);
            coeffs.push(parseFloat(val.replace(',', '.')));
        }

        const signToken = next();
        const rhsToken = next();

        if (!signToken || !rhsToken) throw new Error(`Sinal ou RHS da restrição ${i + 1} faltando.`);

        let sign: '<=' | '>=' | '=' = '<=';
        if (signToken.includes('<')) sign = '<=';
        else if (signToken.includes('>')) sign = '>=';
        else if (signToken.includes('=')) sign = '=';

        const rhs = parseFloat(rhsToken.replace(',', '.'));

        constraints.push({ coeffs, sign, rhs });
    }

    return {
        title,
        type,
        numVars,
        numConstraints,
        objective,
        constraints
    };
};
