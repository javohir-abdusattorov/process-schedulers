import { Scheduler }     from "../../index"
import { ProcessStates } from "../../../process"
import { wait, TM }      from "../../../utilities"
import { ProcessTable }  from "../../../process-table"
import { EventBus }      from "../../../event-bus"


export class RoundRobinScheduler extends Scheduler {
	private queue: number[] = [] // All processes PIDs by order

	constructor(
		private processTable: ProcessTable,
	) {
		super(processTable)
	}

	public async run(): Promise<void> {
		this.queue = this.processTable.getAll().map((process) => process.pid)

		// External events
		this.onIOResponse()
		this.onNewProcess()

		// Main scheduler
		while (true) {
			if (!this.queue.length) {
				await wait(TM)
				continue
			}

			this.current = this.queue[0]
			const currentProcess = this.processTable.getByPID(this.current)

			if (currentProcess.state !== ProcessStates.Waiting) {
				this.moveProcessToBack()
				await this.waitIfAllProcessesBlocked()
				continue
			}

			// Start process
			currentProcess.start()

			// Wait for its quantum to finish
			await Promise.race([
				this.waitForProcessQuantum(currentProcess),
				this.waitForProcessToBlock(currentProcess),
				this.waitForProcessToComplete(currentProcess),
			])

			// Stop process and insert it at the end of the queue
			currentProcess.stop()
			this.moveProcessToBack()

			this.removeWaitingEventListeners()
		}
	}

	private onNewProcess(): void {
		EventBus.on("process:new", (pid) => {
			this.queue.push(pid)
		})
	}

	private moveProcessToBack(): void {
		const currentProcessPID = this.current
		const isProcessCompleted = this.processTable.getByPID(currentProcessPID).state === ProcessStates.Completed
		if (isProcessCompleted) {
			this.queue.shift()
			return
		}

		this.queue.shift()
		this.queue.push(currentProcessPID)
	}
}