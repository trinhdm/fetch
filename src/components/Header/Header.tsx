import clsx from 'clsx'
import type { HeaderProps } from './Header.types'
import './header.module.scss'

const Header = ({
	children,
	className,
}: HeaderProps) => {
	const classes = clsx('header', className)

	return (
		<header className={ classes }>
			<div className="header__wrapper">
				{ children }
			</div>
		</header>
	)
}

Header.displayName = 'Header'
export { Header }
