"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const preprocessor_configuration_1 = require("./preprocessor-configuration");
const DUMMY_POST10_CONFIG = {
    projectRoot: "",
    specPattern: [],
    excludeSpecPattern: [],
    env: {},
};
describe("resolve()", () => {
    it("overriding stepDefinitions", async () => {
        const { stepDefinitions } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { stepDefinitions: "foo/bar/**" }, "/", () => null);
        assert_1.default.strictEqual(stepDefinitions, "foo/bar/**");
    });
    it("overriding messages.enabled (1)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: "" }, "/", () => ({
            messages: { enabled: true },
        }));
        assert_1.default.strictEqual(enabled, true);
    });
    it("overriding messages.enabled (2)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: "true" }, "/", () => ({
            messages: { enabled: false },
        }));
        assert_1.default.strictEqual(enabled, true);
    });
    it("overriding messages.enabled (3)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: "foobar" }, "/", () => ({
            messages: { enabled: false },
        }));
        assert_1.default.strictEqual(enabled, true);
    });
    it("overriding messages.enabled (4)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: true }, "/", () => ({
            messages: { enabled: false },
        }));
        assert_1.default.strictEqual(enabled, true);
    });
    it("overriding messages.enabled (5)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: "false" }, "/", () => ({
            messages: { enabled: true },
        }));
        assert_1.default.strictEqual(enabled, false);
    });
    it("overriding messages.enabled (6)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: "false" }, "/", () => ({
            messages: { enabled: true },
        }));
        assert_1.default.strictEqual(enabled, false);
    });
    it("overriding messages.enabled (7)", async () => {
        const { messages: { enabled }, } = await (0, preprocessor_configuration_1.resolve)(DUMMY_POST10_CONFIG, { messagesEnabled: false }, "/", () => ({
            messages: { enabled: true },
        }));
        assert_1.default.strictEqual(enabled, false);
    });
});
