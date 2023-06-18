export class GraphHopperLimitError extends Error {
	status?: number
	constructor(message: string, status?: number) {
		super(message)

		this.status = status

		// https://github.com/microsoft/TypeScript/issues/13965
		Object.setPrototypeOf(this, GraphHopperLimitError.prototype)
	}
}