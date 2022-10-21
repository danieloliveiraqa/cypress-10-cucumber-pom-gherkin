/// <reference types="node" />
/// <reference types="node" />
import { Transform } from "stream";
import { EventEmitter } from "events";
import { ICypressConfiguration } from "@badeball/cypress-configuration";
import { compile } from "./lib/template";
export declare function transform(configuration: ICypressConfiguration, filepath: string): Transform;
declare type ICypressPreprocessorFile = EventEmitter & {
    filePath: string;
    outputPath: string;
    shouldWatch: boolean;
};
export declare function preprocessor(configuration: ICypressConfiguration, options?: any, { prependTransform }?: {
    prependTransform?: boolean;
}): (file: ICypressPreprocessorFile) => any;
export { ICypressConfiguration };
export { compile };
export default preprocessor;
