"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeakCache = exports.createCache = exports.createCacheWith = void 0;
function createCacheWith(cache, mapper) {
    return {
        cache,
        get(key) {
            const cacheHit = this.cache.get(key);
            if (cacheHit) {
                return cacheHit;
            }
            const value = mapper(key);
            this.cache.set(key, value);
            return value;
        },
    };
}
exports.createCacheWith = createCacheWith;
function createCache(mapper) {
    return createCacheWith(new Map(), mapper);
}
exports.createCache = createCache;
function createWeakCache(mapper) {
    return createCacheWith(new WeakMap(), mapper);
}
exports.createWeakCache = createWeakCache;
