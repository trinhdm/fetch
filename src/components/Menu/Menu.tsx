import clsx from 'clsx'
import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { getChildrenByDisplayName } from '@utils/children'
import { Button } from '@components/Button'
import type { ButtonLink, ButtonType } from '@components/Button/Button.types'
import type { KeyboardEvent, MouseEvent } from 'react'
import type {
	MenuItemProps,
	MenuProps,
	MenuToggleProps,
} from './Menu.types'
import './menu.module.scss'

const Menu = ({
	children,
	className,
	disabled,
	id,
	scrollable = true,
}: MenuProps) => {
	const [isVisible, setIsVisible] = useState(false)

	const menuRef = useRef(null)

	const classes = clsx('menu', {
		'menu--scrollable': scrollable,
		'menu--visible': isVisible,
	}, className)

	const getSubComponent = (targetName: string) => {
		const baseArgs = { children, targetName }
		const args = targetName === 'MenuItem'
			? { ...baseArgs, props: { disabled, isVisible } }
			: baseArgs

		return getChildrenByDisplayName(args)
	}

	const handleDropdown = (event:
		| KeyboardEvent<HTMLElement>
		| MouseEvent<HTMLElement>
	) => {
		switch (event.type) {
			case 'mouseleave':
				setIsVisible(false)
				break
			case 'mouseenter':
				setIsVisible(true)
				break
			case 'keydown':
				if ((event as KeyboardEvent<HTMLElement>).key === 'Enter')
					setIsVisible(true)
				else if ((event as KeyboardEvent<HTMLElement>).key === 'Escape')
					setIsVisible(false)
				break
			default:
				break
		}
	}

	return (
		<div
			className={ classes }
			id={ id }
			onKeyDown={ handleDropdown }
			onMouseEnter={ handleDropdown }
			onMouseLeave={ handleDropdown }
			ref={ menuRef }
		>
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
	isVisible = true,
	onClick,
	...props
}: MenuItemProps) => {
	const { pathname } = useLocation()

	const classes = clsx('menu__item', {
		'menu__item--active': isActive,
	}, className)

	const itemProps = href ? ({
		disabled: href === pathname || !isVisible,
		href,
		type: 'link',
	} as Omit<ButtonLink, 'children'>) : ({
		disabled: !isVisible,
		onClick,
		type: 'button',
	} as Omit<ButtonType, 'children'>)

	const sharedProps = {
		...props,
		...itemProps,
	}

	return (
		<li className={ classes }>
			<Button { ...sharedProps } variant="text">
				{ children }
			</Button>
		</li>
	)
}

const Toggle = ({
	children,
	...props
}: MenuToggleProps) => (
	<Button
		{ ...props }
		className="menu__toggle"
		variant="text"
	>
		{ children }
	</Button>
)

Menu.displayName = 'Menu'
Item.displayName = 'MenuItem'
Toggle.displayName = 'MenuToggle'

Menu.Item = Item
Menu.Toggle = Toggle

export { Menu }
