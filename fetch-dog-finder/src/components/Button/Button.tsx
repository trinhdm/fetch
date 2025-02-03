import clsx from 'clsx'
import type { ButtonProps } from './Button.types'
import './button.module.scss'

const Button = ({
	children,
	className,
	onClick = () => {},
	type = 'button',
}: ButtonProps) => {
	const classNames = clsx({
		button: true,
		[`${className}`]: className,
	})

	const props = {
		onClick,
		type,
	}

	switch (type) {
		case 'submit':
			return (
				<div className={ classNames }>
					<input { ...props } value={ children } />
				</div>
			)
		case 'button':
		default:
			return (
				<div className={ classNames }>
					<button { ...props }>{ children }</button>
				</div>
			)
	}
}

Button.displayName = 'Button'
export { Button }
