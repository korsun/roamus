import React from 'react'

import s from './Error.module.css'

type Props = {
	message?: string
}

export const Error = ({ message }: Props) => {
	if (!message) return null

	return <div className={s.message}>{message}</div>
}
