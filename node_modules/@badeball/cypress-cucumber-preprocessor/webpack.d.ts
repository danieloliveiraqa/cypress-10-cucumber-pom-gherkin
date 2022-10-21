/**
 * Can be removed once Webpack v5 is supported by Cypress' preprocessor, because Webpack v5 ships
 * with these types, ref. https://github.com/webpack/webpack/pull/13164.
 */
interface ILoaderContext {
    async: () => (err: Error | null, result?: string) => void;
    resourcePath: string;
    query: any;
}
interface ILoaderDefinition {
    (this: ILoaderContext, data: string): void;
}
declare const loader: ILoaderDefinition;
export default loader;
