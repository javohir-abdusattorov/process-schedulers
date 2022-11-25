import { Scheduler }              from "../index"
import { ProcessStates, Process } from "../../process"
import { wait, TM }               from "../../utilities"
import { ProcessTable }           from "../../process-table"
import { EventBus }               from "../../event-bus"


export class MultilevelScheduler extends Scheduler {
	private groups: Group[] = []

	constructor( private processTable: ProcessTable ) { super(processTable) }

	public async run(): Promise<void> {

		// External events
		this.onIOResponse()
		this.onNewProcess()
		this.unblockGroupOnIOResponse()

		// Group all processes by category
		this.groupProcesses()

		// Group scheduling: Priority scheduling
		while (true) {
			if (!this.groups.length) {
				await wait(TM)
				continue
			}

			this.reOrderGroupsByPriority()

			const group = this.groups[0]
			if (!group.queue.length) {
				this.moveGroupToBack()
				continue
			}

			// Processes scheduling: Round-robin
			while (true) {
				// If there is no process to schedule, give CPU to other groups
				if (!group.queue.length) break

				// If all processes are blocked, give CPU to other groups
				if (this.processesTable.areAllBlocked(group.queue)) {
					this.groups[0].blocked = true
					break
				}

				// If current group's priority lowered than other groups', give CPU to highest priority group
				if (!this.isCurrentGroupHighestPriority()) break


				this.current = group.queue[0]
				const process = this.processTable.getByPID(this.current)

				if (process.state !== ProcessStates.Waiting) {
					this.moveProcessToBack()
					continue
				}

				process.start()

				// Wait for finish
				await Promise.race([
					this.waitForProcessQuantum(process),
					this.waitForProcessToBlock(process),
					this.waitForProcessToComplete(process),
				])

				// Stop process and insert it at the end of the queue
				process.stop()
				this.moveProcessToBack()

				this.removeWaitingEventListeners()
			}

			this.moveGroupToBack()
		}
	}

	private onNewProcess(): void {
		EventBus.on("process:new", (pid) => {
			const process = this.processTable.getByPID(pid)
			const groupIndex = this.groups.findIndex((group) => group.category === process.additional.category)
			this.addProcessToGroup(groupIndex, process)
		})
	}

	private unblockGroupOnIOResponse(): void {
		EventBus.on("io:response", (pid: number) => {
			const process = this.processesTable.getByPID(pid)
			if (!process) return

			const groupIndex = this.groups.findIndex((group) => group.category === process.additional.category)
			this.groups[groupIndex].blocked = false
		})
	}

	private isCurrentGroupHighestPriority(): boolean {
		const currentGroup = this.groups[0]
		return !Boolean(this.groups.some((group) => group.category !== currentGroup.category && group.priority > currentGroup.priority))
	}

	private groupProcesses(): void {
		this.groups = []

		for (const process of this.processTable.getAll()) {
			const groupIndex = this.groups.findIndex((group) => group.category === process.additional.category)
			this.addProcessToGroup(groupIndex, process)
		}
	}

	private addProcessToGroup( groupIndex: number, process: Process ): void {
		if (groupIndex >= 0) {
			this.groups[groupIndex].priority = Math.round((this.groups[groupIndex].priority + process.additional.priority) / 2)
			this.groups[groupIndex].queue.push(process.pid)
			return
		}

		this.groups.push({
			category: process.additional.category,
			priority: process.additional.priority,
			queue: [process.pid],
			blocked: false,
		})
	}

	private moveGroupToBack(): void {
		const group = this.groups[0]
		const isAllProcessCompleted = !group.queue.length
		if (isAllProcessCompleted) {
			this.groups.shift()
			return
		}

		this.groups.shift()
		this.groups.push(group)
	}

	private moveProcessToBack(): void {
		const process = this.processTable.getByPID(this.groups[0].queue[0])
		const isProcessCompleted = process.state === ProcessStates.Completed
		if (isProcessCompleted) {
			this.groups[0].queue.shift()
			return
		}

		this.groups[0].queue.shift()
		this.groups[0].queue.push(process.pid)
	}

	public reOrderGroupsByPriority(): void {
		this.groups = this.groups.sort((a, b) => {
			if (a.blocked) return 1
			if (b.blocked) return -1
			return a.priority - b.priority
		})
	}
}

interface Group {
	category: string
	priority: number
	queue: number[]
	blocked: boolean
}