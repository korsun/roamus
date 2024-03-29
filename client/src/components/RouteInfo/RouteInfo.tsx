import s from './RouteInfo.module.css'

type Props = {
	icon: JSX.Element
	title: string
	text: string
}

export const RouteInfo = ({ icon, title, text }: Props) => (
	<div className={s.icon}>
		{icon}
		<div>{title}</div>
		<div>{text}</div>
	</div>
)
