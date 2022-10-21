"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duration = exports.createTimestamp = void 0;
function createTimestamp() {
    const now = new Date().getTime();
    const seconds = Math.floor(now / 1000);
    const nanos = (now - seconds * 1000) * 1000000;
    return {
        seconds,
        nanos,
    };
}
exports.createTimestamp = createTimestamp;
function duration(start, end) {
    return {
        seconds: end.seconds - start.seconds,
        nanos: end.nanos - start.nanos,
    };
}
exports.duration = duration;
