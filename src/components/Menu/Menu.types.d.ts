import type { MouseEvent, ReactNode } from 'react'

interface MenuBaseProps {
	children: ReactNode
	className?: string
	disabled?: boolean
	id?: string
}

interface MenuItemProps extends MenuBaseProps {
	href?: string
	isActive?: boolean
	isVisible?: boolean
	name?: string
	onClick?: (event: MouseEvent<HTMLElement>) => void
	value?: number | string
}

type MenuToggleProps = MenuBaseProps

interface MenuProps extends MenuBaseProps {
	// children:
	// 	| (ReactElement<MenuItemProps> | ReactElement<MenuItemProps>[])
	// 	| ReactElement<MenuToggleProps>
	scrollable?: boolean
}

export type {
	MenuItemProps,
	MenuProps,
	MenuToggleProps,
}
