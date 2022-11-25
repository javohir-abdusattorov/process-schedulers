export async function wait(ms: number): Promise<void> {
	await new Promise(done => setTimeout(done, ms))
}

export const TM = 500