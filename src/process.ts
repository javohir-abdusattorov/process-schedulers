import { EventBus } from "./event-bus"
import { TM }       from "./utilities"


export class Process {
	public state: ProcessStates = ProcessStates.Waiting
	public additional: ProcessAdditionalInfo = {}

	private timer: NodeJS.Timer
	private progress: number = 0

	constructor(
		public name: string,
		public pid: number,
		additional?: ProcessAdditionalInfo,
	) {
		if (additional) this.additional = additional
	}

	public start(): void {
		console.log(``)
		console.log(`[PROCESS] STARTED: "${this.name}"`)

		this.state = ProcessStates.Running
		this.timer = setInterval(this.execute.bind(this), 1 * TM)
	}

	public stop(): void {
		if (this.state === ProcessStates.Running) this.state = ProcessStates.Waiting
		clearInterval(this.timer)

		console.log(`[PROCESS] STOPPED: "${this.name}"`)
	}

	private async execute(): Promise<void> {
		// console.log(`    running...`)
		this.progress++

		if (this.additional?.burstTime && this.progress >= this.additional.burstTime) {
			return this.complete()
		}

		if ((this.progress % 10) === 0) {
			return this.IOCall()
		}
	}

	private complete(): void {
		console.log(`[PROCESS] COMPLETED: "${this.name}"`)

		this.state = ProcessStates.Completed
		EventBus.emit("process:completed", this.pid)
		clearInterval(this.timer)
	}

	private IOCall(): void {
		console.log(`[PROCESS] IO CALL: "${this.name}"`)

		this.state = ProcessStates.Blocked
		EventBus.emit("io:request", this.pid)
		clearInterval(this.timer)
	}
}

export enum ProcessStates {
	Running = 1,
	Waiting = 2,
	Blocked = 3,
	Completed = 4,
}

export interface ProcessAdditionalInfo {
	quantum?: number
	priority?: number
	burstTime?: number
	averageRunTime?: number
	category?: string
}
