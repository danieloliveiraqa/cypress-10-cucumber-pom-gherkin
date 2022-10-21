export declare function createCacheWith<K extends object, V>(cache: {
    get(key: K): V | undefined;
    set(key: K, value: V | undefined): void;
}, mapper: (key: K) => V): {
    cache: {
        get(key: K): V | undefined;
        set(key: K, value: V | undefined): void;
    };
    get(key: K): V;
};
export declare function createCache<K extends object, V>(mapper: (key: K) => V): {
    cache: {
        get(key: K): V | undefined;
        set(key: K, value: V | undefined): void;
    };
    get(key: K): V;
};
export declare function createWeakCache<K extends object, V>(mapper: (key: K) => V): {
    cache: {
        get(key: K): V | undefined;
        set(key: K, value: V | undefined): void;
    };
    get(key: K): V;
};
