export declare class Process {
    name: string;
    pid: number;
    state: ProcessStates;
    additional: ProcessAdditionalInfo;
    private timer;
    private progress;
    constructor(name: string, pid: number, additional?: ProcessAdditionalInfo);
    start(): void;
    stop(): void;
    private execute;
    private complete;
    private IOCall;
}
export declare enum ProcessStates {
    Running = 1,
    Waiting = 2,
    Blocked = 3,
    Completed = 4
}
export interface ProcessAdditionalInfo {
    quantum?: number;
    priority?: number;
    burstTime?: number;
    category?: string;
}
