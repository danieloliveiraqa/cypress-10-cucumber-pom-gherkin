"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = exports.stripIndent = exports.minIndent = void 0;
function minIndent(content) {
    const match = content.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
        return 0;
    }
    return match.reduce((r, a) => Math.min(r, a.length), Infinity);
}
exports.minIndent = minIndent;
function stripIndent(content) {
    const indent = minIndent(content);
    if (indent === 0) {
        return content;
    }
    const regex = new RegExp(`^[ \\t]{${indent}}`, "gm");
    return content.replace(regex, "");
}
exports.stripIndent = stripIndent;
function indent(string, options = {}) {
    const { count = 1, indent = " ", includeEmptyLines = false } = options;
    if (count === 0) {
        return string;
    }
    const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    return string.replace(regex, indent.repeat(count));
}
exports.indent = indent;
