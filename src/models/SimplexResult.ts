import { Variable } from './Variable';

export interface SimplexResult {
    zValue: number;
    variables: Variable[];
    shadowPrices?: number[];
    iterations?: any[];
    status?: string;
    isMock?: boolean;
    graphData?: {
        feasibleRegion: { x: number; y: number }[];
        constraints: { name: string; points: { x: number; y: number }[]; color: string }[];
        optimalPoint: { x: number; y: number; value: number };
    } | null;
}
