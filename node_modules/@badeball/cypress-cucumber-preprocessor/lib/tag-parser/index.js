"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.looksLikeOptions = exports.tagToCypressOptions = void 0;
const parser_1 = __importDefault(require("./parser"));
function tagToCypressOptions(tag) {
    return new parser_1.default(tag).parse();
}
exports.tagToCypressOptions = tagToCypressOptions;
function looksLikeOptions(tag) {
    return tag.includes("(");
}
exports.looksLikeOptions = looksLikeOptions;
