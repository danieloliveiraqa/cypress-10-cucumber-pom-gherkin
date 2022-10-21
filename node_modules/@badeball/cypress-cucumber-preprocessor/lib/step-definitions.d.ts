import { ICypressConfiguration, ICypressPost10Configuration, ICypressPre10Configuration } from "@badeball/cypress-configuration";
import { IPreprocessorConfiguration } from "./preprocessor-configuration";
export declare function getStepDefinitionPaths(stepDefinitionPatterns: string[]): Promise<string[]>;
export declare function pathParts(relativePath: string): string[];
export declare function getStepDefinitionPatterns(configuration: {
    cypress: ICypressConfiguration;
    preprocessor: IPreprocessorConfiguration;
}, filepath: string): string[];
export declare function getStepDefinitionPatternsPost10(configuration: {
    cypress: Pick<ICypressPost10Configuration, "projectRoot">;
    preprocessor: IPreprocessorConfiguration;
}, filepath: string): string[];
export declare function getStepDefinitionPatternsPre10(configuration: {
    cypress: Pick<ICypressPre10Configuration, "projectRoot" | "integrationFolder">;
    preprocessor: IPreprocessorConfiguration;
}, filepath: string): string[];
