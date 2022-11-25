import { Scheduler } from "../../index";
import { ProcessTable } from "../../../process-table";
export declare class MultilevelScheduler extends Scheduler {
    private processTable;
    private groups;
    constructor(processTable: ProcessTable);
    run(): Promise<void>;
    private onNewProcess;
    private groupProcesses;
    private moveGroupToBack;
    private moveProcessToBack;
}
