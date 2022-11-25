export declare class Process {
    private name;
    private state;
    private execution;
    quantum: number;
    constructor(name: string);
    start(): void;
    stop(): void;
}
