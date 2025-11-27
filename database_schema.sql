-- Schema para o Vector Otimizador
-- Banco de Dados: PostgreSQL (Recomendado) ou MySQL
CREATE DATABASE vector_otimizador;
USE vector_otimizador;

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variables (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    variable_index INTEGER NOT NULL -- Ordem da variável (x1, x2...)
);

CREATE TABLE constraints (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    sign VARCHAR(5) NOT NULL CHECK (sign IN ('<=', '>=', '=')),
    rhs NUMERIC NOT NULL,
    constraint_index INTEGER NOT NULL
);

CREATE TABLE constraint_coefficients (
    id SERIAL PRIMARY KEY,
    constraint_id INTEGER REFERENCES constraints(id) ON DELETE CASCADE,
    variable_id INTEGER REFERENCES variables(id) ON DELETE CASCADE,
    coefficient NUMERIC NOT NULL
);

CREATE TABLE objective_function (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('MAX', 'MIN')),
    variable_id INTEGER REFERENCES variables(id) ON DELETE CASCADE,
    coefficient NUMERIC NOT NULL
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    z_value NUMERIC,
    status VARCHAR(50),
    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_project_vars ON variables(project_id);
CREATE INDEX idx_project_constraints ON constraints(project_id);