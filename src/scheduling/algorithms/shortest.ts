import { Scheduler }     from "../index"
import { ProcessStates } from "../../process"
import { wait, TM }      from "../../utilities"
import { ProcessTable }  from "../../process-table"


export class ShortestProcessScheduler extends Scheduler {
	private queue: number[] = [] // All processes PIDs by order

	constructor(
		private processTable: ProcessTable
	) {
		super(processTable)
	}

	public async run(): Promise<void> {
		this.reOrderByShortestFirst()

		// External events
		this.onIOResponse()
		this.onNewProcess()

		// Main scheduler
		while (true) {
			if (!this.queue.length) {
				await wait(TM)
				continue
			}

			this.reOrderByShortestFirst()

			this.current = this.queue[0]
			const currentProcess = this.processTable.getByPID(this.current)

			if (currentProcess.state !== ProcessStates.Waiting) {
				this.moveProcessToBack()
				await this.waitIfAllProcessesBlocked()
				continue
			}

			// Start process
			const beforeStart = Date.now()
			currentProcess.start()

			// Wait for its quantum to finish
			await Promise.race([
				this.waitForProcessToBlock(currentProcess),
				this.waitForProcessToComplete(currentProcess),
			])

			// Write down process runtime
			const afterDone = Date.now()
			const diff = afterDone - beforeStart
			const runTime = (currentProcess.additional.averageRunTime + diff) / 2
			this.processTable.setRuntime(currentProcess.pid, runTime)

			// Stop process and insert it at the end of the queue
			currentProcess.stop()
			this.moveProcessToBack()

			this.removeWaitingEventListeners()
		}
	}

	private onNewProcess(): void {
		// EventBus.on("process:new", (pid) => {
		// })
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

	private reOrderByShortestFirst(): void {
		this.queue = this.processTable.getAll()
			.sort((a, b) => {
				if (a.state !== ProcessStates.Waiting) return 1
				if (b.state !== ProcessStates.Waiting) return -1
				return a.additional.averageRunTime - b.additional.averageRunTime || a.additional.burstTime - b.additional.burstTime
			})
			.map((process) => {
				return process.pid
			})
	}
}