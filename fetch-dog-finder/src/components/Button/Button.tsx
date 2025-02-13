import clsx from 'clsx'
import type {
	ButtonProps,
	ButtonSubmit,
	ButtonType,
} from './Button.types'
import './button.module.scss'

const Button = ({
	children,
	color = 'secondary',
	className,
	disabled,
	hideTextMobile = false,
	onClick = () => {},
	type = 'button',
	variant = 'solid',
}: ButtonProps) => {
	const classes = clsx({
		button: true,
		[`button--${variant}`]: variant,
		[`button--${color}`]: color !== 'secondary',
		'button--mobile': hideTextMobile,
		[`${className}`]: className,
	})

	const props: Omit<ButtonProps, 'children'> = {
		disabled,
		onClick,
		type,
	}

	switch (type) {
		case 'submit':
			return (
				<div className={ classes }>
					<input { ...props as ButtonSubmit } value={ children as string } />
				</div>
			)
		case 'button':
		default:
			return (
				<div className={ classes }>
					<button { ...props as ButtonType }>{ children }</button>
				</div>
			)
	}
}

Button.displayName = 'Button'
export { Button }
