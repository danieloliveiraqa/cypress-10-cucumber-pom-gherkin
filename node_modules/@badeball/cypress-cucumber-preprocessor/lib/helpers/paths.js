"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureIsRelative = exports.ensureIsAbsolute = void 0;
const path_1 = __importDefault(require("path"));
function ensureIsAbsolute(root, maybeRelativePath) {
    if (path_1.default.isAbsolute(maybeRelativePath)) {
        return maybeRelativePath;
    }
    else {
        return path_1.default.join(root, maybeRelativePath);
    }
}
exports.ensureIsAbsolute = ensureIsAbsolute;
function ensureIsRelative(root, maybeRelativePath) {
    if (path_1.default.isAbsolute(maybeRelativePath)) {
        return path_1.default.relative(root, maybeRelativePath);
    }
    else {
        return maybeRelativePath;
    }
}
exports.ensureIsRelative = ensureIsRelative;
