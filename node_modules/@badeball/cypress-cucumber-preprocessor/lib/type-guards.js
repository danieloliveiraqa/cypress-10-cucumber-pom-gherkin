"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notNull = exports.isStringOrStringArray = exports.isStringOrFalse = exports.isFalse = exports.isBoolean = exports.isString = void 0;
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
function isBoolean(value) {
    return typeof value === "boolean";
}
exports.isBoolean = isBoolean;
function isFalse(value) {
    return value === false;
}
exports.isFalse = isFalse;
function isStringOrFalse(value) {
    return isString(value) || isFalse(value);
}
exports.isStringOrFalse = isStringOrFalse;
function isStringOrStringArray(value) {
    return (typeof value === "string" || (Array.isArray(value) && value.every(isString)));
}
exports.isStringOrStringArray = isStringOrStringArray;
function notNull(value) {
    return value != null;
}
exports.notNull = notNull;
