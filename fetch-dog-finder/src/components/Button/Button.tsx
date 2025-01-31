import type { ButtonProps } from './Button.types'
import './button.module.scss'

const Button = ({
	children,
	onClick = () => {},
}: ButtonProps) => {
	return (
		<button onClick={ onClick }>
			{ children }
		</button>
	)
}

Button.displayName = 'Button'
export { Button }
