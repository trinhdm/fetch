import clsx from 'clsx'
import type {
	ButtonProps,
	ButtonSubmit,
	ButtonType,
} from './Button.types'
import './button.module.scss'

const Button = ({
	children,
	className,
	inline = false,
	onClick = () => {},
	type = 'button',
	variant = 'solid',
}: ButtonProps) => {
	const classNames = clsx({
		button: true,
		'button--inline': inline,
		[`${className}`]: className,
		[`button--${variant}`]: variant,
	})

	const props: Omit<ButtonSubmit | ButtonType, 'children'> = {
		onClick,
		type,
	}

	switch (type) {
		case 'submit':
			return (
				<div className={ classNames }>
					<input { ...props as ButtonSubmit } value={ children as string } />
				</div>
			)
		case 'button':
		default:
			return (
				<div className={ classNames }>
					<button { ...props as ButtonType }>{ children }</button>
				</div>
			)
	}
}

Button.displayName = 'Button'
export { Button }
