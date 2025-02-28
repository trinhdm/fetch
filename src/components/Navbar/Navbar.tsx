import { useCallback } from 'react'
import { matchPath, useLocation } from 'react-router'
import { BiCog, BiSlider, BiSolidDog } from 'react-icons/bi'
import { logout } from '@utils/services'
import { usePageContext } from '@providers/PageProvider'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Menu } from '@components/Menu'
import './navbar.module.scss'

const Navbar = () => {
	const {
		favorites,
		handleUser,
		name,
	} = useUserContext()!

	const { handleMatch, toggleSidebar } = usePageContext()!
	const { pathname } = useLocation()
	const isFavoritesPath = matchPath('/favorites', pathname)

	const handleLogout = useCallback(
		async () => {
			let isMounted = true

			try {
				await logout()
			} catch (err) {
				console.error('Error logging out:', err)
			} finally {
				if (isMounted)
					handleUser({ isLoggedIn: false })
			}

			return () => { isMounted = false }
		}, [handleUser]
	)

	return (
		<nav className="navbar">
			<Menu className="navbar__settings" scrollable={ false }>
				<Menu.Toggle>
					<span>
						<span className="navbar__welcome">Welcome,&nbsp;</span>
						<span className="navbar__username">{ name }</span>
					</span>
					<BiCog />
				</Menu.Toggle>
				<Menu.Item disabled={ !!isFavoritesPath } href="/favorites">
					View Favorites
				</Menu.Item>
				<Menu.Item onClick={ handleLogout }>
					Logout
				</Menu.Item>
			</Menu>

			<Button
				hideTextMobile
				disabled={ !!isFavoritesPath }
				onClick={ toggleSidebar }
				variant="outline"
			>
				Filter & Sort
				<BiSlider />
			</Button>

			<Button
				hideTextMobile
				disabled={ !favorites.length }
				onClick={ handleMatch }
			>
				Find Your Match
				<BiSolidDog />
			</Button>
		</nav>
	)
}

Navbar.displayName = 'Navbar'
export { Navbar }
