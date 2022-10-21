"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./lib/template");
const loader = function (data) {
    const callback = this.async();
    (0, template_1.compile)(this.query, data, this.resourcePath).then((result) => callback(null, result), (error) => callback(error));
};
exports.default = loader;
