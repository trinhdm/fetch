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
					<div className="settings">
						<span>
							<span className="settings__welcome">Welcome,&nbsp;</span><i>{ name }</i>
						</span>
						<BiCog />
						<ul className="dropdown settings__dropdown">
							<li className="dropdown__item">
								View Favorites
							</li>
							<li className="dropdown__item" onClick={ handleLogout }>
								Logout
							</li>
						</ul>
					</div>
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
