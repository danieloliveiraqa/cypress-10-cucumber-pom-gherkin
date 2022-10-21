export declare type StrictTimestamp = {
    seconds: number;
    nanos: number;
};
export declare function createTimestamp(): StrictTimestamp;
export declare function duration(start: StrictTimestamp, end: StrictTimestamp): StrictTimestamp;
