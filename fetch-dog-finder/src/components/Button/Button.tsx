import clsx from 'clsx'
import { Link } from 'react-router'
import type {
	ButtonProps,
	ButtonSubmit,
	ButtonType,
} from './Button.types'
import './button.module.scss'

const Button = ({
	children,
	className,
	color = 'secondary',
	disabled,
	hideTextMobile = false,
	href,
	onClick = () => {},
	type = 'button',
	variant = 'solid',
	...props
}: ButtonProps) => {
	const classes = clsx({
		button: true,
		[`button--${variant}`]: variant,
		[`button--${color}`]: color !== 'secondary',
		'button--mobile': hideTextMobile,
		[`${className}`]: className,
	})

	const sharedProps: Omit<ButtonProps, 'children'> = {
		className: 'button__inner',
		disabled,
		onClick,
		...props
	}

	switch (type) {
		case 'submit':
			return (
				<div className={ classes }>
					<input
						{ ...sharedProps as ButtonSubmit }
						value={ children as string }
						type={ type }
					/>
				</div>
			)
		case 'link':
			return (
				<div className={ classes }>
					<Link { ...sharedProps as ButtonType } to={ href! }>
						{ children }
					</Link>
				</div>
			)
		case 'button':
		default:
			return (
				<div className={ classes }>
					<button { ...sharedProps as ButtonType } type={ type }>
						{ children }
					</button>
				</div>
			)
	}
}

Button.displayName = 'Button'
export { Button }
