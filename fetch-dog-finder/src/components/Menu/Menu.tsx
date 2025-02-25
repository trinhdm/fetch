import clsx from 'clsx'
import { getChildrenByDisplayName } from '@utils/children'
import { Button } from '@components/Button'
import type { ButtonLink, ButtonType } from '@components/Button/Button.types'
import type {
	MenuItemProps,
	MenuProps,
	MenuToggleProps,
} from './Menu.types'
import './menu.module.scss'

const Menu = ({
	children,
	className,
	scrollable = true,
}: MenuProps) => {
	const classes = clsx({
		menu: true,
		'menu--scrollable': scrollable,
		[`${className}`]: className,
	})

	const getSubComponent = (
		targetName: string
	) => getChildrenByDisplayName({ children, targetName })

	return (
		<div className={ classes }>
			{ getSubComponent('MenuToggle') }

			<div className="menu__dropdown">
				<ul className="menu__list">
					{ getSubComponent('MenuItem') }
				</ul>
			</div>
		</div>
	)
}

const Item = ({
	children,
	className,
	href,
	isActive,
	onClick,
	...props
}: MenuItemProps) => {
	const classes = clsx({
		'menu__item': true,
		'menu__item--active': isActive,
		[`${className}`]: className,
	})

	const itemProps = href ? ({
		href,
		type: 'link',
		...props
	} as ButtonLink) : ({
		onClick,
		type: 'button',
		...props
	} as Extract<ButtonType, 'children'>)

	return (
		<li className={ classes }>
			<Button { ...itemProps } variant="text">
				{ children }
			</Button>
		</li>
	)
}

const Toggle = ({
	children,
}: MenuToggleProps) => (
	<Button className="menu__toggle" variant="text">
		{ children }
	</Button>
)

Menu.displayName = 'Menu'
Item.displayName = 'MenuItem'
Toggle.displayName = 'MenuToggle'

Menu.Item = Item
Menu.Toggle = Toggle

export { Menu }
