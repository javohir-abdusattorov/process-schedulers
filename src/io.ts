import { EventBus } from "./event-bus"
import { wait, TM } from "./utilities"


export class IO {
	public start(): void {
		EventBus.on(
			"io:request",
			async ( pid: number ): Promise<void> => {
				console.log(`[IO] REQUEST - ${pid}`)
				await wait(10 * TM)
				console.log(`[IO] RESPONSE - ${pid}`)
				EventBus.emit("io:response", pid)
			}
		)
	}
}
