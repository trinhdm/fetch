import clsx from 'clsx'
import { Link } from 'react-router'
import type {
	ButtonLink,
	ButtonProps,
	ButtonSubmit,
	ButtonType,
} from './Button.types'
import './button.module.scss'

const Button = ({
	children,
	className,
	disabled,
	hideTextMobile = false,
	href,
	onClick = () => {},
	type = 'button',
	variant = 'solid',
	...props
}: ButtonProps) => {
	const classes = clsx('button', {
		[`button--${variant}`]: variant,
		'button--mobile': hideTextMobile,
	}, className)

	const sharedProps: Omit<ButtonProps, 'children'> = {
		className: 'button__inner',
		disabled,
		onClick,
		tabIndex: disabled ? -1 : 0,
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
					<Link { ...sharedProps as ButtonLink } to={ href! }>
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
