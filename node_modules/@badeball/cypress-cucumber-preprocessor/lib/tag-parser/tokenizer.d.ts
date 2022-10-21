export declare const isAt: (char: string) => boolean;
export declare const isOpeningParanthesis: (char: string) => boolean;
export declare const isClosingParanthesis: (char: string) => boolean;
export declare const isWordChar: (char: string) => boolean;
export declare const isQuote: (char: string) => boolean;
export declare const isDigit: (char: string) => boolean;
export declare const isComma: (char: string) => boolean;
export declare const isEqual: (char: string) => boolean;
export declare class Tokenizer {
    private content;
    constructor(content: string);
    tokens(): Generator<{
        value: string;
        position: number;
    }, void, unknown>;
}
