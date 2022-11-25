import { Scheduler }              from "../../index"
import { ProcessStates, Process } from "../../../process"
import { wait, TM }               from "../../../utilities"
import { ProcessTable }           from "../../../process-table"
import { EventBus }               from "../../../event-bus"


export class PriorityScheduler extends Scheduler {
	private queue: number[] = [] // All processes PIDs by order

	constructor(
		private processTable: ProcessTable
	) {
		super(processTable)
	}

	public async run(): Promise<void> {
		this.reOrderByPriority()

		// External events
		this.onIOResponse()
		this.onNewProcess()

		// Main scheduler
		while (true) {
			if (!this.queue.length) {
				await wait(TM)
				continue
			}

			this.reOrderByPriority()

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
				this.waitForProcessToBlock(currentProcess),
				this.waitForProcessToComplete(currentProcess),
				this.waitForNewProcess(currentProcess)
			])

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

	private async waitForNewProcess( process: Process ): Promise<void> {
		return new Promise<void>((done) => {
			EventBus.once("process:new", (pid: number) => {
				const newProcess = this.processesTable.getByPID(pid)
				const isHigherPriority = Boolean(newProcess.additional.priority > process.additional.priority)
				if (isHigherPriority) done()
			})
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

	private reOrderByPriority(): void {
		this.queue = this.processTable.getAll()
			.sort((a, b) => {
				if (a.state !== ProcessStates.Waiting) return 1
				if (b.state !== ProcessStates.Waiting) return -1
				return a.additional.priority - b.additional.priority || a.additional.burstTime - a.additional.burstTime
			})
			.map((process) => {
				return process.pid
			})
	}
}