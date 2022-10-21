export declare function isString(value: unknown): value is string;
export declare function isBoolean(value: unknown): value is boolean;
export declare function isFalse(value: unknown): value is false;
export declare function isStringOrFalse(value: unknown): value is string | false;
export declare function isStringOrStringArray(value: unknown): value is string | string[];
export declare function notNull<T>(value: T | null | undefined): value is T;
