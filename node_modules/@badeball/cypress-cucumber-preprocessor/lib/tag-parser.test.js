"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const assert_1 = __importDefault(require("assert"));
const tag_parser_1 = require("./tag-parser");
function example(tag, expectedOptions) {
    it(`should return ${util_1.default.inspect(expectedOptions)} for ${tag}`, () => {
        const actualOptions = (0, tag_parser_1.tagToCypressOptions)(tag);
        assert_1.default.deepStrictEqual(actualOptions, expectedOptions);
    });
}
describe("tagToCypressOptions", () => {
    example("@animationDistanceThreshold(5)", { animationDistanceThreshold: 5 });
    // example("@baseUrl('http://www.foo.com')'", { baseUrl: "http://www.foo.com" });
    example("@blockHosts('http://www.foo.com')", {
        blockHosts: "http://www.foo.com",
    });
    example("@blockHosts('http://www.foo.com','http://www.bar.com')", {
        blockHosts: ["http://www.foo.com", "http://www.bar.com"],
    });
    example("@defaultCommandTimeout(5)", { defaultCommandTimeout: 5 });
    example("@env(foo='bar',baz=5,qux=false)", {
        env: { foo: "bar", baz: 5, qux: false },
    });
    example("@execTimeout(5)", { execTimeout: 5 });
    // example("@experimentalSessionAndOrigin(true)", {
    //   experimentalSessionAndOrigin: 5,
    // });
    // example("@experimentalSessionAndOrigin(false)", {
    //   experimentalSessionAndOrigin: 5,
    // });
    example("@includeShadowDom(true)", { includeShadowDom: true });
    example("@includeShadowDom(false)", { includeShadowDom: false });
    example("@keystrokeDelay(5)", { keystrokeDelay: 5 });
    example("@numTestsKeptInMemory(5)", { numTestsKeptInMemory: 5 });
    example("@pageLoadTimeout(5)", { pageLoadTimeout: 5 });
    example("@redirectionLimit(5)", { redirectionLimit: 5 });
    example("@requestTimeout(5)", { requestTimeout: 5 });
    example("@responseTimeout(5)", { responseTimeout: 5 });
    example("@retries(5)", { retries: 5 });
    example("@retries(runMode=5)", { retries: { runMode: 5 } });
    example("@retries(openMode=5)", { retries: { openMode: 5 } });
    example("@retries(runMode=5,openMode=10)", {
        retries: { runMode: 5, openMode: 10 },
    });
    example("@retries(openMode=10,runMode=5)", {
        retries: { runMode: 5, openMode: 10 },
    });
    example("@screenshotOnRunFailure(true)", { screenshotOnRunFailure: true });
    example("@screenshotOnRunFailure(false)", { screenshotOnRunFailure: false });
    example("@scrollBehavior('center')", { scrollBehavior: "center" });
    example("@scrollBehavior('top')", { scrollBehavior: "top" });
    example("@scrollBehavior('bottom')", { scrollBehavior: "bottom" });
    example("@scrollBehavior('nearest')", { scrollBehavior: "nearest" });
    example("@slowTestThreshold(5)", { slowTestThreshold: 5 });
    example("@viewportHeight(720)", { viewportHeight: 720 });
    example("@viewportWidth(1280)", { viewportWidth: 1280 });
    example("@waitForAnimations(true)", { waitForAnimations: true });
    example("@waitForAnimations(false)", { waitForAnimations: false });
});
