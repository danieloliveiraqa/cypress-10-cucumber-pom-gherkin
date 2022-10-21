declare type Primitive = string | boolean | number;
export default class Parser {
    private content;
    constructor(content: string);
    parse(): Record<string, Primitive | Primitive[] | Record<string, Primitive>>;
}
export {};
