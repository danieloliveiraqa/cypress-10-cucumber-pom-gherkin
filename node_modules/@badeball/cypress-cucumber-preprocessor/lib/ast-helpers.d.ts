import messages from "@cucumber/messages";
import { YieldType } from "./types";
export declare function traverseGherkinDocument(gherkinDocument: messages.GherkinDocument): Generator<messages.GherkinDocument | messages.Feature | messages.Location | messages.Tag | messages.FeatureChild | messages.Rule | messages.RuleChild | messages.Background | messages.Step | messages.DocString | messages.DataTable | messages.TableRow | messages.TableCell | messages.Scenario | messages.Examples, void, unknown>;
export declare function collectTagNames(tags: readonly (messages.Tag | messages.PickleTag)[] | null | undefined): string[];
export declare function createAstIdMap(gherkinDocument: messages.GherkinDocument): Map<string, YieldType<ReturnType<typeof traverseGherkinDocument>>>;
