import {
	BiCog,
	BiSlider,
	BiSolidDog,
} from 'react-icons/bi'
import {
	logout,
	retrieveDogs,
	retrieveMatch,
} from '@utils/services'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Menu } from '@components/Menu'
import type { NavbarProps } from './Navbar.types'
import './navbar.module.scss'

const Navbar = ({
	handleModal = () => {},
	handleSidebar = () => {},
}: NavbarProps) => {
	const {
		favorites,
		handleUser,
		name,
	} = useUserContext()!

	const handleMatch = async () => {
		try {
			const { match: id } = await retrieveMatch(favorites)
			const [match] = await retrieveDogs([id])
			handleUser({ match })
		} catch (error) {
			console.log(error)
		} finally {
			handleModal()
		}
	}

	const handleLogout = async () => {
		try {
			await logout()
			handleUser({ isLoggedIn: false })
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<nav className="navbar">
			<Menu className="navbar__settings">
				<Menu.Toggle>
					<span>
						<span className="navbar__welcome">Welcome,&nbsp;</span>
						<span className="navbar__username">{ name }</span>
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
