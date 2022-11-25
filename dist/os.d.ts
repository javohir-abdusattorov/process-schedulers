export declare class OS {
    private readonly IO;
    private readonly Scheduler;
    private readonly ProcessTable;
    constructor();
    run(): Promise<void>;
    private createProcessesAsynchronous;
    private createProcesses;
}
