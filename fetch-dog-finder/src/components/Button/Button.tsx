import clsx from 'clsx'
import type {
	ButtonProps,
	ButtonSubmit,
	ButtonType,
} from './Button.types'
import './button.module.scss'

const Button = ({
	as,
	children,
	className,
	onClick = () => {},
	type = 'button',
}: ButtonProps) => {
	const classNames = clsx({
		button: true,
		[`${className}`]: className,
		[`button--${as}`]: !!as && as !== 'button',
	})

	const props = {
		onClick,
		type,
	}

	switch (type) {
		case 'submit':
			return (
				<div className={ classNames }>
					<input { ...props as ButtonSubmit } value={ children } />
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
