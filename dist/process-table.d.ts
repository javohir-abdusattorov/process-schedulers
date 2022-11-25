import { Process, ProcessStates } from "./process";
export declare class ProcessTable {
    readonly processes: Process[];
    constructor(processes: Process[]);
    getAll(): Process[];
    getByPID(pid: number): Process;
    getIndexByPID(pid: number): number;
    areAllBlocked(pids?: number[]): boolean;
    setProcessState(pid: number, state: ProcessStates): void;
    add(process: Process): void;
    completed(pid: number): void;
}
