import type { ReactNode } from 'react'

interface MenuItemProps {
	children: ReactNode
	onClick?: () => void
}

interface MenuToggleProps {
	children: ReactNode
}

interface MenuProps {
	// children:
	// 	| (ReactElement<MenuItemProps> | ReactElement<MenuItemProps>[])
	// 	| ReactElement<MenuToggleProps>
	children: ReactNode
	className?: string
}

export type {
	MenuItemProps,
	MenuProps,
	MenuToggleProps,
}
