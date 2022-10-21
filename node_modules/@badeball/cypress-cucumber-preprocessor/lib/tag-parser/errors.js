"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagParserError = exports.TagTokenizerError = exports.TagError = void 0;
class TagError extends Error {
}
exports.TagError = TagError;
class TagTokenizerError extends TagError {
}
exports.TagTokenizerError = TagTokenizerError;
class TagParserError extends TagError {
}
exports.TagParserError = TagParserError;
