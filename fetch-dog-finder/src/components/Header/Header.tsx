import {
	BiCog,
	BiSlider,
	BiSolidDog,
} from 'react-icons/bi'
import { useCallback } from 'react'
import { useUserContext } from '@providers/UserProvider'
import { fetchMatch, logout } from '@utils/services'
import { Button } from '@components/Button'
import { Logo } from '@components/Logo'
import { Menu } from '@components/Menu'
import type { HeaderProps } from './Header.types'
import './header.module.scss'

const Header = ({
	handleSidebar = () => {},
}: HeaderProps) => {
	const {
		favorites,
		handleUser,
		name,
	} = useUserContext()!

	const handleLogout = async () => {
		try {
			await logout()
			handleUser('logout')
		} catch (error) {
			console.log(error)
		}
	}

	const handleMatch = useCallback(async () => {
		try {
			const match = await fetchMatch(favorites)
			console.log({ match })
		} catch (error) {
			console.log(error)
		}
	}, [favorites])

	// useEffect(() => {
	// 	const matchData = async () => {
	// 		const result = await fetchMatch(dogs)
	// 		console.log(result)
	// 	}

	// 	matchData()
	// }, [dogs])

	return (
		<header className="header">
			<div className="header__wrapper">
				<Logo />
				<nav className="header__nav">
					<Menu className="settings">
						<Menu.Toggle>
							<span className="settings__welcome">
								<span>Welcome,&nbsp;</span><i>{ name }</i>
							</span>
							<BiCog />
						</Menu.Toggle>
						<Menu.Item>
							View Favorites
						</Menu.Item>
						<Menu.Item onClick={ handleLogout }>
							Logout
						</Menu.Item>
					</Menu>
					<Button
						hideTextMobile
						onClick={ handleSidebar }
						variant="outline"
					>
						Filter & Sort
						<BiSlider />
					</Button>
					<Button hideTextMobile onClick={ handleMatch }>
						Find Your Match
						<BiSolidDog />
					</Button>
				</nav>
			</div>
		</header>
	)
}

Header.displayName = 'Header'
export { Header }
