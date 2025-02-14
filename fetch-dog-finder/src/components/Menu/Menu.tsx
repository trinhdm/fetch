import clsx from 'clsx'
import { getChildrenByDisplayName } from '@utils/children'
import type {
	MenuItemProps,
	MenuProps,
	MenuToggleProps,
} from './Menu.types'
import './menu.module.scss'
import { Button } from '@components/Button'

const Menu = ({
	children,
	className,
}: MenuProps) => {
	const classes = clsx({
		menu: true,
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
	onClick = () => {},
}: MenuItemProps) => (
	<li className="menu__item">
		<Button onClick={ onClick } variant="text">{ children }</Button>
	</li>
)

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
