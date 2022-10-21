"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAstIdMap = exports.collectTagNames = exports.traverseGherkinDocument = void 0;
const assertions_1 = require("./assertions");
function* traverseGherkinDocument(gherkinDocument) {
    yield gherkinDocument;
    if (gherkinDocument.feature) {
        yield* traverseFeature(gherkinDocument.feature);
    }
}
exports.traverseGherkinDocument = traverseGherkinDocument;
function* traverseFeature(feature) {
    yield feature;
    if (feature.location) {
        yield feature.location;
    }
    if (feature.tags) {
        for (const tag of feature.tags) {
            yield tag;
        }
    }
    if (feature.children) {
        for (const child of feature.children) {
            yield* traverseFeatureChild(child);
        }
    }
}
function* traverseFeatureChild(featureChild) {
    yield featureChild;
    if (featureChild.rule) {
        yield* traverseFeatureRule(featureChild.rule);
    }
    if (featureChild.background) {
        yield* traverseBackground(featureChild.background);
    }
    if (featureChild.scenario) {
        yield* traverseScenario(featureChild.scenario);
    }
}
function* traverseFeatureRule(rule) {
    yield rule;
    if (rule.location) {
        yield rule.location;
    }
    if (rule.children) {
        for (const child of rule.children) {
            yield* traverseRuleChild(child);
        }
    }
}
function* traverseRuleChild(ruleChild) {
    yield ruleChild;
    if (ruleChild.background) {
        yield* traverseBackground(ruleChild.background);
    }
    if (ruleChild.scenario) {
        yield* traverseScenario(ruleChild.scenario);
    }
}
function* traverseBackground(backgorund) {
    yield backgorund;
    if (backgorund.location) {
        yield backgorund.location;
    }
    if (backgorund.steps) {
        for (const step of backgorund.steps) {
            yield* traverseStep(step);
        }
    }
}
function* traverseScenario(scenario) {
    yield scenario;
    if (scenario.location) {
        yield scenario.location;
    }
    if (scenario.steps) {
        for (const step of scenario.steps) {
            yield* traverseStep(step);
        }
    }
    if (scenario.examples) {
        for (const example of scenario.examples) {
            yield* traverseExample(example);
        }
    }
}
function* traverseStep(step) {
    yield step;
    if (step.location) {
        yield step.location;
    }
    if (step.docString) {
        yield* traverseDocString(step.docString);
    }
    if (step.dataTable) {
        yield* traverseDataTable(step.dataTable);
    }
}
function* traverseDocString(docString) {
    yield docString;
    if (docString.location) {
        yield docString.location;
    }
}
function* traverseDataTable(dataTable) {
    yield dataTable;
    if (dataTable.location) {
        yield dataTable.location;
    }
    if (dataTable.rows) {
        for (const row of dataTable.rows) {
            yield* traverseRow(row);
        }
    }
}
function* traverseRow(row) {
    yield row;
    if (row.location) {
        yield row.location;
    }
    if (row.cells) {
        for (const cell of row.cells) {
            yield* traverseCell(cell);
        }
    }
}
function* traverseCell(cell) {
    yield cell;
    if (cell.location) {
        yield cell.location;
    }
}
function* traverseExample(example) {
    yield example;
    if (example.location) {
        yield example.location;
    }
    if (example.tableHeader) {
        yield* traverseRow(example.tableHeader);
    }
    if (example.tableBody) {
        for (const row of example.tableBody) {
            yield* traverseRow(row);
        }
    }
}
function collectTagNames(tags) {
    var _a;
    return ((_a = tags === null || tags === void 0 ? void 0 : tags.map((tag) => (0, assertions_1.assertAndReturn)(tag.name, "Expected tag to have a name"))) !== null && _a !== void 0 ? _a : []);
}
exports.collectTagNames = collectTagNames;
function createAstIdMap(gherkinDocument) {
    const astIdMap = new Map();
    for (const node of traverseGherkinDocument(gherkinDocument)) {
        if ("id" in node && node.id) {
            astIdMap.set(node.id, node);
        }
    }
    return astIdMap;
}
exports.createAstIdMap = createAstIdMap;
