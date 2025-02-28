import type { MouseEvent, ReactNode } from 'react'

interface ButtonBase {
	className?: string
	color?:
		| 'primary'
		| 'secondary'
		| 'tertiary'
	disabled?: boolean
	hideTextMobile?: boolean
	onClick?:
		| ((event: MouseEvent<HTMLElement>) => void)
		| ((...args) => void)
	tabIndex?: number
	variant?:
		| 'icon'
		| 'outline'
		| 'solid'
		| 'tag'
		| 'text'
	value?:
		| number
		| string
}

interface ButtonType {
	children: ReactNode
	href?: never
	type?: 'button'
}

interface ButtonLink {
	children: ReactNode
	href?: string
	type?: 'link'
}

interface ButtonSubmit {
	children: string
	href?: never
	type: 'submit'
}

type ButtonProps = ButtonBase & (
	| ButtonLink
	| ButtonSubmit
	| ButtonType
)

export type {
	ButtonLink,
	ButtonProps,
	ButtonSubmit,
	ButtonType,
}
