import esbuild from "esbuild";
import { ICypressConfiguration } from "@badeball/cypress-configuration";
export { ICypressConfiguration };
export declare function createEsbuildPlugin(configuration: ICypressConfiguration): esbuild.Plugin;
export default createEsbuildPlugin;
