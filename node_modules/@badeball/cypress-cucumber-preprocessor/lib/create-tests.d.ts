import messages from "@cucumber/messages";
import { IHook, Registry } from "./registry";
declare global {
    namespace globalThis {
        var __cypress_cucumber_preprocessor_dont_use_this: true | undefined;
    }
}
interface IStep {
    hook?: IHook;
    pickleStep?: messages.PickleStep;
}
export interface InternalSpecProperties {
    pickle: messages.Pickle;
    testCaseStartedId: string;
    currentStep?: IStep;
    allSteps: IStep[];
    remainingSteps: IStep[];
}
export interface InternalSuiteProperties {
    isEventHandlersAttached?: boolean;
}
export default function createTests(registry: Registry, source: string, gherkinDocument: messages.GherkinDocument, pickles: messages.Pickle[], messagesEnabled: boolean, omitFiltered: boolean, stepDefinitionHints: {
    stepDefinitions: string[];
    stepDefinitionPatterns: string[];
    stepDefinitionPaths: string[];
}): void;
export {};
