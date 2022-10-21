"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTags = void 0;
function getTags(env) {
    var _a;
    const tags = (_a = env.TAGS) !== null && _a !== void 0 ? _a : env.tags;
    return tags == null ? null : String(tags);
}
exports.getTags = getTags;
