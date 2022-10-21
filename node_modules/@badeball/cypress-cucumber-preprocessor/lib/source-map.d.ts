export interface Position {
    line: number;
    column: number;
    source: string;
}
export declare function retrievePositionFromSourceMap(): Position;
export declare function maybeRetrievePositionFromSourceMap(experimentalSourceMap: boolean): Position | undefined;
