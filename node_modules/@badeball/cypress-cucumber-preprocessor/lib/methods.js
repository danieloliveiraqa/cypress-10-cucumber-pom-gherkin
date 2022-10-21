"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.After = exports.Before = exports.defineParameterType = exports.Step = exports.defineStep = exports.Then = exports.When = exports.Given = exports.doesFeatureMatch = exports.isFeature = exports.NOT_FEATURE_ERROR = exports.attach = void 0;
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const base64_js_1 = require("base64-js");
const assertions_1 = require("./assertions");
const ast_helpers_1 = require("./ast-helpers");
const constants_1 = require("./constants");
const registry_1 = require("./registry");
function defineStep(description, implementation) {
    (0, registry_1.getRegistry)().defineStep(description, implementation);
}
exports.Given = defineStep;
exports.When = defineStep;
exports.Then = defineStep;
exports.defineStep = defineStep;
function runStepDefininition(world, text, argument) {
    (0, registry_1.getRegistry)().runStepDefininition(world, text, argument);
}
exports.Step = runStepDefininition;
function defineParameterType(options) {
    (0, registry_1.getRegistry)().defineParameterType(options);
}
exports.defineParameterType = defineParameterType;
function defineBefore(optionsOrFn, maybeFn) {
    if (typeof optionsOrFn === "function") {
        (0, registry_1.getRegistry)().defineBefore({}, optionsOrFn);
    }
    else if (typeof optionsOrFn === "object" && typeof maybeFn === "function") {
        (0, registry_1.getRegistry)().defineBefore(optionsOrFn, maybeFn);
    }
    else {
        throw new Error("Unexpected argument for Before hook");
    }
}
exports.Before = defineBefore;
function defineAfter(optionsOrFn, maybeFn) {
    if (typeof optionsOrFn === "function") {
        (0, registry_1.getRegistry)().defineAfter({}, optionsOrFn);
    }
    else if (typeof optionsOrFn === "object" && typeof maybeFn === "function") {
        (0, registry_1.getRegistry)().defineAfter(optionsOrFn, maybeFn);
    }
    else {
        throw new Error("Unexpected argument for After hook");
    }
}
exports.After = defineAfter;
function createStringAttachment(data, mediaType, encoding) {
    cy.task(constants_1.TASK_CREATE_STRING_ATTACHMENT, {
        data,
        mediaType,
        encoding,
    });
}
function attach(data, mediaType) {
    if (typeof data === "string") {
        mediaType = mediaType !== null && mediaType !== void 0 ? mediaType : "text/plain";
        if (mediaType.startsWith("base64:")) {
            createStringAttachment(data, mediaType.replace("base64:", ""), "BASE64");
        }
        else {
            createStringAttachment(data, mediaType !== null && mediaType !== void 0 ? mediaType : "text/plain", "IDENTITY");
        }
    }
    else if (data instanceof ArrayBuffer) {
        if (typeof mediaType !== "string") {
            throw Error("ArrayBuffer attachments must specify a media type");
        }
        createStringAttachment((0, base64_js_1.fromByteArray)(new Uint8Array(data)), mediaType, "BASE64");
    }
    else {
        throw Error("Invalid attachment data: must be a ArrayBuffer or string");
    }
}
exports.attach = attach;
function isFeature() {
    return Cypress.env(constants_1.INTERNAL_SPEC_PROPERTIES) != null;
}
exports.isFeature = isFeature;
exports.NOT_FEATURE_ERROR = "Expected to find internal properties, but didn't. This is likely because you're calling doesFeatureMatch() in a non-feature spec. Use doesFeatureMatch() in combination with isFeature() if you have both feature and non-feature specs";
function doesFeatureMatch(expression) {
    const { pickle } = (0, assertions_1.assertAndReturn)(Cypress.env(constants_1.INTERNAL_SPEC_PROPERTIES), exports.NOT_FEATURE_ERROR);
    return (0, tag_expressions_1.default)(expression).evaluate((0, ast_helpers_1.collectTagNames)(pickle.tags));
}
exports.doesFeatureMatch = doesFeatureMatch;
