import { Process } from "../../process";
export declare class Scheduler {
    private processes;
    private queue;
    private current;
    constructor(processes: Process[]);
    run(): Promise<void>;
    private moveProcessToBack;
    private waitForProcessToBlockOrFinish;
    private onIOResponse;
}
