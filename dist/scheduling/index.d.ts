import { Process } from "../process";
import { ProcessTable } from "../process-table";
export declare abstract class Scheduler {
    private processesTable;
    protected current: number;
    protected constructor(processesTable: ProcessTable);
    abstract run(): Promise<void>;
    protected waitForProcessQuantum(process: Process): Promise<void>;
    protected waitForProcessToBlock(process: Process): Promise<void>;
    protected waitForProcessToComplete(process: Process): Promise<void>;
    protected waitForNewProcess(process: Process): Promise<void>;
    protected waitIfAllProcessesBlocked(): Promise<void>;
    protected onIOResponse(): void;
    protected removeWaitingEventListeners(): void;
}
