export declare function minIndent(content: string): number;
export declare function stripIndent(content: string): string;
export declare function indent(string: string, options?: {
    count?: number;
    indent?: string;
    includeEmptyLines?: boolean;
}): string;
