import { Scheduler } from "../../index";
import { ProcessTable } from "../../../process-table";
export declare class RoundRobinScheduler extends Scheduler {
    private processTable;
    private queue;
    constructor(processTable: ProcessTable);
    run(): Promise<void>;
    private onNewProcess;
    private moveProcessToBack;
}
