import {
	BiCog,
	BiSlider,
	BiSolidDog,
} from 'react-icons/bi'
import { logout } from '@utils/services'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Logo } from '@components/Logo'
import './header.module.scss'

const Header = ({
	handleSidebar = () => {},
}) => {
	const { handleUser, name } = useUserContext()!

	const handleLogout = async () => {
		try {
			await logout()
			handleUser('logout')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<header>
			<div>
				<Logo />
			</div>
			<nav>
				<div className="settings">
					<span>Welcome, { name }</span>
					<BiCog />
					<ul className="settings__dropdown">
						<li className="settings__item">Favorites</li>
						<li className="settings__item" onClick={ handleLogout }>Logout</li>
					</ul>
				</div>
				<Button onClick={ handleSidebar } variant="outline">
					Filter & Sort
					<BiSlider />
				</Button>
				<Button>
					Find Your Match
					<BiSolidDog />
				</Button>
			</nav>
		</header>
	)
}

Header.displayName = 'Header'
export { Header }
