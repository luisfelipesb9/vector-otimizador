import { Variable } from './Variable';

export interface SimplexResult {
    zValue: number;
    variables: Variable[];
    shadowPrices?: number[];
    iterations?: any[];
    status?: string;
    isMock?: boolean;
    graphData?: { x: number; y: number }[] | null;
}
