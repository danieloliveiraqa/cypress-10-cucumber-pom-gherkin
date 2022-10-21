"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = exports.isEqual = exports.isComma = exports.isDigit = exports.isQuote = exports.isWordChar = exports.isClosingParanthesis = exports.isOpeningParanthesis = exports.isAt = void 0;
const errors_1 = require("./errors");
const isAt = (char) => char === "@";
exports.isAt = isAt;
const isOpeningParanthesis = (char) => char === "(";
exports.isOpeningParanthesis = isOpeningParanthesis;
const isClosingParanthesis = (char) => char === ")";
exports.isClosingParanthesis = isClosingParanthesis;
const isWordChar = (char) => /[a-zA-Z]/.test(char);
exports.isWordChar = isWordChar;
const isQuote = (char) => char === '"' || char === "'";
exports.isQuote = isQuote;
const isDigit = (char) => /[0-9]/.test(char);
exports.isDigit = isDigit;
const isComma = (char) => char === ",";
exports.isComma = isComma;
const isEqual = (char) => char === "=";
exports.isEqual = isEqual;
class Tokenizer {
    constructor(content) {
        this.content = content;
    }
    *tokens() {
        let position = 0;
        while (position < this.content.length) {
            const curchar = this.content[position];
            if ((0, exports.isAt)(curchar) ||
                (0, exports.isOpeningParanthesis)(curchar) ||
                (0, exports.isClosingParanthesis)(curchar) ||
                (0, exports.isComma)(curchar) ||
                (0, exports.isEqual)(curchar)) {
                yield {
                    value: curchar,
                    position,
                };
                position++;
            }
            else if ((0, exports.isDigit)(curchar)) {
                const start = position;
                while ((0, exports.isDigit)(this.content[position]) &&
                    position < this.content.length) {
                    position++;
                }
                yield {
                    value: this.content.slice(start, position),
                    position: start,
                };
            }
            else if ((0, exports.isWordChar)(curchar)) {
                const start = position;
                while ((0, exports.isWordChar)(this.content[position]) &&
                    position < this.content.length) {
                    position++;
                }
                yield {
                    value: this.content.slice(start, position),
                    position: start,
                };
            }
            else if ((0, exports.isQuote)(curchar)) {
                const start = position++;
                while (!(0, exports.isQuote)(this.content[position]) &&
                    position < this.content.length) {
                    position++;
                }
                if (position === this.content.length) {
                    throw new errors_1.TagTokenizerError("Unexpected end-of-string");
                }
                else {
                    position++;
                }
                yield {
                    value: this.content.slice(start, position),
                    position: start,
                };
            }
            else {
                throw new errors_1.TagTokenizerError(`Unknown token at ${position}: ${curchar}`);
            }
        }
    }
}
exports.Tokenizer = Tokenizer;
