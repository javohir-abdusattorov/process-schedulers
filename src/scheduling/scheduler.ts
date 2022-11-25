import { Process, ProcessStates } from "../process"
import { wait, TM }               from "../utilities"
import { EventBus }               from "../event-bus"
import { ProcessTable }           from "../process-table"


export abstract class Scheduler {
	protected current: number

	protected constructor(
		protected processesTable: ProcessTable
	) {}

	abstract run(): Promise<void>

	protected async waitForProcessQuantum( process: Process ): Promise<void> {
		return wait(process.additional.quantum * TM)
	}

	protected async waitForProcessToBlock( process: Process ): Promise<void> {
		return new Promise<void>((done) => {
			EventBus.once("io:request", (pid: number) => {
				const isCurrentProcess = pid === process.pid
				if (isCurrentProcess) return done()
			})
		})
	}

	protected async waitForProcessToComplete( process: Process ): Promise<void> {
		return new Promise<void>((done) => {
			EventBus.once("process:completed", (pid: number) => {
				const isCurrentProcess = pid === process.pid
				if (isCurrentProcess) return done()
			})
		})
	}

	protected async waitIfAllProcessesBlocked(): Promise<void> {
		if (this.processesTable.areAllBlocked()) await wait(TM)
	}

	protected onIOResponse(): void {
		EventBus.on("io:response", (pid: number) => {
			const process = this.processesTable.getByPID(pid)
			if (!process) return

			this.processesTable.setProcessState(pid, ProcessStates.Waiting)
			console.log(`IO FINISHED: "${process.name}"`)
		})
	}

	protected removeWaitingEventListeners(): void {
		const listener = EventBus.listeners("io:request")[1] as (...args: any[]) => void
		if (listener) EventBus.removeListener("io:request", listener)

		EventBus.removeAllListeners("process:completed")
		EventBus.removeAllListeners("process:new")
	}
}