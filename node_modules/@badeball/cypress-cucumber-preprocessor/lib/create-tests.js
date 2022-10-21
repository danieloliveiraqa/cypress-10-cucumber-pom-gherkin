"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const uuid_1 = require("uuid");
const assertions_1 = require("./assertions");
const data_table_1 = __importDefault(require("./data_table"));
const registry_1 = require("./registry");
const ast_helpers_1 = require("./ast-helpers");
const constants_1 = require("./constants");
const environment_helpers_1 = require("./environment-helpers");
const type_guards_1 = require("./type-guards");
const tag_parser_1 = require("./tag-parser");
const messages_helpers_1 = require("./messages-helpers");
const maps_1 = require("./helpers/maps");
const strings_1 = require("./helpers/strings");
const snippets_1 = require("./snippets");
/**
 * From messages.TestStepFinished.TestStepResult.Status.
 */
const Status = {
    Unknown: "UNKNOWN",
    Passed: "PASSED",
    Skipped: "SKIPPED",
    Pending: "PENDING",
    Undefined: "UNDEFINED",
    Ambiguous: "AMBIGUOUS",
    Failed: "FAILED",
};
const sourceReference = {
    uri: "not available",
    location: { line: 0 },
};
function retrieveInternalSpecProperties() {
    return Cypress.env(constants_1.INTERNAL_SPEC_PROPERTIES);
}
function retrieveInternalSuiteProperties() {
    return Cypress.env(constants_1.INTERNAL_SUITE_PROPERTIES);
}
function findPickleById(context, astId) {
    return (0, assertions_1.assertAndReturn)(context.pickles.find((pickle) => pickle.astNodeIds && pickle.astNodeIds.includes(astId)), `Expected to find a pickle associated with id = ${astId}`);
}
function collectExampleIds(examples) {
    return examples
        .map((examples) => {
        return (0, assertions_1.assertAndReturn)(examples.tableBody, "Expected to find a table body").map((row) => (0, assertions_1.assertAndReturn)(row.id, "Expected table row to have an id"));
    })
        .reduce((acum, el) => acum.concat(el), []);
}
function createFeature(context, feature) {
    describe(feature.name || "<unamed feature>", () => {
        if (feature.children) {
            for (const child of feature.children) {
                if (child.scenario) {
                    createScenario(context, child.scenario);
                }
                else if (child.rule) {
                    createRule(context, child.rule);
                }
            }
        }
    });
}
function createRule(context, rule) {
    var _a;
    const picklesWithinRule = (_a = rule.children) === null || _a === void 0 ? void 0 : _a.map((child) => child.scenario).filter(type_guards_1.notNull).flatMap((scenario) => {
        if (scenario.examples.length > 0) {
            return collectExampleIds(scenario.examples).map((exampleId) => {
                return findPickleById(context, exampleId);
            });
        }
        else {
            const scenarioId = (0, assertions_1.assertAndReturn)(scenario.id, "Expected scenario to have an id");
            return findPickleById(context, scenarioId);
        }
    });
    if (picklesWithinRule) {
        if (context.omitFiltered) {
            const matches = picklesWithinRule.filter((pickle) => context.testFilter.evaluate((0, ast_helpers_1.collectTagNames)(pickle.tags)));
            if (matches.length === 0) {
                return;
            }
        }
    }
    describe(rule.name || "<unamed rule>", () => {
        if (rule.children) {
            for (const child of rule.children) {
                if (child.scenario) {
                    createScenario(context, child.scenario);
                }
            }
        }
    });
}
const gherkinDocumentsAstIdMaps = (0, maps_1.createWeakCache)(ast_helpers_1.createAstIdMap);
function createScenario(context, scenario) {
    if (scenario.examples.length > 0) {
        const exampleIds = collectExampleIds(scenario.examples);
        for (let i = 0; i < exampleIds.length; i++) {
            const exampleId = exampleIds[i];
            const pickle = findPickleById(context, exampleId);
            const baseName = pickle.name || "<unamed scenario>";
            const exampleName = `${baseName} (example #${i + 1})`;
            createPickle(context, Object.assign(Object.assign({}, scenario), { name: exampleName }), pickle);
        }
    }
    else {
        const scenarioId = (0, assertions_1.assertAndReturn)(scenario.id, "Expected scenario to have an id");
        const pickle = findPickleById(context, scenarioId);
        createPickle(context, scenario, pickle);
    }
}
function createPickle(context, scenario, pickle) {
    var _a;
    const { registry, gherkinDocument, pickles, testFilter, messages } = context;
    const testCaseId = (0, uuid_1.v4)();
    const pickleSteps = (_a = pickle.steps) !== null && _a !== void 0 ? _a : [];
    const scenarioName = scenario.name || "<unamed scenario>";
    const tags = (0, ast_helpers_1.collectTagNames)(pickle.tags);
    const beforeHooks = registry.resolveBeforeHooks(tags);
    const afterHooks = registry.resolveAfterHooks(tags);
    const definitionIds = pickleSteps.map(() => (0, uuid_1.v4)());
    const steps = [
        ...beforeHooks.map((hook) => ({ hook })),
        ...pickleSteps.map((pickleStep) => ({ pickleStep })),
        ...afterHooks.map((hook) => ({ hook })),
    ];
    for (const id of definitionIds) {
        messages.stack.push({
            stepDefinition: {
                id,
                pattern: {
                    source: "a step",
                    type: "CUCUMBER_EXPRESSION",
                },
                sourceReference,
            },
        });
    }
    const testSteps = [];
    for (const beforeHook of beforeHooks) {
        testSteps.push({
            id: beforeHook.id,
            hookId: beforeHook.id,
        });
    }
    for (let i = 0; i < pickleSteps.length; i++) {
        const step = pickleSteps[i];
        testSteps.push({
            id: step.id,
            pickleStepId: step.id,
            stepDefinitionIds: [definitionIds[i]],
        });
    }
    for (const afterHook of afterHooks) {
        testSteps.push({
            id: afterHook.id,
            hookId: afterHook.id,
        });
    }
    messages.stack.push({
        testCase: {
            id: testCaseId,
            pickleId: pickle.id,
            testSteps,
        },
    });
    const astIdMap = gherkinDocumentsAstIdMaps.get(gherkinDocument);
    if (!testFilter.evaluate(tags) || tags.includes("@skip")) {
        if (!context.omitFiltered) {
            it.skip(scenarioName);
        }
        return;
    }
    let attempt = 0;
    const internalProperties = {
        pickle,
        testCaseStartedId: (0, uuid_1.v4)(),
        allSteps: steps,
        remainingSteps: [...steps],
    };
    const internalEnv = { [constants_1.INTERNAL_SPEC_PROPERTIES]: internalProperties };
    const suiteOptions = tags
        .filter(tag_parser_1.looksLikeOptions)
        .map(tag_parser_1.tagToCypressOptions)
        .reduce(Object.assign, {});
    if (suiteOptions.env) {
        Object.assign(suiteOptions.env, internalEnv);
    }
    else {
        suiteOptions.env = internalEnv;
    }
    it(scenarioName, suiteOptions, function () {
        var _a, _b, _c, _d, _e;
        const { remainingSteps, testCaseStartedId } = retrieveInternalSpecProperties();
        (0, registry_1.assignRegistry)(registry);
        messages.stack.push({
            testCaseStarted: {
                id: testCaseStartedId,
                testCaseId,
                attempt: attempt++,
                timestamp: (0, messages_helpers_1.createTimestamp)(),
            },
        });
        window.testState = {
            gherkinDocument,
            pickles,
            pickle,
        };
        for (const step of steps) {
            if (step.hook) {
                const hook = step.hook;
                cy.then(() => {
                    delete window.testState.pickleStep;
                    Cypress.log({
                        name: "step",
                        displayName: hook.keyword,
                        message: "",
                    });
                    const start = (0, messages_helpers_1.createTimestamp)();
                    messages.stack.push({
                        testStepStarted: {
                            testStepId: hook.id,
                            testCaseStartedId,
                            timestamp: start,
                        },
                    });
                    if (messages.enabled) {
                        cy.task(constants_1.TASK_TEST_STEP_STARTED, hook.id, { log: false });
                    }
                    return cy.wrap(start, { log: false });
                })
                    .then((start) => {
                    registry.runHook(this, hook);
                    return cy.wrap(start, { log: false });
                })
                    .then((start) => {
                    const end = (0, messages_helpers_1.createTimestamp)();
                    messages.stack.push({
                        testStepFinished: {
                            testStepId: hook.id,
                            testCaseStartedId,
                            testStepResult: {
                                status: Status.Passed,
                                duration: (0, messages_helpers_1.duration)(start, end),
                            },
                            timestamp: end,
                        },
                    });
                    remainingSteps.shift();
                });
            }
            else if (step.pickleStep) {
                const pickleStep = step.pickleStep;
                const text = (0, assertions_1.assertAndReturn)(pickleStep.text, "Expected pickle step to have a text");
                const scenarioStep = (0, assertions_1.assertAndReturn)(astIdMap.get((0, assertions_1.assertAndReturn)((_a = pickleStep.astNodeIds) === null || _a === void 0 ? void 0 : _a[0], "Expected to find at least one astNodeId")), `Expected to find scenario step associated with id = ${(_b = pickleStep.astNodeIds) === null || _b === void 0 ? void 0 : _b[0]}`);
                cy.then(() => {
                    window.testState.pickleStep = step.pickleStep;
                    Cypress.log({
                        name: "step",
                        displayName: (0, assertions_1.assertAndReturn)("keyword" in scenarioStep && scenarioStep.keyword, "Expected to find a keyword in the scenario step"),
                        message: text,
                    });
                });
                const argument = ((_c = pickleStep.argument) === null || _c === void 0 ? void 0 : _c.dataTable)
                    ? new data_table_1.default(pickleStep.argument.dataTable)
                    : ((_e = (_d = pickleStep.argument) === null || _d === void 0 ? void 0 : _d.docString) === null || _e === void 0 ? void 0 : _e.content)
                        ? pickleStep.argument.docString.content
                        : undefined;
                cy.then(() => {
                    internalProperties.currentStep = { pickleStep };
                    const start = (0, messages_helpers_1.createTimestamp)();
                    messages.stack.push({
                        testStepStarted: {
                            testStepId: pickleStep.id,
                            testCaseStartedId,
                            timestamp: start,
                        },
                    });
                    if (messages.enabled) {
                        cy.task(constants_1.TASK_TEST_STEP_STARTED, pickleStep.id, { log: false });
                    }
                    return cy.wrap(start, { log: false });
                })
                    .then((start) => {
                    const ensureChain = (value) => Cypress.isCy(value) ? value : cy.wrap(value, { log: false });
                    try {
                        return ensureChain(registry.runStepDefininition(this, text, argument)).then((result) => {
                            return {
                                start,
                                result,
                            };
                        });
                    }
                    catch (e) {
                        if (e instanceof registry_1.MissingDefinitionError) {
                            throw new Error(createMissingStepDefinitionMessage(context, pickleStep, context.registry.parameterTypeRegistry));
                        }
                        else {
                            throw e;
                        }
                    }
                })
                    .then(({ start, result }) => {
                    var _a, _b, _c;
                    const end = (0, messages_helpers_1.createTimestamp)();
                    if (result === "pending") {
                        messages.stack.push({
                            testStepFinished: {
                                testStepId: pickleStep.id,
                                testCaseStartedId,
                                testStepResult: {
                                    status: Status.Pending,
                                    duration: (0, messages_helpers_1.duration)(start, end),
                                },
                                timestamp: end,
                            },
                        });
                        remainingSteps.shift();
                        for (const skippedStep of remainingSteps) {
                            const testStepId = (0, assertions_1.assertAndReturn)((_b = (_a = skippedStep.hook) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_c = skippedStep.pickleStep) === null || _c === void 0 ? void 0 : _c.id, "Expected a step to either be a hook or a pickleStep");
                            messages.stack.push({
                                testStepStarted: {
                                    testStepId,
                                    testCaseStartedId,
                                    timestamp: (0, messages_helpers_1.createTimestamp)(),
                                },
                            });
                            messages.stack.push({
                                testStepFinished: {
                                    testStepId,
                                    testCaseStartedId,
                                    testStepResult: {
                                        status: Status.Skipped,
                                        duration: {
                                            seconds: 0,
                                            nanos: 0,
                                        },
                                    },
                                    timestamp: (0, messages_helpers_1.createTimestamp)(),
                                },
                            });
                        }
                        for (let i = 0, count = remainingSteps.length; i < count; i++) {
                            remainingSteps.pop();
                        }
                        this.skip();
                    }
                    else {
                        messages.stack.push({
                            testStepFinished: {
                                testStepId: pickleStep.id,
                                testCaseStartedId,
                                testStepResult: {
                                    status: Status.Passed,
                                    duration: (0, messages_helpers_1.duration)(start, end),
                                },
                                timestamp: end,
                            },
                        });
                        remainingSteps.shift();
                    }
                });
            }
        }
    });
}
function collectTagNamesFromGherkinDocument(gherkinDocument) {
    const tagNames = [];
    for (const node of (0, ast_helpers_1.traverseGherkinDocument)(gherkinDocument)) {
        if ("tags" in node) {
            tagNames.push(...(0, ast_helpers_1.collectTagNames)(node.tags));
        }
    }
    return tagNames;
}
function createTests(registry, source, gherkinDocument, pickles, messagesEnabled, omitFiltered, stepDefinitionHints) {
    const noopNode = { evaluate: () => true };
    const environmentTags = (0, environment_helpers_1.getTags)(Cypress.env());
    const messages = [];
    messages.push({
        source: {
            data: source,
            uri: (0, assertions_1.assertAndReturn)(gherkinDocument.uri, "Expected gherkin document to have URI"),
            mediaType: "text/x.cucumber.gherkin+plain",
        },
    });
    messages.push({
        gherkinDocument: Object.assign({}, gherkinDocument),
    });
    for (const pickle of pickles) {
        messages.push({
            pickle,
        });
    }
    for (const hook of [...registry.beforeHooks, ...registry.afterHooks]) {
        messages.push({
            hook: {
                id: hook.id,
                sourceReference,
            },
        });
    }
    const tagsInDocument = collectTagNamesFromGherkinDocument(gherkinDocument);
    const testFilter = tagsInDocument.includes("@only") || tagsInDocument.includes("@focus")
        ? (0, tag_expressions_1.default)("@only or @focus")
        : environmentTags
            ? (0, tag_expressions_1.default)(environmentTags)
            : noopNode;
    if (gherkinDocument.feature) {
        createFeature({
            registry,
            gherkinDocument,
            pickles,
            testFilter,
            omitFiltered,
            messages: {
                enabled: messagesEnabled,
                stack: messages,
            },
            stepDefinitionHints,
        }, gherkinDocument.feature);
    }
    const isHooksAttached = globalThis[constants_1.INTERNAL_PROPERTY_NAME];
    if (isHooksAttached) {
        return;
    }
    else {
        globalThis[constants_1.INTERNAL_PROPERTY_NAME] = true;
    }
    before(function () {
        var _a;
        if (!((_a = retrieveInternalSuiteProperties()) === null || _a === void 0 ? void 0 : _a.isEventHandlersAttached)) {
            (0, assertions_1.fail)("Missing preprocessor event handlers (this usally means you've not invoked `addCucumberPreprocessorPlugin()` or not returned the config object in `setupNodeEvents()`)");
        }
    });
    afterEach(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        (0, registry_1.freeRegistry)();
        const properties = retrieveInternalSpecProperties();
        const { testCaseStartedId, remainingSteps } = properties;
        const endTimestamp = (0, messages_helpers_1.createTimestamp)();
        if (remainingSteps.length > 0 &&
            ((_a = this.currentTest) === null || _a === void 0 ? void 0 : _a.state) !== "pending") {
            const error = (0, assertions_1.assertAndReturn)((_c = (_b = this.currentTest) === null || _b === void 0 ? void 0 : _b.err) === null || _c === void 0 ? void 0 : _c.message, "Expected to find an error message");
            if (constants_1.HOOK_FAILURE_EXPR.test(error)) {
                return;
            }
            const failedStep = (0, assertions_1.assertAndReturn)(remainingSteps.shift(), "Expected there to be a remaining step");
            const testStepId = (0, assertions_1.assertAndReturn)((_e = (_d = failedStep.hook) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : (_f = failedStep.pickleStep) === null || _f === void 0 ? void 0 : _f.id, "Expected a step to either be a hook or a pickleStep");
            const failedTestStepFinished = error.includes("Step implementation missing")
                ? {
                    testStepFinished: {
                        testStepId,
                        testCaseStartedId,
                        testStepResult: {
                            status: Status.Undefined,
                            duration: {
                                seconds: 0,
                                nanos: 0,
                            },
                        },
                        timestamp: endTimestamp,
                    },
                }
                : {
                    testStepFinished: {
                        testStepId,
                        testCaseStartedId,
                        testStepResult: {
                            status: Status.Failed,
                            message: (_h = (_g = this.currentTest) === null || _g === void 0 ? void 0 : _g.err) === null || _h === void 0 ? void 0 : _h.message,
                            // TODO: Create a proper duration from when the step started.
                            duration: {
                                seconds: 0,
                                nanos: 0,
                            },
                        },
                        timestamp: endTimestamp,
                    },
                };
            messages.push(failedTestStepFinished);
            for (const skippedStep of remainingSteps) {
                const testStepId = (0, assertions_1.assertAndReturn)((_k = (_j = skippedStep.hook) === null || _j === void 0 ? void 0 : _j.id) !== null && _k !== void 0 ? _k : (_l = skippedStep.pickleStep) === null || _l === void 0 ? void 0 : _l.id, "Expected a step to either be a hook or a pickleStep");
                messages.push({
                    testStepStarted: {
                        testStepId,
                        testCaseStartedId,
                        timestamp: endTimestamp,
                    },
                });
                messages.push({
                    testStepFinished: {
                        testStepId,
                        testCaseStartedId,
                        testStepResult: {
                            status: Status.Skipped,
                            duration: {
                                seconds: 0,
                                nanos: 0,
                            },
                        },
                        timestamp: endTimestamp,
                    },
                });
            }
        }
        messages.push({
            testCaseFinished: {
                testCaseStartedId,
                timestamp: endTimestamp,
                willBeRetried: false,
            },
        });
        /**
         * Repopulate internal properties in case previous test is retried.
         */
        properties.testCaseStartedId = (0, uuid_1.v4)();
        properties.remainingSteps = [...properties.allSteps];
    });
    after(function () {
        if (messagesEnabled) {
            cy.task(constants_1.TASK_APPEND_MESSAGES, messages, { log: false });
        }
    });
}
exports.default = createTests;
function strictIsInteractive() {
    const isInteractive = Cypress.config("isInteractive");
    if (typeof isInteractive === "boolean") {
        return isInteractive;
    }
    throw new Error("Expected to find a Cypress configuration property `isInteractive`, but didn't");
}
function createMissingStepDefinitionMessage(context, pickleStep, parameterTypeRegistry) {
    var _a, _b;
    const noStepDefinitionPathsTemplate = `
    Step implementation missing for "<text>".

    We tried searching for files containing step definitions using the following search pattern templates:

    <step-definitions>

    These templates resolved to the following search patterns:

    <step-definition-patterns>

    These patterns matched **no files** containing step definitions. This almost certainly means that you have misconfigured \`stepDefinitions\`.

    You can implement it using the suggestion(s) below.

    <snippets>
  `;
    const someStepDefinitionPathsTemplate = `
    Step implementation missing for "<text>".

    We tried searching for files containing step definitions using the following search pattern templates:

    <step-definitions>

    These templates resolved to the following search patterns:

    <step-definition-patterns>

    These patterns matched the following files:

    <step-definition-paths>

    However, none of these files contained a step definition matching "<text>".

    You can implement it using the suggestion(s) below.

    <snippets>
  `;
    const { stepDefinitionHints } = context;
    const template = stepDefinitionHints.stepDefinitionPaths.length > 0
        ? someStepDefinitionPathsTemplate
        : noStepDefinitionPathsTemplate;
    const maybeEscape = (string) => strictIsInteractive() ? string.replace("*", "\\*") : string;
    const prettyPrintList = (items) => items.map((item) => "  - " + maybeEscape(item)).join("\n");
    let parameter = null;
    if ((_a = pickleStep.argument) === null || _a === void 0 ? void 0 : _a.dataTable) {
        parameter = "dataTable";
    }
    else if ((_b = pickleStep.argument) === null || _b === void 0 ? void 0 : _b.docString) {
        parameter = "docString";
    }
    const snippets = new cucumber_expressions_1.CucumberExpressionGenerator(() => parameterTypeRegistry.parameterTypes)
        .generateExpressions(pickleStep.text)
        .map((expression) => (0, snippets_1.generateSnippet)(expression, parameter))
        .map((snippet) => (0, strings_1.indent)(snippet, { count: 2 }))
        .join("\n\n");
    return (0, strings_1.stripIndent)(template)
        .replaceAll("<text>", pickleStep.text)
        .replaceAll("<step-definitions>", prettyPrintList([stepDefinitionHints.stepDefinitions].flat()))
        .replaceAll("<step-definition-patterns>", prettyPrintList(stepDefinitionHints.stepDefinitionPatterns))
        .replaceAll("<step-definition-paths>", prettyPrintList(stepDefinitionHints.stepDefinitionPaths))
        .replaceAll("<snippets>", snippets);
}
