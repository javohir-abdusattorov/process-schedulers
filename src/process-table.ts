import { Process, ProcessStates } from "./process"
import { EventBus }               from "./event-bus"


export class ProcessTable {
	constructor(
		public readonly processes: Process[],
	) {}


	public getAll(): Process[] {
		return this.processes
	}

	public getCount( state?: ProcessStates ): number {
		if (!state) return this.processes.length
		return this.processes.filter((process) => process.state === state).length
	}

	public getByPID( pid: number ): Process {
		return this.processes.find((process) => process.pid === pid)
	}

	public getIndexByPID( pid: number ): number {
		return this.processes.findIndex((process) => process.pid === pid)
	}

	public areAllBlocked( pids?: number[] ): boolean {
		if (!pids || !pids.length) {
			return this.processes.every((process) => process.state !== ProcessStates.Waiting)
		}

		return this.processes.every((process) => {
			return pids.includes(process.pid) && process.state !== ProcessStates.Waiting
		})
	}

	public setProcessState( pid: number, state: ProcessStates ): void {
		const index = this.getIndexByPID(pid)
		if (index < 0) return

		this.processes[index].state = state
	}

	public setRuntime( pid: number, runTime: number ): void {
		const index = this.getIndexByPID(pid)
		if (index < 0) return

		this.processes[index].additional.averageRunTime = runTime
	}

	public add( process: Process ): void {
		this.processes.push(process)
		console.log(``)
		EventBus.emit("process:new", process.pid)
	}

	public completed( pid: number ): void {
		const index = this.processes.findIndex((process) => process.pid === pid)
		this.processes.splice(index, 1)
	}
}