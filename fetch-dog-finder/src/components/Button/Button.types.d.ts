import type { ReactNode } from 'react'

interface ButtonBase {
	className?: string
	color?:
		| 'primary'
		| 'secondary'
		| 'tertiary'
	disabled?: boolean
	hideTextMobile?: boolean
	variant?:
		| 'icon'
		| 'outline'
		| 'solid'
		| 'text'
}

interface ButtonType {
	children: ReactNode
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	type?: 'button'
}

interface ButtonSubmit {
	children: string
	onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
	type: 'submit'
}

type ButtonProps = ButtonBase & (
	| ButtonType
	| ButtonSubmit
)

export type {
	ButtonProps,
	ButtonSubmit,
	ButtonType,
}
