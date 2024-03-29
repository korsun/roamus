import { Response } from 'express'

export const errorHandler = (error: Error, _, res: Response) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode

	res.status(statusCode)
	res.json({
		message: error.message,
		stack: error.stack,
	})
}
