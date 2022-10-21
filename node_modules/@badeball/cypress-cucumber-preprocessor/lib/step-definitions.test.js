"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const assert_1 = __importDefault(require("assert"));
const preprocessor_configuration_1 = require("./preprocessor-configuration");
const step_definitions_1 = require("./step-definitions");
const DUMMY_PRE10_CONFIG = {
    projectRoot: "",
    integrationFolder: "",
    fixturesFolder: "",
    supportFile: false,
    testFiles: [],
    ignoreTestFiles: [],
    env: {},
};
function pre10example(filepath, partialCypressConfiguration, preprocessorConfiguration, expected) {
    const cypressConfiguration = Object.assign(Object.assign({}, DUMMY_PRE10_CONFIG), partialCypressConfiguration);
    it(`should return [${expected.join(", ")}] for ${filepath} with ${util_1.default.inspect(preprocessorConfiguration)} in ${cypressConfiguration.projectRoot}`, () => {
        const actual = (0, step_definitions_1.getStepDefinitionPatternsPre10)({
            cypress: cypressConfiguration,
            preprocessor: new preprocessor_configuration_1.PreprocessorConfiguration(preprocessorConfiguration, {}, cypressConfiguration, path_1.default.dirname(filepath)),
        }, filepath);
        const throwUnequal = () => {
            throw new Error(`Expected ${util_1.default.inspect(expected)}, but got ${util_1.default.inspect(actual)}`);
        };
        if (expected.length !== actual.length) {
            throwUnequal();
        }
        for (let i = 0; i < expected.length; i++) {
            if (expected[i] !== actual[i]) {
                throwUnequal();
            }
        }
    });
}
const DUMMY_POST10_CONFIG = {
    projectRoot: "",
    specPattern: [],
    excludeSpecPattern: [],
    env: {},
};
function post10example(filepath, partialCypressConfiguration, preprocessorConfiguration, implicitIntegrationFolder, expected) {
    const cypressConfiguration = Object.assign(Object.assign({}, DUMMY_POST10_CONFIG), partialCypressConfiguration);
    it(`should return [${expected.join(", ")}] for ${filepath} with ${util_1.default.inspect(preprocessorConfiguration)} in ${cypressConfiguration.projectRoot}`, () => {
        const actual = (0, step_definitions_1.getStepDefinitionPatternsPost10)({
            cypress: cypressConfiguration,
            preprocessor: new preprocessor_configuration_1.PreprocessorConfiguration(preprocessorConfiguration, {}, cypressConfiguration, implicitIntegrationFolder),
        }, filepath);
        const throwUnequal = () => {
            throw new Error(`Expected ${util_1.default.inspect(expected)}, but got ${util_1.default.inspect(actual)}`);
        };
        if (expected.length !== actual.length) {
            throwUnequal();
        }
        for (let i = 0; i < expected.length; i++) {
            if (expected[i] !== actual[i]) {
                throwUnequal();
            }
        }
    });
}
describe("pathParts()", () => {
    const relativePath = "foo/bar/baz";
    const expectedParts = ["foo/bar/baz", "foo/bar", "foo"];
    it(`should return ${util_1.default.inspect(expectedParts)} for ${util_1.default.inspect(relativePath)}`, () => {
        assert_1.default.deepStrictEqual((0, step_definitions_1.pathParts)(relativePath), expectedParts);
    });
});
describe("getStepDefinitionPatternsPre10()", () => {
    pre10example("/foo/bar/cypress/integration/baz.feature", {
        projectRoot: "/foo/bar",
        integrationFolder: "cypress/integration",
    }, {}, [
        "/foo/bar/cypress/integration/baz/**/*.{js,mjs,ts,tsx}",
        "/foo/bar/cypress/integration/baz.{js,mjs,ts,tsx}",
        "/foo/bar/cypress/support/step_definitions/**/*.{js,mjs,ts,tsx}",
    ]);
    pre10example("/cypress/integration/foo/bar/baz.feature", {
        projectRoot: "/",
        integrationFolder: "cypress/integration",
    }, {
        stepDefinitions: "cypress/integration/[filepath]/step_definitions/*.ts",
    }, ["/cypress/integration/foo/bar/baz/step_definitions/*.ts"]);
    pre10example("/cypress/integration/foo/bar/baz.feature", {
        projectRoot: "/",
        integrationFolder: "cypress/integration",
    }, {
        stepDefinitions: "cypress/integration/[filepart]/step_definitions/*.ts",
    }, [
        "/cypress/integration/foo/bar/baz/step_definitions/*.ts",
        "/cypress/integration/foo/bar/step_definitions/*.ts",
        "/cypress/integration/foo/step_definitions/*.ts",
        "/cypress/integration/step_definitions/*.ts",
    ]);
    it("should error when provided a path not within integrationFolder", () => {
        assert_1.default.throws(() => {
            (0, step_definitions_1.getStepDefinitionPatternsPre10)({
                cypress: {
                    projectRoot: "/foo/bar",
                    integrationFolder: "cypress/integration",
                },
                preprocessor: {
                    stepDefinitions: [],
                    implicitIntegrationFolder: "/foo/bar/cypress/integration",
                },
            }, "/foo/bar/cypress/features/baz.feature");
        }, "/foo/bar/cypress/features/baz.feature is not within cypress/integration");
    });
    it("should error when provided a path not within cwd", () => {
        assert_1.default.throws(() => {
            (0, step_definitions_1.getStepDefinitionPatternsPre10)({
                cypress: {
                    projectRoot: "/baz",
                    integrationFolder: "cypress/integration",
                },
                preprocessor: {
                    stepDefinitions: [],
                    implicitIntegrationFolder: "/foo/bar/cypress/integration",
                },
            }, "/foo/bar/cypress/integration/baz.feature");
        }, "/foo/bar/cypress/features/baz.feature is not within /baz");
    });
});
describe("getStepDefinitionPatternsPost10()", () => {
    post10example("/foo/bar/cypress/e2e/baz.feature", {
        projectRoot: "/foo/bar",
    }, {}, "/foo/bar/cypress/e2e", [
        "/foo/bar/cypress/e2e/baz/**/*.{js,mjs,ts,tsx}",
        "/foo/bar/cypress/e2e/baz.{js,mjs,ts,tsx}",
        "/foo/bar/cypress/support/step_definitions/**/*.{js,mjs,ts,tsx}",
    ]);
    post10example("/cypress/e2e/foo/bar/baz.feature", {
        projectRoot: "/",
    }, {
        stepDefinitions: "/cypress/e2e/[filepath]/step_definitions/*.ts",
    }, "/cypress/e2e", ["/cypress/e2e/foo/bar/baz/step_definitions/*.ts"]);
    post10example("/cypress/e2e/foo/bar/baz.feature", {
        projectRoot: "/",
    }, {
        stepDefinitions: "/cypress/e2e/[filepart]/step_definitions/*.ts",
    }, "/cypress/e2e", [
        "/cypress/e2e/foo/bar/baz/step_definitions/*.ts",
        "/cypress/e2e/foo/bar/step_definitions/*.ts",
        "/cypress/e2e/foo/step_definitions/*.ts",
        "/cypress/e2e/step_definitions/*.ts",
    ]);
    it("should error when provided a path not within cwd", () => {
        assert_1.default.throws(() => {
            (0, step_definitions_1.getStepDefinitionPatternsPost10)({
                cypress: {
                    projectRoot: "/baz",
                },
                preprocessor: {
                    stepDefinitions: [],
                    implicitIntegrationFolder: "/foo/bar/cypress/e2e",
                },
            }, "/foo/bar/cypress/e2e/baz.feature");
        }, "/foo/bar/cypress/features/baz.feature is not within /baz");
    });
});
