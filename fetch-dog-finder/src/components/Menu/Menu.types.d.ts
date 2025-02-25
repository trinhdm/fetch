import type { ReactNode } from 'react'

interface MenuBaseProps {
	children: ReactNode
	className?: string
}

interface MenuItemProps extends MenuBaseProps {
	href?: string
	isActive?: boolean
	name?: string
	onClick?:
		| (() => void)
		| ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void)
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
