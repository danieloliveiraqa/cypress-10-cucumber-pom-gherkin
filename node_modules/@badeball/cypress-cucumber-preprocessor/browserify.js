"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.preprocessor = exports.transform = void 0;
const stream_1 = require("stream");
const browserify_preprocessor_1 = __importDefault(require("@cypress/browserify-preprocessor"));
const debug_1 = __importDefault(require("./lib/debug"));
const template_1 = require("./lib/template");
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return template_1.compile; } });
function transform(configuration, filepath) {
    if (!filepath.match(".feature$")) {
        return new stream_1.PassThrough();
    }
    (0, debug_1.default)(`compiling ${filepath}`);
    let buffer = Buffer.alloc(0);
    return new stream_1.Transform({
        transform(chunk, encoding, done) {
            buffer = Buffer.concat([buffer, chunk]);
            done();
        },
        async flush(done) {
            try {
                done(null, await (0, template_1.compile)(configuration, buffer.toString("utf8"), filepath));
                (0, debug_1.default)(`compiled ${filepath}`);
            }
            catch (e) {
                done(e);
            }
        },
    });
}
exports.transform = transform;
function preprendTransformerToOptions(configuration, options) {
    let wrappedTransform;
    if (!options.browserifyOptions ||
        !Array.isArray(options.browserifyOptions.transform)) {
        wrappedTransform = [transform.bind(null, configuration)];
    }
    else {
        wrappedTransform = [
            transform.bind(null, configuration),
            ...options.browserifyOptions.transform,
        ];
    }
    return Object.assign(Object.assign({}, options), { browserifyOptions: Object.assign(Object.assign({}, (options.browserifyOptions || {})), { transform: wrappedTransform }) });
}
function preprocessor(configuration, options = browserify_preprocessor_1.default.defaultOptions, { prependTransform = true } = {}) {
    if (prependTransform) {
        options = preprendTransformerToOptions(configuration, options);
    }
    return function (file) {
        return (0, browserify_preprocessor_1.default)(options)(file);
    };
}
exports.preprocessor = preprocessor;
exports.default = preprocessor;
