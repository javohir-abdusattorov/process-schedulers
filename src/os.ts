import { IO }                from "./io"
import { Process }           from "./process"
import { Scheduler }         from "./scheduling"
import { PriorityScheduler } from "./scheduling"
import { ProcessTable }      from "./process-table"
import { TM }                from "./utilities"


export class OS {
	private readonly IO: IO
	private readonly Scheduler: Scheduler
	private readonly ProcessTable: ProcessTable

	constructor() {
		this.IO = new IO()
		this.ProcessTable = new ProcessTable(this.createProcesses())
		this.Scheduler = new PriorityScheduler(this.ProcessTable)
	}

	public async run(): Promise<void> {
		this.IO.start()
		await this.Scheduler.run()
		this.createProcessesAsynchronous()
	}

	private createProcessesAsynchronous(): void {
		setInterval(() => {
			this.ProcessTable.add(new Process(
				"music",
				6,
				{
					quantum: 10,
					burstTime: 30,
					averageRunTime: 0,
					priority: 1,
					category: "interactive",
				},
			))
		}, 50 * TM)
	}

	private createProcesses(): Process[] {
		return [
			new Process("window-manager", 1, {
				quantum: 10,
				burstTime: 20,
				averageRunTime: 0,
				priority: 5,
				category: "daemon",
			}),
			new Process("browser", 2, {
				quantum: 10,
				burstTime: 100,
				averageRunTime: 0,
				priority: 1,
				category: "interactive",
			}),
			new Process("email-daemon", 3, {
				quantum: 10,
				burstTime: 50,
				averageRunTime: 0,
				priority: 10,
				category: "daemon",
			}),
			new Process("terminal", 4, {
				quantum: 10,
				burstTime: 10,
				averageRunTime: 0,
				priority: 10,
				category: "interactive",
			}),
			new Process("system-monitor", 5, {
				quantum: 10,
				burstTime: 10,
				averageRunTime: 0,
				priority: 10,
				category: "daemon",
			}),
		]
	}
}