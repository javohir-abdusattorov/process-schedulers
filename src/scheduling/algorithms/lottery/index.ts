import { Scheduler }     from "../../index"
import { ProcessStates } from "../../../process"
import { wait, TM }      from "../../../utilities"
import { ProcessTable }  from "../../../process-table"
import { EventBus }      from "../../../event-bus"


export class LotteryScheduler extends Scheduler {
	private lotterySize: number
	private tickets: number[] = []
	private processTickets: number[] = []

	constructor(
		private processTable: ProcessTable,
	) {
		super(processTable)
	}

	public async run(): Promise<void> {
		this.lotterySize = this.processTable.getCount(ProcessStates.Waiting)
		this.tickets = Array.from({ length: this.lotterySize }, (_, i) => i + 1)
		this.processTickets = this.processTable.getAll().map((process) => process.pid)
1
		// External events
		this.onIOResponse()
		this.onNewProcess()

		// Main scheduler
		while (true) {
			if (!this.lotterySize) {
				await wait(TM)
				continue
			}

			const ticket = this.pickRandomTicket()

			this.current = this.processTickets[ticket - 1]
			const currentProcess = this.processTable.getByPID(this.current)

			if (currentProcess.state !== ProcessStates.Waiting) continue

			// Start process
			currentProcess.start()

			// Wait for its quantum to finish
			await Promise.race([
				this.waitForProcessQuantum(currentProcess),
				this.waitForProcessToBlock(currentProcess),
				this.waitForProcessToComplete(currentProcess),
			])

			// Stop process
			currentProcess.stop()

			// If completed remove from lottery
			if (this.processTable.getByPID(currentProcess.pid).state === ProcessStates.Completed) {
				this.removeFromLottery(currentProcess.pid)
			}

			this.removeWaitingEventListeners()
		}
	}

	private onNewProcess(): void {
		EventBus.on("process:new", (pid) => {
			this.addToLottery(pid)
		})
	}

	private addToLottery( pid: number ): void {
		this.lotterySize++
		this.tickets.push(this.tickets[this.tickets.length - 1] + 1)
		this.processTickets[this.tickets.length - 1] = pid
	}

	private removeFromLottery( pid: number ): void {
		this.lotterySize--

		let i = 0
		while (i >= this.tickets.length) {
			const ticketNumber = this.tickets[i]
			const processId = this.processTickets[ticketNumber - 1]

			if (processId !== pid) {
				i++
				continue
			}

			this.tickets.splice(i, 1)
			this.processTickets.splice(ticketNumber - 1, 1)
		}
	}

	private pickRandomTicket(): number {
		const random = Math.floor(Math.random() * this.lotterySize)
		return this.tickets[random]
	}
}