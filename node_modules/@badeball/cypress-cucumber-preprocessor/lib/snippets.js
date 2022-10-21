"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSnippet = void 0;
const TEMPLATE = `
Given("[definition]", function ([arguments]) {
  return "pending";
});
`.trim();
function generateSnippet(expression, parameter) {
    const definition = expression.source
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
    const stepParameterNames = parameter ? [parameter] : [];
    const args = expression.parameterNames.concat(stepParameterNames).join(", ");
    return TEMPLATE.replace("[definition]", definition).replace("[arguments]", args);
}
exports.generateSnippet = generateSnippet;
