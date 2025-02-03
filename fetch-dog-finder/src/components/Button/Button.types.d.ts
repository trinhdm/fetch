interface ButtonProps {
	children: string
	className?: string
	onClick?: (event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void
	type?: 'button' | 'submit'
}

export type { ButtonProps }
